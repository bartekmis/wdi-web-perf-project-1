import { ReactNode } from 'react';
import Link from 'next/link';

import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import ContentImage from '@/components/Components/ContentImage';
import { ConditionalWrapper } from '@/lib/helper-utils';
import Headline from '@/components/Components/Headline';

const SectionLogoGrid = ({ data }: { data: any }) => {
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
        {data.headline && (
          <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} animation-fadeIn`}>
            {data.headline}
          </Headline>
        )}

        {!!data.logos?.length && (
          <div className='group grid gap-12 md:gap-16 grid-cols-2 md:grid-cols-3 xl:grid-cols-6 mt-16 md:mt-20'>
            {data.logos.map((logo: any, index: number) => {
              return (
                <figure
                  key={index}
                  className='flex justify-center items-center'
                >
                  <ConditionalWrapper
                    condition={!!logo.url}
                    wrapper={(children: ReactNode) => (
                      <Link
                        href={logo.url || ''}
                        title={logo.title || 'Go to brand'}
                      >
                        {children}
                      </Link>
                    )}
                  >
                    <ContentImage
                      className='max-h-[144px] object-contain group-hover:[&:not(:hover)]:opacity-50 transition duration-300'
                      id={logo.image}
                      width={logo.image_width}
                      height={logo.image_height}
                    />
                  </ConditionalWrapper>
                </figure>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionLogoGrid;
