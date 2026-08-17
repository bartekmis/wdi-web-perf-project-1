import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
  getButtonVariant,
  getButtonConnection,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import { CaseStudiesContext } from '@/contexts/case-studies';
import { CaseStudy, CaseStudyAssociation } from '@/types/case-study';
import Button from '@/components/Components/Button';
import CaseStudyCard from '@/components/Components/CaseStudyCard';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';
import Headline from '@/components/Components/Headline';

const SectionFeaturedCaseStudies = ({ data }: { data: any }) => {
  const router = useRouter();
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
  const overridenCategories =
    data.case_studies_category as CaseStudyAssociation[];

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const DynamicCurtainsCaseStudyCard = dynamic(
    () => import('../../Components/Curtains/CurtainsCaseStudyCard')
  );

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
      } else {
        // get all case studies except the current route
        filteredCaseStudies = allCaseStudies.filter(
          (caseStudy) => caseStudy.slug !== router.query.slug
        );
      }

      // get case studies of overriden category
      if (!!overridenCategories?.length) {
        filteredCaseStudies = filteredCaseStudies.filter((caseStudy) => {
          return caseStudy.caseStudyCategories.edges.some((item) => {
            return (
              overridenCategories[0].id === item.node.databaseId.toString()
            );
          });
        });
      }

      return filteredCaseStudies;
    };

    const caseStudies = handleCaseStudies();
    setCaseStudies(caseStudies.slice(0, 2)); // return two records
  }, [
    allCaseStudies,
    overridenCaseStudies,
    overridenCategories,
    router.query.slug,
  ]);

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
          <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} mb-9 xl:mb-12 animation-fadeIn`}>
            {data.headline}
          </Headline>
        )}

        {!!caseStudies.length && (
          <div className='grid gap-12 md:grid-cols-2'>
            {caseStudies.map((caseStudy) => {
              if (caseStudy.lead.image_main && caseStudy.lead.image_hover && inView) {
                return (
                  <DynamicCurtainsCaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
                );
              }

              if (caseStudy.lead.image_main && !caseStudy.lead.image_hover) {
                return (
                  <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
                );
              }
            })}
          </div>
        )}

        {!!data.btns?.length && (
          <div className='flex flex-wrap justify-end gap-4 mt-16'>
            {data.btns.map((btn: any, index: number) => {
              return (
                <Button
                  key={index}
                  component={Link}
                  href={btn.url}
                  title={btn.title}
                  text={btn.title}
                  variant={getButtonVariant(btn.style)}
                  connection={getButtonConnection(btn.connection)}
                ></Button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionFeaturedCaseStudies;
