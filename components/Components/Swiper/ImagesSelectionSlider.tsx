import { Swiper as SwiperType, FreeMode, Navigation, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/free-mode';
import 'swiper/scss/navigation';
import 'swiper/scss/autoplay';

import { useRef } from 'react';
import ContentImage from '../ContentImage';
import { FaPlay } from 'react-icons/fa';

const ImagesSelectionSlider = ({ images, autoplay = false, speed }: { images: any[], autoplay: boolean, speed: number }) => {
  const swiperRef = useRef<SwiperType>();

  const imageSizes: any = {
    0: 'max-w-[90%] md:max-w-[75%] lg:max-w-[45%]',
    1: 'max-w-[75%] md:max-w-[60%] lg:max-w-[33%]',
    2: 'max-w-[60%] md:max-w-[45%] lg:max-w-[25%]',
  };

  const getImageSize = (index: number) => {
    return imageSizes[index];
  };

  return (
    <Swiper
      className={`relative h-[400px] md:h-[480px] 2xl:h-[600px] 4xl:h-[720px] ${autoplay ? 'swiper-autoplay' : ''}`}
      slidesPerView='auto'
      spaceBetween={24}
      freeMode={true}
      loop={true}
      grabCursor={true}
      centeredSlides={true}
      speed={autoplay ? speed : undefined}
      modules={[FreeMode, Navigation, Autoplay]}
      autoplay={autoplay ? {
        delay: 1,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      } : undefined}
      onBeforeInit={(swiper) => {
        swiperRef.current = swiper;
      }}
    >
      {images.map((item: any, index: number) => {
        if (!item.image) {
          return <></>;
        }

        return (
          <SwiperSlide
            className={`flex items-center !w-auto ${getImageSize(item.size)}`}
            key={`image-${item.image}-${index}`}
          >
            <figure>
              <ContentImage
                id={item.image}
                sizes='(max-width: 1024px) 90vw, 33vw'
              />
            </figure>
          </SwiperSlide>
        );
      })}

      <div className='swiper-navigation'>
        <div className='swiper-navigation__wrapper container-extra-large'>
          <button
            className='swiper-navigation__btn swiper-navigation__btn--prev'
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <div className='icon-wrapper'>
              <FaPlay className='icon' />
              <FaPlay className='icon-duplicate' />
            </div>
          </button>
          <button
            className='swiper-navigation__btn swiper-navigation__btn--next'
            onClick={() => swiperRef.current?.slideNext()}
          >
            <div className='icon-wrapper'>
              <FaPlay className='icon-duplicate' />
              <FaPlay className='icon' />
            </div>
          </button>
        </div>
      </div>
    </Swiper>
  );
};

export default ImagesSelectionSlider;
