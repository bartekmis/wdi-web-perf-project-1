import ContentImage from '@/components/Components/ContentImage';
import Decoration from '@/components/Components/Decoration';
import DecorationLine from '@/components/Components/DecorationLine';
import Headline from '@/components/Components/Headline';
import Map from '@/components/Components/Map';
import { getSectionSettings, getContainerSize, getHeadlineSize } from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import Link from 'next/link';

const SectionLocationAndMap = ({ data }: { data: any }) => {
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
        <div className='grid lg:grid-cols-3'>
          <div className='relative overflow-hidden lg:pl-12 3xl:pl-24 lg:col-[1/3]'>
            <figure className='relative pb-[100%] md:pb-[66%] 4xl:pb-[56.25%]'>
              <ContentImage
                className='absolute top-0 left-0 w-full h-full object-cover'
                sizes='100vw'
                id={data.image}
              />
            </figure>

            <div className='absolute top-1/2 translate-y-[-50%] left-0 p-6 xl:p-9 3xl:px-32 3xl:py-16 bg-yellow text-black max-w-[90%] lg:max-w-[75%] 3xl:max-w-[65%] rounded-r-[400px] overflow-hidden'>
              <Decoration
                type={2}
                colour={1}
                variant='custom'
                className='w-[80%] pb-[80%] absolute top-1/2 right-0 translate-y-[-50%] translate-x-[40%] opacity-[25%] animation-fadeIn'
              />

              {data.headline && (
                <div className='relative'>
                  <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size) || 'headline-2'} pr-12 3xl:pr-0 animation-fadeIn`}>
                    {data.headline}
                  </Headline>

                  <DecorationLine
                    direction='left'
                    className='!top-[30px] !right-[calc(100%+24px)] animation-drawInLeft'
                  />
                </div>
              )}
              {data.address && (
                <address
                  className='not-italic relative mt-6 lg:mt-12 content animation-fadeIn'
                  dangerouslySetInnerHTML={{ __html: data.address }}
                ></address>
              )}
              {data.directions_url && (
                <Link
                  href={data.directions_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='link link--basic font-medium hover:text-[var(--white)] animation-fadeIn'
                >
                  Get Directions
                </Link>
              )}
            </div>
          </div>

          <div className='relative lg:col-[3/4] pb-[56.25%] lg:pb-0'>
            {data.longitude && data.latitude && (
              <Map
                className='!absolute lg:relative'
                latitude={+data.latitude}
                longitude={+data.longitude}
                fullscreen={true}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionLocationAndMap;
