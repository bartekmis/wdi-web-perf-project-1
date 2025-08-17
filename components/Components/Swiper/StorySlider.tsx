import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';

import { useRef } from 'react';
import Decoration from '../Decoration';
import { getBgColour, getHeadlineSize, getTextColour } from '@/lib/theme-utils';
import Headline from '../Headline';

const StorySlider = ({ items }: { items: any[] }) => {
  const decorationRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Decoration
        ref={decorationRef}
        type={1}
        colour={0}
        variant='custom'
        className='w-[240px] pb-[240px] top-1/2 translate-x-[-50%] translate-y-[-50%] transition-[left] duration-[0.5s]'
      />
      <div className='absolute h-[1px] w-full bg-black top-1/2'></div>

      <Swiper
        className='!px-[18px] md:!px-[48px] xl:!px-[96px] 3xl:!px-[144px]'
        slidesPerView={1.5}
        spaceBetween={24}
        grabCursor={true}
        loop={false}
        breakpoints={{
          768: {
            spaceBetween: 36,
          },
          991: {
            slidesPerView: 2.5,
            spaceBetween: 36,
          },
          1600: {
            slidesPerView: 3.5,
            spaceBetween: 36,
          },
        }}
        onProgress={(e) => {
          const progress: number = Math.round(e.progress * 100);

          if (decorationRef.current && progress >= 0 && progress <= 100) {
            decorationRef.current.style.left = `${progress}%`;
          }
        }}
      >
        {!!items.length &&
          items.map((item: any, index: number) => {
            return (
              <SwiperSlide key={index} className='!h-auto !flex'>
                <div
                  className={`${getBgColour(
                    item.bg_colour
                  )} p-6 md:p-9 3xl:px-16 3xl:py-12 rounded-[36px]`}
                >
                  {item.year && (
                    <p
                      className={`headline-3 ${getTextColour(
                        item.year_colour
                      )}`}
                    >
                      {item.year}
                    </p>
                  )}


                  {item.headline && (
                    <Headline type={item.headline_tag} className={`${getHeadlineSize(item.headline_size) || 'headline-5'} mt-4`}>
                      {item.headline}
                    </Headline>
                  )}

                  {item.description && (
                    <div className='content mt-6'>
                      <p>{item.description}</p>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </>
  );
};

export default StorySlider;
