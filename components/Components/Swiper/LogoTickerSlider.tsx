import { ReactNode } from 'react';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import 'swiper/scss';
import 'swiper/scss/autoplay';

import { CaseStudy } from '@/types/case-study';
import ContentImage from '../ContentImage';
import { ConditionalWrapper } from '@/lib/helper-utils';

const LogoTickerSlider = ({
  caseStudies,
  logos,
}: {
  caseStudies: CaseStudy[];
  logos: any[];
}) => {
  return (
    <Swiper
      className='group swiper-autoplay'
      slidesPerView={3}
      spaceBetween={48}
      grabCursor={true}
      loop={true}
      centeredSlides={true}
      modules={[Autoplay]}
      speed={5000}
      autoplay={{
        delay: 1,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      breakpoints={{
        768: {
          slidesPerView: 4,
        },
        1200: {
          slidesPerView: 6,
        },
      }}
    >
      {!!caseStudies.length &&
        caseStudies.map((caseStudy, index: number) => {
          return (
            <SwiperSlide
              key={index}
              className='!h-auto !flex justify-center items-center'
            >
              <Link href={`/case-studies/${caseStudy.slug}`}>
                <ContentImage
                  className='max-h-[144px] object-contain group-hover:[&:not(:hover)]:opacity-50 transition duration-300'
                  id={caseStudy.lead.logo.id}
                  width={+caseStudy.lead.logo.width}
                  height={+caseStudy.lead.logo.height}
                />
              </Link>
            </SwiperSlide>
          );
        })}

      {!!logos?.length &&
        logos.map((logo: any, index: number) => {
          return (
            <SwiperSlide
              key={index}
              className='!h-auto !flex justify-center items-center'
            >
              <ConditionalWrapper
                condition={!!logo.url}
                wrapper={(children: ReactNode) => (
                  <Link href={logo.url || ''} title='Go to brand'>
                    {children}
                  </Link>
                )}
              >
                <ContentImage
                  className='max-h-[144px] object-contain group-hover:[&:not(:hover)]:opacity-50 transition duration-300'
                  id={logo.image}
                  width={logo.image_width}
                  height={logo.image_height}
                />
              </ConditionalWrapper>
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default LogoTickerSlider;
