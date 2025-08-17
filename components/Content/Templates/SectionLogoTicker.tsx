import { useContext, useEffect, useState } from 'react';

import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import { CaseStudiesContext } from '@/contexts/case-studies';
import { CaseStudy, CaseStudyAssociation } from '@/types/case-study';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';
import Headline from '@/components/Components/Headline';

const SectionLogoTicker = ({ data }: { data: any }) => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);

  const sectionSettings: SectionSettings = {
    bgColour: data.section_background_colour,
    paddingTop: data.section_padding_top,
    paddingBottom: data.section_padding_bottom,
    containerSize: data.section_container_size,
    fontSize: data.section_font_size,
    textAlignment: data.section_text_alignment,
  };

  const allCaseStudies = useContext(CaseStudiesContext) as CaseStudy[];
  const overridenCaseStudies =
    data.case_studies_overriden as CaseStudyAssociation[];

  useEffect(() => {
    const handleCaseStudies = () => {
      let filteredCaseStudies: CaseStudy[] = [];

      if (!!overridenCaseStudies?.length) {
        // get overriden case studies
        filteredCaseStudies = allCaseStudies.filter((caseStudy) => {
          return overridenCaseStudies.some((item) => {
            return item.id === caseStudy.databaseId.toString();
          });
        });
      }

      return filteredCaseStudies;
    };

    const caseStudies = handleCaseStudies();
    setCaseStudies(caseStudies);
  }, [allCaseStudies, overridenCaseStudies]);

  const LogoTickerSlider = dynamic(
    () => import('../../Components/Swiper/LogoTickerSlider')
  );

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      id={data.id}
      className={`
        section
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <div className={getContainerSize(sectionSettings.containerSize)}>
        {data.headline && (
          <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} animation-fadeIn`}>
            {data.headline}
          </Headline>
        )}
      </div>

      <div className='container-fluid mt-12'>
        {inView && (
          <LogoTickerSlider caseStudies={caseStudies} logos={data.logos} />
        )}
      </div>
    </section>
  );
};

export default SectionLogoTicker;
