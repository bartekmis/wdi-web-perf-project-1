import { useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper';

import 'swiper/scss';
import 'swiper/scss/navigation';
import { getBgColour, getHeadlineSize } from '@/lib/theme-utils';
import Headline from '../Headline';

const ProcessSlider = ({
  items,
  thumbsColour,
  inView,
}: {
  items: any[];
  thumbsColour: number;
  inView: boolean;
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [mainSwiper, setMainSwiper] = useState<any>(null);

  return (
    <>
      <div className='swiper-process relative mt-16'>
        <div className='absolute bg-black w-[100vw] h-[1px] top-1/2 left-0'></div>

        <div
          className={`container-large animation-slideInLeft ${
            inView ? 'animated' : ''
          }`}
        >
          <Swiper
            className='!px-[36px] md:!px-[48px] xl:!px-[60px] 3xl:!px-[72px]'
            modules={[Thumbs, Navigation]}
            watchSlidesProgress={true}
            slidesPerView={2}
            spaceBetween={12}
            onSwiper={setThumbsSwiper}
            breakpoints={{
              360: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 48,
              },
              1200: {
                slidesPerView: 6,
                spaceBetween: 48,
              },
              1600: {
                slidesPerView: 6,
                spaceBetween: 60,
              },
            }}
          >
            {items.map((item: any, index: number) => {
              return (
                <SwiperSlide
                  key={`thumb__${index}`}
                  className='flex justify-center'
                >
                  <button
                    className={`w-[60px] h-[60px] md:w-[72px] md:h-[72px] lg:w-[96px] lg:h-[96px] 3xl:w-[120px] 3xl:h-[120px] rounded-[50%] hover:bg-yellow transition ${getBgColour(
                      thumbsColour
                    )}`}
                    title={item.title || ''}
                  >
                    <span className='font-medium text-[32px] md:text-[36px] lg:text-[44px] 3xl:text-[72px]'>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <div className='swiper-navigation'>
          <div
            className={`swiper-navigation__wrapper container-extra-large animation-slideInLeft ${
              inView ? 'animated' : ''
            }`}
          >
            <button
              className='swiper-navigation__btn swiper-navigation__btn--prev'
              onClick={() => mainSwiper.slidePrev()}
            >
              <div className='icon-wrapper'>
                <FaPlay className='icon' />
                <FaPlay className='icon-duplicate' />
              </div>
            </button>
            <button
              className='swiper-navigation__btn swiper-navigation__btn--next'
              onClick={() => mainSwiper.slideNext()}
            >
              <div className='icon-wrapper'>
                <FaPlay className='icon-duplicate' />
                <FaPlay className='icon' />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className='relative mt-20'>
        <div className='absolute bg-black w-[100vw] h-[1px] top-1/2 left-0'></div>

        <div
          className={`container animation-slideInLeft ${
            inView ? 'animated' : ''
          }`}
        >
          <Swiper
            slidesPerView={1}
            spaceBetween={48}
            grabCursor={true}
            modules={[Thumbs]}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            onSwiper={setMainSwiper}
          >
            {items.map((item: any, index: number) => {
              return (
                <SwiperSlide key={index} className='self-center'>
                  <div className='bg-yellow rounded-[48px] lg:rounded-[96px] p-9 lg:px-16 4:px-32 flex flex-col lg:flex-row'>
                    <div className='lg:grow-0 lg:shrink-0 lg:basis-[40%] flex gap-6 lg:gap-9 4xl:gap-16 items-center flex-col lg:flex-row'>
                      <p className='headline-display !leading-none'>
                        {String(index + 1).padStart(2, '0')}
                      </p>

                      {item.title && (
                        <Headline type={item.title_tag} className={`${getHeadlineSize(item.title_size) || 'headline-3'} text-center lg:text-left`}>
                          {item.title}
                        </Headline>
                      )}
                    </div>

                    <div className='lg:grow-0 lg:shrink-0 lg:basis-[calc(60%-72px)] content lg:pl-9 lg:ml-9 4xl:pl-16 4xl:ml-16 lg:border-black lg:border-l mt-6 lg:mt-0'>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default ProcessSlider;
