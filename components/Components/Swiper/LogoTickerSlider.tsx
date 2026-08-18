import { ReactNode } from 'react';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from '@/components/Components/Link';
import 'swiper/scss';
import 'swiper/scss/autoplay';

import { CaseStudy } from '@/types/case-study';
import ContentImage from '../ContentImage';
import { ConditionalWrapper } from '@/lib/helper-utils';

/**
 * Without a `sizes`, next/image treats these as fixed-size images and builds the
 * srcset from the LOGO'S OWN intrinsic width and 2x that - which for the source
 * files here resolves past every entry in `imageSizes` and lands on
 * deviceSizes[0] = 640. Measured in-browser at 412x823x1.75: each logo renders
 * into a 105px box and every one of them was fetching `w=640`.
 *
 * The ticker shows 3 slides below 768px, 4 up to 1200px and 6 above, so a slide
 * is roughly a third / a quarter / a sixth of the viewport. Declaring that lets
 * the browser pick from the full srcset: at 412px wide and DPR 1.75 it now needs
 * 33vw * 1.75 = 238 device px and selects w=240 instead of w=640.
 */
const LOGO_SIZES = '(max-width: 767px) 33vw, (max-width: 1199px) 25vw, 17vw';

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
                  sizes={LOGO_SIZES}
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
                  sizes={LOGO_SIZES}
                />
              </ConditionalWrapper>
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default LogoTickerSlider;
