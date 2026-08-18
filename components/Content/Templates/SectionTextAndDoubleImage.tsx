import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
  getButtonVariant,
  getButtonConnection,
  getBgColour,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import ContentImage from '@/components/Components/ContentImage';
import Button from '@/components/Components/Button';
import Decoration from '@/components/Components/Decoration';
import DecorationLine from '@/components/Components/DecorationLine';
import Headline from '@/components/Components/Headline';

const SectionTextAndDoubleImage = ({ data }: { data: any }) => {
  gsap.registerPlugin(ScrollTrigger);

  const sectionSettings: SectionSettings = {
    bgColour: data.section_background_colour,
    paddingTop: data.section_padding_top,
    paddingBottom: data.section_padding_bottom,
    containerSize: data.section_container_size,
    fontSize: data.section_font_size,
    textAlignment: data.section_text_alignment,
  };

  const parentRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(circleRef.current, {
        scrollTrigger: {
          trigger: parentRef.current,
          start: 'top-=200 top',
        },
        scale: 1,
      });

      gsap.to(dotsRef.current, {
        scrollTrigger: {
          trigger: parentRef.current,
          start: 'top-=200 top',
        },
        opacity: 1,
      });

      gsap.to(circleRef.current, {
        scrollTrigger: {
          trigger: parentRef.current,
          scrub: 1,
          start: 'top-=200 top',
          end: 'center top',
        },
        y: '-96px',
      });

      gsap.to(dotsRef.current, {
        scrollTrigger: {
          trigger: parentRef.current,
          scrub: 1,
          start: 'top-=200 top',
          end: 'center top',
        },
        y: '96px',
      });
    }, parentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={parentRef}
      id={data.id}
      className={`
        section
        overflow-hidden
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <div className={getContainerSize(sectionSettings.containerSize)}>
        <div className='grid gap-9 md:gap-12 xl:grid-cols-2 xl:items-center'>
          <div className='flex flex-col gap-6 md:gap-12 3xl:gap-20'>
            {data.headline && (
              <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} animation-fadeIn`}>
                {data.headline}
              </Headline>
            )}

            <div className='relative pl-9 md:pl-12 xl:px-12 3xl:px-36 flex flex-col gap-6 xl:gap-9 3xl:gap-12'>
              {data.description && (
                <div className='content'>
                  <DecorationLine
                    direction='left'
                    bgClassName={getBgColour(data.decoration_line_colour)}
                    className='top-[12px] !right-[calc(100%-18px)] md:!right-[calc(100%-24px)] 3xl:!right-[calc(100%-96px)] animation-drawInLeft'
                  />
                  <div className='animation-fadeIn' dangerouslySetInnerHTML={{ __html: data.description }}></div>
                </div>
              )}

              {!!data.btns.length && (
                <div className='flex flex-wrap gap-4'>
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

          <div className='relative'>
            <figure className='relative w-[80%] pb-[55%] ml-auto z-[1] xl:w-[93%] xl:pb-[62%] animation-revealFromCircle'>
              <ContentImage
                className='absolute w-full h-full object-cover'
                id={data.image_primary}
                sizes="(max-width: 1999px) 80vw, 40vw"
              />
            </figure>
            <figure className='relative -mt-[10%] w-[70%] pb-[45%] xl:w-[78%] xl:pb-[52%] xl:-ml-[48px] animation-revealFromCircle'>
              <ContentImage
                className='absolute w-full h-full object-cover '
                id={data.image_secondary}
                sizes="(max-width: 1999px) 80vw, 40vw"
              />
            </figure>

            <Decoration
              ref={circleRef}
              type={1}
              colour={0}
              variant='custom'
              className='w-[45%] pb-[45%] left-[-18px] top-[50%] translate-y-[-50%] md:left-[-48px] xl:left-[-96px] xl:w-[55%] xl:pb-[55%] scale-0'
            />

            <Decoration
              ref={dotsRef}
              type={2}
              colour={2}
              variant='custom'
              className='w-[35%] pb-[35%] right-[18px] bottom-[18px] xl:right-[36px] xl:bottom-[36px] xl:w-[43%] xl:pb-[43%] 3xl:right-[48px] 3xl:bottom-[48px] z-[1] opacity-0'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionTextAndDoubleImage;
