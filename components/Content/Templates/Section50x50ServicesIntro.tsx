import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
  getBgColour,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import ContentImage from '@/components/Components/ContentImage';
import Decoration from '@/components/Components/Decoration';
import DecorationLine from '@/components/Components/DecorationLine';
import Headline from '@/components/Components/Headline';

const Section50x50ServicesIntro = ({ data }: { data: any }) => {
  const sectionSettings: SectionSettings = {
    bgColour: data.section_background_colour,
    paddingTop: data.section_padding_top,
    paddingBottom: data.section_padding_bottom,
    containerSize: data.section_container_size,
    fontSize: data.section_font_size,
    textAlignment: data.section_text_alignment,
  };

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const DynamicCurtainsServicesCard = dynamic(
    () => import('../../Components/Curtains/CurtainsServicesCard')
  );

  return (
    <section
      ref={ref}
      id={data.id}
      className={`
        section
        overflow-hidden
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <Decoration
        type={data.decoration_type}
        colour={data.decoration_colour}
        position={data.decoration_position}
        className='animation-expandIn origin-top-left'
      />

      <div className={getContainerSize(sectionSettings.containerSize)}>
        <div className='grid gap-6 md:grid-cols-12 xl:gap-9 3xl:gap-12'>
          {data.headline && (
            <div className='relative md:col-span-9 xl:col-span-6'>
              <Headline
                type={data.headline_tag}
                className={`${getHeadlineSize(
                  data.headline_size
                )} animation-fadeIn`}
              >
                {data.headline}
              </Headline>

              <DecorationLine
                direction='right'
                className='hidden md:block top-[20px] xl:top-[12px] !left-[calc(100%+36px)] 3xl:!left-[calc(100%+48px)] animation-drawInRight'
              />
            </div>
          )}

          {data.description && (
            <div
              className={`relative md:col-span-9 xl:col-span-5 content xl:pr-4 xl:${getBgColour(
                data.section_background_colour
              )}`}
            >
              <p className='animation-fadeIn'>{data.description}</p>
            </div>
          )}
        </div>

        <div className='grid gap-6 md:grid-cols-12 xl:gap-9 3xl:gap-12 mt-6 md:mt-16'>
          {!!data.cards.length &&
            data.cards.map((card: any, index: number) => {
              if (card.image && card.image_hover && inView) {
                return (
                  <DynamicCurtainsServicesCard
                    key={index}
                    card={card}
                    layoutClass={
                      data.is_three_columns ? 'md:col-span-4' : 'md:col-span-6'
                    }
                  />
                );
              }

              if (card.image && !card.image_hover) {
                return (
                  <Link
                    key={index}
                    href={card.url}
                    title={card.title || ''}
                    className={`group  flex flex-col ${
                      data.is_three_columns ? 'md:col-span-4' : 'md:col-span-6'
                    }`}
                  >
                    <figure className='relative pb-[56.25%] animation-revealFromCircle'>
                      <ContentImage
                        className='absolute w-full h-full object-cover z-[1]'
                        id={card.image}
                        sizes='(max-width: 767px) 100vw, 50vw'
                      />
                      <Decoration
                        type={card.decoration_type}
                        colour={card.decoration_colour}
                        position={card.decoration_position}
                        variant='image'
                        className='hidden md:block animation-fadeIn'
                      />
                    </figure>

                    {(card.title || card.description) && (
                      <div className='flex flex-col mt-4 xl:mt-6 3xl:mt-9'>
                        {card.title && (
                          <Headline
                            type={card.title_tag}
                            className={`${getHeadlineSize(card.title_size)} underline decoration-transparent group-hover:decoration-black transition duration-300 animation-fadeIn`}
                          >
                            {card.title}
                          </Headline>
                        )}

                        {card.description && (
                          <div className='content mt-2 xl:mt-4 animation-fadeIn'>
                            <p>{card.description}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Link>
                );
              }
            })}
        </div>
      </div>
    </section>
  );
};

export default Section50x50ServicesIntro;
