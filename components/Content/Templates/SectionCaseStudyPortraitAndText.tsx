import ContentImage from '@/components/Components/ContentImage';
import DecorationLine from '@/components/Components/DecorationLine';
import Headline from '@/components/Components/Headline';
import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';

const SectionCaseStudyPortraitAndText = ({ data }: { data: any }) => {
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
        <div className='grid gap-12 xl:gap-20 xl:grid-cols-2 xl:items-center 3xl:gap-54'>
          <div
            className={`flex flex-col animation-fadeIn ${
              data.is_reversed ? 'order-2' : 'order-1'
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
          </div>

          {data.image && (
            <figure
              className={`w-full flex flex-col ${
                data.is_reversed ? 'order-1 items-end' : 'order-2 items-start'
              }`}
            >
              <div className='relative w-full pb-[144%] animation-revealFromCircle'>
                <ContentImage
                  className='absolute w-full h-full object-cover'
                  id={data.image}
                />
              </div>

              {(data.caption && !data.is_reversed) && (
                <figcaption
                  className={`relative mt-4.5 text-sm md:text-lg font-medium pr-6`}
                >
                  <DecorationLine direction='right' className='animation-drawInRight' />
                  <span className='animation-fadeIn'>{data.caption}</span>
                </figcaption>
              )}
              
              {(data.caption && data.is_reversed) && (
                <figcaption
                  className={`relative mt-4.5 text-sm md:text-lg font-medium pl-6`}
                >
                  <span className='animation-fadeIn'>{data.caption}</span>
                  <DecorationLine direction='left' className='animation-drawInLeft' />
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </div>
    </section>
  );
};

export default SectionCaseStudyPortraitAndText;
