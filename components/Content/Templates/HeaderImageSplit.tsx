import { ReactNode, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import Button from '@/components/Components/Button';
import styles from '@/styles/headers/header-image-split.module.scss';
import {
  getBgColour,
  getButtonConnection,
  getButtonVariant,
} from '@/lib/theme-utils';
import { ConditionalWrapper } from '@/lib/helper-utils';
import ContentImage from '@/components/Components/ContentImage';
import Device from '@/components/Components/Device';
import useDesktopScrollEffect from '@/hooks/desktop-scroll-effect';

const HeaderImageSplit = ({ data }: any) => {
  const pathname = usePathname();

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

  // ZMIANA 2026-08-18: wszystkie efekty tego headera ida teraz przez
  // `useDesktopScrollEffect` - odpalaja sie tylko na desktopie i dociagaja gsap-a
  // dynamicznym importem.
  //
  // Trzy pierwsze efekty (wjazd kola, kropek, przesloniecie obrazka) i tak juz
  // mialy `if (isMobile) return`, wiec na telefonie nie robily NIC - a mimo to
  // statyczny `import { gsap }` wciagal cala biblioteke z ScrollTriggerem do
  // bundle'a kazdego urzadzenia.
  //
  // Czwarty efekt - parallax bannera, kola i siatki kropek - jako jedyny NIE
  // sprawdzal urzadzenia i chodzil rowniez na telefonie. To trzy ScrollTriggery
  // ze `scrub`, czyli praca doczepiona do kazdej klatki scrolla, na elementach
  // siedzacych bezposrednio nad obrazkiem LCP.
  // Lighthouse 13 (mobile, Moto G Power) przypisal chunkowi z gsapem 2516 ms
  // `bootup-time` - najwiecej ze wszystkiego na stronie.
  //
  // Dekoracje w tym headerze startuja z widocznego stanu (gsap.fromTo sam
  // ustawia stan poczatkowy), wiec pominiecie animacji na telefonie niczego
  // nie ukrywa.
  useDesktopScrollEffect(
    (gsap) =>
      gsap.context(() => {
        // circle scale in
        gsap.fromTo(circleRef.current, { scale: 0 }, { scale: 1, duration: 1 });

        // dots fade in
        gsap.fromTo(dotsRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });

        // basic image loading effect
        if (swipeEffectRef) {
          gsap.fromTo(
            swipeEffectRef,
            { xPercent: -100 },
            { xPercent: 100, duration: 1 }
          );
        }

        // banner image loading effect
        if (bannerEffectRef1 && bannerEffectRef2) {
          gsap.to(bannerEffectRef1, { x: 0, opacity: 0, duration: 1 });
          gsap.to(bannerEffectRef2, { x: 0, opacity: 0, duration: 1 });
        }

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
      }, parentRef),
    [pathname, swipeEffectRef, bannerEffectRef1, bannerEffectRef2]
  );

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
