import ContentImage from '@/components/Components/ContentImage';
import DecorationLine from '@/components/Components/DecorationLine';
import VideoPlayer from '@/components/Components/VideoPlayer';
import { ConditionalWrapper } from '@/lib/helper-utils';
import { getSectionSettings, getContainerSize } from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import Link from 'next/link';
import { ReactNode } from 'react';

const SectionCaseStudyLargeImage = ({ data }: { data: any }) => {
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
        {(data.image || data.video_id) && (
          <figure className='w-full flex flex-col items-start'>
            {data.image &&
              !data.video_id &&
              (!!data.url ? (
                <Link
                  className='relative w-full pb-[56.25%] animation-revealFromCircle'
                  href={data.url}
                  title={data.title || ''}
                >
                  <ContentImage
                    className='absolute w-full h-full object-cover'
                    sizes='100vw'
                    id={data.image}
                  />
                </Link>
              ) : (
                <div className='relative w-full pb-[56.25%] animation-revealFromCircle'>
                  <ContentImage
                    className='absolute w-full h-full object-cover'
                    sizes='100vw'
                    id={data.image}
                  />
                </div>
              ))}

            {data.video_id && (
              <div className='w-full animation-revealFromCircle'>
                <VideoPlayer
                  id={data.video_id}
                  autoplay={false}
                  poster={data.poster}
                />
              </div>
            )}

            {data.caption && (
              <figcaption className='relative mt-4.5 text-sm md:text-lg font-medium pr-6'>
                <span className='animation-fadeIn'>{data.caption}</span>
                <DecorationLine
                  direction='right'
                  className='animation-drawInRight'
                />
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </section>
  );
};

export default SectionCaseStudyLargeImage;
