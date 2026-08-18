import ContentImage from '@/components/Components/ContentImage';
import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
  getButtonVariant,
  getButtonConnection,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import { useRef } from 'react';
import { FaPlay } from 'react-icons/fa';
import styles from '@/styles/sections/section-case-study-before-and-after.module.scss';
import Button from '@/components/Components/Button';
import Link from 'next/link';
import Headline from '@/components/Components/Headline';

const SectionCaseStudyBeforeAndAfter = ({ data }: { data: any }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionSettings: SectionSettings = {
    bgColour: data.section_background_colour,
    paddingTop: data.section_padding_top,
    paddingBottom: data.section_padding_bottom,
    containerSize: data.section_container_size,
    fontSize: data.section_font_size,
    textAlignment: data.section_text_alignment,
  };

  return (
    <section
      id={data.id}
      className={`
        section
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <div className={getContainerSize(sectionSettings.containerSize)}>
        {!data.is_portrait && (
          <>
            {data.headline && (
              <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} text-center animation-fadeIn`}>
                {data.headline}
              </Headline>
            )}

            {data.text && (
              <div className='content mt-6 md:mt-9 text-center animation-fadeIn' dangerouslySetInnerHTML={{ __html: data.text }}></div>
            )}

            <div className={`${styles['wrapper']} mt-12`} ref={wrapperRef}>
              <div className={styles['image-container']}>
                <ContentImage
                  className={`${styles['image']} ${styles['image--before']}`}
                  id={data.image_before}
                />
                <ContentImage
                  className={`${styles['image']} ${styles['image--after']}`}
                  id={data.image_after}
                />
              </div>

              <input
                className={styles['slider']}
                type='range'
                min={0}
                max={100}
                value={50}
                aria-label='Percentage of before photo shown'
                onChange={(e) =>
                  wrapperRef.current?.style.setProperty(
                    '--position',
                    `${e.target.value}%`
                  )
                }
              />
              <div className={styles['slider-line']} aria-hidden='true'></div>
              <div className={styles['slider-button']} aria-hidden='true'>
                <FaPlay
                  className={`${styles['icon']} ${styles['icon--left']}`}
                />
                <FaPlay
                  className={`${styles['icon']} ${styles['icon--right']}`}
                />
              </div>
            </div>
          </>
        )}

        {data.is_portrait && (
          <div className='overflow-hidden grid md:grid-cols-2 md:items-center md:gap-24 xl:gap-60'>
            <div className='flex flex-col'>
              {data.headline && (
                <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} animation-fadeIn`}>
                  {data.headline}
                </Headline>
              )}

              {data.text && (
                <div className='content mt-6 md:mt-9 animation-fadeIn' dangerouslySetInnerHTML={{ __html: data.text }}></div>
              )}

              {!!data.btns?.length && (
                <div className='flex flex-wrap gap-4 mt-9 md:mt-12'>
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

            <div
              className={`${styles['wrapper']} ${styles['wrapper--portrait']} mt-12 md:mt-0`}
              ref={wrapperRef}
            >
              <div className={styles['image-container']}>
                <ContentImage
                  className={`${styles['image']} ${styles['image--before']}`}
                  id={data.image_before}
                />
                <ContentImage
                  className={`${styles['image']} ${styles['image--after']}`}
                  id={data.image_after}
                />
              </div>

              <input
                className={styles['slider']}
                type='range'
                min={0}
                max={100}
                value={50}
                aria-label='Percentage of before photo shown'
                onChange={(e) =>
                  wrapperRef.current?.style.setProperty(
                    '--position',
                    `${e.target.value}%`
                  )
                }
              />
              <div className={styles['slider-line']} aria-hidden='true'></div>
              <div className={styles['slider-button']} aria-hidden='true'>
                <FaPlay
                  className={`${styles['icon']} ${styles['icon--left']}`}
                />
                <FaPlay
                  className={`${styles['icon']} ${styles['icon--right']}`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionCaseStudyBeforeAndAfter;
