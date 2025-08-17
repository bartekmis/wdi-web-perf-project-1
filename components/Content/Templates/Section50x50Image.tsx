import {
  getContainerSize,
  getHeadlineSize,
  getSectionSettings,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import ContentImage from '@/components/Components/ContentImage';
import Decoration from '@/components/Components/Decoration';
import VideoPlayer from '@/components/Components/VideoPlayer';
import DecorationLine from '@/components/Components/DecorationLine';
import Headline from '@/components/Components/Headline';

const Section50x50Image = ({ data }: { data: any }) => {
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
        <div className='grid gap-16 xl:gap-24 3xl:gap-54 lg:grid-cols-2 items-center'>
          <div
            className={`${
              data.is_reversed ? 'order-2' : 'order-1'
            } relative z-[1] animation-fadeIn`}
          >
            {data.headline && (
              <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} mb-9`}>
                {data.headline}
              </Headline>
            )}
            
            {data.copy && (
              <div
                className='content'
                dangerouslySetInnerHTML={{ __html: data.copy }}
              />
            )}
          </div>

          {(data.image || data.video_id) && (
            <figure
              className={`relative flex flex-col ${
                data.is_reversed ? 'order-1 items-end' : 'order-2 items-start'
              }`}
            >
              {data.image && !data.video_id && (
                <div className='relative w-full'>
                  <figure className='relative w-full z-[1] animation-revealFromCircle'>
                    <ContentImage
                      id={data.image}
                      sizes="(max-width: 767px) 100vw, 50vw"
                      className='w-full'
                    />
                  </figure>
                  
                  <Decoration
                    type={data.decoration_type}
                    colour={data.decoration_colour}
                    position={data.decoration_position}
                    variant='image'
                    animate
                  />
                </div>
              )}

              {data.video_id && (
                <div className='relative w-full'>
                  <div className='relative w-full z-[1] animation-revealFromCircle'>
                    <VideoPlayer id={data.video_id} autoplay={false} poster={data.poster}/>
                  </div>

                  <Decoration
                    type={data.decoration_type}
                    colour={data.decoration_colour}
                    position={data.decoration_position}
                    variant='image'
                    animate
                  />
                </div>
              )}

              {data.caption && (
                <figcaption className={`relative mt-4.5 text-sm md:text-lg font-medium ${data.is_reversed ? 'pl-6' : 'pr-6'}`}>
                  {data.is_reversed && (
                    <DecorationLine direction='left' />
                  )}
                  <span className='animation-fadeIn'>{data.caption}</span>
                  {!data.is_reversed && (
                    <DecorationLine direction='right' className='animation-drawInRight' />
                  )}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </div>
    </section>
  );
};

export default Section50x50Image;
