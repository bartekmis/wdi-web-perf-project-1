import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';

import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
  getButtonVariant,
  getButtonConnection,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import ContentImage from '@/components/Components/ContentImage';
import Button from '@/components/Components/Button';
import Decoration from '@/components/Components/Decoration';
import styles from '@/styles/sections/section-featured-case-study.module.scss';
import { useContext, useEffect, useState } from 'react';
import { CaseStudiesContext } from '@/contexts/case-studies';
import { CaseStudy, CaseStudyAssociation } from '@/types/case-study';
import Testimonial from '@/components/Components/Testimonial';
import DecorationLine from '@/components/Components/DecorationLine';
import Headline from '@/components/Components/Headline';

const SectionFeaturedCaseStudy = ({ data }: { data: any }) => {
  const [caseStudy, setCaseStudy] = useState<CaseStudy>();

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

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const DynamicFeaturedCaseStudy = dynamic(
    () => import('../../Components/Curtains/CurtainsFeaturedCaseStudy')
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
      }

      return filteredCaseStudies;
    };

    const caseStudies = handleCaseStudies();
    setCaseStudy(caseStudies[0]);
  }, [allCaseStudies, overridenCaseStudies]);

  return (
    <section
      ref={ref}
      id={data.id}
      className={`
        ${styles['section']}
        ${
          data.is_landscape
            ? styles['section--landscape']
            : styles['section--portrait']
        }
        overflow-hidden
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <Decoration
        type={1}
        colour={0}
        variant='custom'
        className={`${styles['decoration-primary']} animation-expandIn origin-bottom`}
      />

      <div className={getContainerSize(sectionSettings.containerSize)}>
        <div
          className={`${styles['grid']} ${
            !data.description ? styles['grid--short'] : ''
          } `}
        >
          {(data.preheadline || data.headline) && (
            <div className={styles['headline']}>
              <div className='relative mb-4'>
                <DecorationLine
                  direction='left'
                  className='!right-[calc(100%+18px)] animation-drawInLeft'
                  bgClassName='bg-red'
                />
                <p className='text-red preheadline animation-fadeIn'>
                  {data.preheadline}
                </p>
              </div>

              {data.headline && (
                <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} animation-fadeIn`}>
                  {data.headline}
                </Headline>
              )}
            </div>
          )}

          {data.description && (
            <div className={styles['cta-wrapper']}>
              {data.is_landscape && (
                <Decoration
                  type={1}
                  colour={0}
                  variant='custom'
                  className={`${styles['decoration-secondary']} animation-expandIn`}
                />
              )}

              {!data.is_testimonial && (
                <Testimonial
                  text={data.description}
                  isReversed={data.is_landscape}
                />
              )}

              {data.is_testimonial && (
                <Testimonial
                  className={styles['cta']}
                  text={data.description}
                  author={data.author}
                  company={data.company}
                  fontSize={2}
                />
              )}
            </div>
          )}

          {data.image && data.image_hover && inView && (
            <DynamicFeaturedCaseStudy data={data} caseStudy={caseStudy} />
          )}

          {data.image && !data.image_hover && (
            <Link
              href={caseStudy?.slug ? `/case-studies/${caseStudy.slug}` : ''}
              title={caseStudy?.lead.company ? caseStudy.lead.company : ''}
              className={`${styles['link']} animation-revealFromCircle`}
            >
              <div className={styles['link__wrapper']}>
                <div className={styles['link__details']}>
                  {caseStudy?.lead.company && (
                    <p className='text-[18px] md:text-[20px] font-bold'>
                      {caseStudy.lead.company}
                    </p>
                  )}
                  {caseStudy?.lead.size && (
                    <p className='text-[16px] md:text-[18px]'>
                      {caseStudy.lead.size}
                    </p>
                  )}
                  {caseStudy?.lead.location && (
                    <p className='text-[16px] md:text-[18px] font-medium'>
                      {caseStudy.lead.location}
                    </p>
                  )}
                  <p
                    className={`${styles['link__details-anchor']} font-bold underline mt-4`}
                  >
                    View case study
                  </p>
                </div>

                <div
                  className={`${styles['link__figure-wrapper']} relative w-[60%] md:w-full`}
                >
                  {!data.is_landscape && (
                    <Decoration
                      type={1}
                      colour={0}
                      variant='custom'
                      className={`${styles['decoration-secondary']} animation-expandIn`}
                    />
                  )}

                  <figure className={styles['link__figure']}>
                    <ContentImage
                      className={styles['link__image']}
                      sizes="50vw"
                      id={data.image}
                    />
                  </figure>
                </div>
              </div>
            </Link>
          )}

          {!!data.btns.length && (
            <div className={`${styles['actions']}`}>
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
      </div>
    </section>
  );
};

export default SectionFeaturedCaseStudy;
