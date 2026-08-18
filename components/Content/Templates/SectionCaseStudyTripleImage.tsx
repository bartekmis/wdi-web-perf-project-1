import Link from 'next/link';
import { ReactNode } from 'react';

import ContentImage from '@/components/Components/ContentImage';
import DecorationLine from '@/components/Components/DecorationLine';
import { ConditionalWrapper } from '@/lib/helper-utils';
import {
  getSectionSettings,
  getContainerSize,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';

const SectionCaseStudyTripleImage = ({ data }: { data: any }) => {
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
        overflow-hidden
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <div className={getContainerSize(sectionSettings.containerSize)}>
        <div className='grid gap-12 md:grid-cols-3 md:gap-6 xl:gap-12'>
          {!!data.images.length &&
            data.images.map((item: any, index: number) => {
              return (
                <ConditionalWrapper
                  key={index}
                  condition={!!item.url}
                  wrapper={(children: ReactNode) => (
                    <Link href={item.url} title={item.title || ''}>
                      {children}
                    </Link>
                  )}
                >
                  <figure
                    className={`w-full flex flex-col items-start ${
                      index + 1 !== data.images.length ? 'overflow-hidden' : ''
                    }`}
                  >
                    <div className={`relative w-full animation-revealFromCircle  ${data.is_portrait ? 'pb-[128%]' : 'pb-[56.25%]'}`}>
                      <ContentImage
                        className='absolute w-full h-full object-cover'
                        sizes='33vw'
                        id={item.image}
                      />
                    </div>

                    {item.caption && (
                      <figcaption
                        className={`relative mt-4.5 text-sm md:text-lg font-medium pr-6`}
                      >
                        <span className='animation-fadeIn'>{item.caption}</span>
                        <DecorationLine direction='right' className='animation-drawInRight' />
                      </figcaption>
                    )}
                  </figure>
                </ConditionalWrapper>

              );
            })}
        </div>
      </div>
    </section>
  );
};

export default SectionCaseStudyTripleImage;
