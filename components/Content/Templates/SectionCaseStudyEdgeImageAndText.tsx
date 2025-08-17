import Button from '@/components/Components/Button';
import ContentImage from '@/components/Components/ContentImage';
import DecorationLine from '@/components/Components/DecorationLine';
import Headline from '@/components/Components/Headline';
import VideoPlayer from '@/components/Components/VideoPlayer';
import {
  getSectionSettings,
  getHeadlineSize,
  getButtonVariant,
  getButtonConnection,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import Link from 'next/link';

const SectionCaseStudyEdgeImageAndText = ({ data }: { data: any }) => {
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
        className={`${
          data.is_reversed ? 'container-fluid-left' : 'container-fluid-right'
        }`}
      >
        <div
          className={`grid gap-12 xl:gap-20  xl:items-center 3xl:gap-36 ${
            data.is_reversed
              ? 'xl:grid-cols-[1fr_25vw]'
              : 'xl:grid-cols-[25vw_1fr]'
          }`}
        >
          <div
            className={`flex flex-col w-[var(--containerWidth)] max-w-[var(--containerMaxWidth)] mx-auto xl:w-full animation-fadeIn ${
              data.is_reversed ? 'xl:order-2' : 'xl:order-1'
            }`}
          >
            {data.headline && (
              <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)}`}>
                {data.headline}
              </Headline>
            )}

            {data.text && (
              <div className='content text-small mt-6 xl:mt-12' dangerouslySetInnerHTML={{ __html: data.text }}></div>
            )}

            {!!data.btns.length && (
              <div className='flex flex-wrap gap-4 mt-6 xl:mt-12 3xl:mt-16'>
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

          {(data.image || data.video_id) && (
            <figure
              className={`flex flex-col ${
                data.is_reversed ? 'xl:order-1' : 'xl:order-2'
              }`}
            >
              
              {(data.image && !data.video_id) && 
                <div className='relative w-full pb-[66%] animation-revealFromCircle'>
                  <ContentImage
                    className='absolute w-full h-full object-cover'
                    sizes='(max-width: 1199px) 100vw, 60vw'
                    id={data.image}
                  />
                </div>
              }

              {data.video_id && (
                <div className='w-full animation-revealFromCircle'>
                  <VideoPlayer id={data.video_id} autoplay={false} poster={data.poster}/>
                </div>
              )}

              {data.caption && (
                <div
                  className={`flex w-[var(--containerWidth)] max-w-[var(--containerMaxWidth)] mx-auto xl:w-full ${
                    data.is_reversed ? 'justify-end' : 'justify-start'
                  }`}
                >

                  {!data.is_reversed && (
                    <figcaption
                      className={`inline-block relative mt-4.5 text-sm md:text-lg font-medium pr-6`}
                    >
                      <DecorationLine direction='right' className='animation-drawInRight' />
                      <span className='animation-fadeIn'>{data.caption}</span>
                    </figcaption>
                  )}

                  {data.is_reversed && (
                    <figcaption
                      className={`inline-block relative mt-4.5 text-sm md:text-lg font-medium pl-6`}
                    >
                      <span className='animation-fadeIn'>{data.caption}</span>
                      <DecorationLine direction='left' className='animation-drawInLeft' />
                    </figcaption>
                  )}
                </div>
              )}
            </figure>
          )}
        </div>
      </div>
    </section>
  );
};

export default SectionCaseStudyEdgeImageAndText;
