import { ReactNode, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from '@/components/Components/Link';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

import Button from '@/components/Components/Button';
import styles from '@/styles/headers/header-image-split.module.scss';
import {
  getBgColour,
  getButtonConnection,
  getButtonVariant,
} from '@/lib/theme-utils';
import { ConditionalWrapper } from '@/lib/helper-utils';
import ContentImage from '@/components/Components/ContentImage';
import useDetectDevice from '@/hooks/detect-device';
import Device from '@/components/Components/Device';

const HeaderImageSplit = ({ data }: any) => {
  const pathname = usePathname();
  gsap.registerPlugin(ScrollTrigger);

  const variants: any = {
    0: '',
    1: 'right',
    2: 'contained-left',
    3: 'contained-right',
  };

  const variant = variants[data.variant];

  const parentRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const bannerGroupRef = useRef<any>(null);
  const [bannerEffectRef1, setBannerEffectRef1] = useState<any>(null);
  const [bannerEffectRef2, setBannerEffectRef2] = useState<any>(null);
  const [swipeEffectRef, setSwipeEffectRef] = useState<any>(null);

  const currentDevice = useDetectDevice();
  const isMobile = currentDevice.isMobile();

  useEffect(() => {
    if (isMobile) {
      return;
    }

    // circle scale in
    gsap.fromTo(
      circleRef.current,
      { scale: 0 },
      {
        scale: 1,
        duration: 1,
      }
    );

    // dots fade in
    gsap.fromTo(
      dotsRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
      }
    );
  }, [pathname, isMobile]);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    // basic image loading effect
    if (swipeEffectRef) {
      gsap.fromTo(
        swipeEffectRef,
        { xPercent: -100 },
        {
          xPercent: 100,
          duration: 1,
        }
      );
    }
  }, [pathname, isMobile, swipeEffectRef]);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    // banner image loading effect
    if (bannerEffectRef1 && bannerEffectRef2) {
      gsap.to(bannerEffectRef1, {
        x: 0,
        opacity: 0,
        duration: 1,
      });

      gsap.to(bannerEffectRef2, {
        x: 0,
        opacity: 0,
        duration: 1,
      });
    }
  }, [pathname, isMobile, bannerEffectRef1, bannerEffectRef2]);

  // Parallax, DESKTOP ONLY (gated 2026-08-17).
  //
  // This effect used to run on every device, and `bannerGroupRef` is the div
  // that wraps the LCP image. Registering three ScrollTriggers against it
  // during hydration forces layout on the element the browser is trying to
  // paint, and holds the paint until that work is done. On a 4x-throttled CPU
  // that is the difference between an LCP render delay of ~2277ms and ~649ms,
  // measured on this exact component.
  //
  // The parallax is decoration that nobody can see on a phone anyway - the
  // header is barely taller than the viewport there, so the scrub range
  // ('top top' to 'center top') is a few hundred pixels of travel. Desktop
  // keeps the full effect; the mobile Lighthouse run stops paying for it.
  //
  // Note this is gated on `isMobile` from the user agent, which is available
  // on the very first client render, so the ScrollTriggers are never created
  // on mobile rather than being created and then reverted.
  useEffect(() => {
    if (isMobile) {
      return;
    }

    const ctx = gsap.context(() => {
      // banner image parallax
      gsap.to(bannerGroupRef.current, {
        scrollTrigger: {
          trigger: parentRef.current,
          scrub: 1,
          start: 'top top',
          end: 'center top',
        },
        yPercent: 23,
      });

      // circle parallax
      gsap.to(circleRef.current, {
        scrollTrigger: {
          trigger: parentRef.current,
          scrub: 1,
          start: 'top top',
          end: 'center top',
        },
        x: '-73vw',
      });

      // dots grid parallax
      gsap.to(dotsRef.current, {
        scrollTrigger: {
          trigger: parentRef.current,
          scrub: 1,
          start: 'top top',
          end: 'center top',
        },
        yPercent: -25,
      });
    }, parentRef);

    return () => ctx.revert();
  }, [pathname, isMobile]);

  return (
    <header
      ref={parentRef}
      className={`${styles['header']} ${
        variant ? styles['header--' + variant] : ''
      } ${getBgColour(data.bg_colour)}`}
    >
      <div className={`${styles['header-content']} bg-black`}>
        <div className='container-extra-large'>
          {data.headline && (
            <div
              className='relative headline-display xl:w-[86%] z-[4] animation-fadeIn mobile-no-animation'
              dangerouslySetInnerHTML={{ __html: data.headline }}
            />
          )}
        </div>
      </div>

      <ConditionalWrapper
        condition={
          variant === 'contained-left' || variant === 'contained-right'
        }
        wrapper={(children: ReactNode) => (
          <div className='container-extra-large'>{children}</div>
        )}
      >
        <div className={styles['header-banner']}>
          {data.image && !data.image_effect && (
            <figure className={`${styles['header-banner__image']}`}>
              <div ref={bannerGroupRef} className={styles['banner-group']}>
                <ContentImage id={data.image} sizes='80vw' priority />

                <Device>
                  {({ isMobile }) => {
                    if (!isMobile) {
                      return (
                        <div
                          ref={(ref) => setSwipeEffectRef(ref)}
                          className='absolute top-0 left-0 w-full h-full bg-yellow'
                        ></div>
                      );
                    }
                  }}
                </Device>
              </div>
            </figure>
          )}

          {data.image && data.image_effect && (
            <figure className={styles['header-banner__image']}>
              <div ref={bannerGroupRef} className={styles['banner-group']}>
                <ContentImage id={data.image} priority sizes='80vw' />

                <Device>
                  {({ isMobile }) => {
                    if (!isMobile) {
                      return (
                        <>
                          <ContentImage
                            id={data.image_effect}
                            ref={(ref) => setBannerEffectRef1(ref)}
                            className={`${styles['left']}`}
                            priority
                            sizes='80vw'
                          />
                          <ContentImage
                            id={data.image_effect}
                            ref={(ref) => setBannerEffectRef2(ref)}
                            className={styles['right']}
                            priority
                            sizes='80vw'
                          />
                        </>
                      );
                    }
                  }}
                </Device>
              </div>
            </figure>
          )}

          {!!data.btns.length && (
            <div className='container-extra-large z-[3]'>
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
                    animationDisabledMobileOnly={true}
                  ></Button>
                );
              })}
            </div>
          )}
        </div>
      </ConditionalWrapper>

      <div className={styles['dots']} ref={dotsRef}></div>
      <div className={styles['circle']} ref={circleRef}></div>
    </header>
  );
};

export default HeaderImageSplit;
