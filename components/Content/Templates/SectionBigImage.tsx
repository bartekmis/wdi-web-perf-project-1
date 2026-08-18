import { ReactNode } from 'react';
import Link from 'next/link';

import {
  getBgColour,
  getContainerSize,
  getSectionSettings,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import ContentImage from '@/components/Components/ContentImage';
import { ConditionalWrapper } from '@/lib/helper-utils';
import DecorationLine from '@/components/Components/DecorationLine';

const SectionBigImage = ({ data }: { data: any }) => {
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
      <div
        className={`${getBgColour(data.bg_half_colour)} ${
          data.bg_half_position === 1 ? 'bottom-0' : 'top-0'
        } absolute w-full h-1/2`}
      ></div>
      <div className={`${getContainerSize(sectionSettings.containerSize)}`}>

        {data.image && (
          <ConditionalWrapper
            condition={!!data.url}
            wrapper={(children: ReactNode) => (
              <Link href={data.url} title={data.title || ''}>
                {children}
              </Link>
            )}
          >
            <figure className='w-full flex flex-col items-start animation-revealFromCircle'>
              <div className='relative w-full pb-[56.25%]'>
                <ContentImage 
                  sizes='90vw'
                  className='absolute w-full h-full object-cover' 
                  id={data.image} />
              </div>

              {data.caption && (
                <figcaption
                  className='relative mt-4.5 text-sm md:text-lg font-medium pr-6'
                >
                  <span className='animation-fadeIn'>{data.caption}</span>
                  <DecorationLine direction='right' className='animation-drawInRight' />
                </figcaption>
              )}
            </figure>
          </ConditionalWrapper>
        )}
      </div>
    </section>
  );
};

export default SectionBigImage;
