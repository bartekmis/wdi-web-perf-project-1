import ContentImage from '@/components/Components/ContentImage';
import DecorationLine from '@/components/Components/DecorationLine';
import { getSectionSettings, getContainerSize } from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';

const SectionCaseStudyTwoImages = ({ data }: { data: any }) => {
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
        {!data.is_large_portrait && 
          <div
            className={`grid gap-12 xl:gap-16 3xl:gap-36 ${
              data.is_reversed
                ? 'xl:grid-cols-[20%_minmax(0,1fr)]'
                : 'xl:grid-cols-[minmax(0,1fr)_20%]'
            }`}
          >
            {data.image_landscape && (
              <figure
                className={`w-full flex flex-col ${
                  data.is_reversed
                    ? 'xl:row-[1/2] xl:col-[2/3] items-start'
                    : 'xl:col-[1/2] items-end'
                }`}
              >
                <div className='relative w-full pb-[56.25%] animation-revealFromCircle'>
                  <ContentImage
                    className='absolute w-full h-full object-cover'
                    sizes='50vw'
                    id={data.image_landscape}
                  />
                </div>

                {data.image_landscape_caption && (
                  <figcaption
                    className={`relative mt-4.5 text-sm md:text-lg font-medium ${data.is_reversed ? 'pr-6' : 'pl-6'}`}
                  >
                    {data.is_reversed && (
                      <DecorationLine direction='right' className='animation-drawInRight' />
                    )}
                    <span className='animation-fadeIn'>{data.image_landscape_caption}</span>
                    {!data.is_reversed && (
                      <DecorationLine direction='left' className='animation-drawInLeft' />
                    )}
                  </figcaption>
                )}
              </figure>
            )}

            {data.image_portrait && (
              <figure
                className={`w-full flex flex-col ${
                  data.is_reversed ? 'items-end' : 'items-start'
                }`}
              >
                <div className='relative w-full pb-[142%] animation-revealFromCircle'>
                  <ContentImage
                    className='absolute w-full h-full object-cover'
                    sizes='50vw'
                    id={data.image_portrait}
                  />
                </div>

                {data.image_portrait_caption && (
                  <figcaption className={`relative mt-4.5 text-sm md:text-lg font-medium ${data.is_reversed ? 'pl-6' : 'pr-6'}`}>
                    {data.is_reversed && (
                      <DecorationLine direction='left' className='animation-drawInLeft' />
                    )}
                    <span className='animation-fadeIn'>{data.image_portrait_caption}</span>
                    {!data.is_reversed && (
                      <DecorationLine direction='right' className='animation-drawInRight' />
                    )}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        }
        
        {data.is_large_portrait && 
          <div
            className={`grid gap-12 items-center xl:gap-16 3xl:gap-60 ${
              data.is_reversed
                ? 'xl:grid-cols-[30%_minmax(0,1fr)]'
                : 'xl:grid-cols-[minmax(0,1fr)_30%]'
            }`}
          >
            {data.image_portrait && (
              <figure
                className={`w-full flex flex-col ${
                  data.is_reversed
                    ? 'xl:row-[1/2] xl:col-[2/3] items-start'
                    : 'xl:col-[1/2] items-end'
                }`}
              >
                <div className='relative w-full pb-[142%] animation-revealFromCircle'>
                  <ContentImage
                    className='absolute w-full h-full object-cover'
                    sizes='50vw'
                    id={data.image_portrait}
                  />
                </div>

                {data.image_portrait_caption && (
                  <figcaption className={`relative mt-4.5 text-sm md:text-lg font-medium ${data.is_reversed ? 'pr-6' : 'pl-6'}`}>
                    {data.is_reversed && (
                      <DecorationLine direction='right' className='animation-drawInRight' />
                    )}
                    <span className='animation-fadeIn'>{data.image_portrait_caption}</span>
                    {!data.is_reversed && (
                      <DecorationLine direction='left' className='animation-drawInLeft' />
                    )}
                  </figcaption>
                )}
              </figure>
            )}

            {data.image_landscape && (
              <figure
                className={`w-full flex flex-col 
                ${
                  data.is_reversed ? 'items-end' : 'items-start'
                }
                `}
              >
                <div className='relative w-full pb-[56.25%] animation-revealFromCircle'>
                  <ContentImage
                    className='absolute w-full h-full object-cover'
                    sizes='50vw'
                    id={data.image_landscape}
                  />
                </div>

                {data.image_landscape_caption && (
                  <figcaption
                    className={`relative mt-4.5 text-sm md:text-lg font-medium ${data.is_reversed ? 'pl-6' : 'pr-6'}`}
                  >
                    {data.is_reversed && (
                     <DecorationLine direction='left' className='animation-drawInLeft' />
                    )}
                    <span className='animation-fadeIn'>{data.image_landscape_caption}</span>
                    {!data.is_reversed && (
                      <DecorationLine direction='right' className='animation-drawInRight' />
                    )}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        }
      </div>
    </section>
  );
};

export default SectionCaseStudyTwoImages;
