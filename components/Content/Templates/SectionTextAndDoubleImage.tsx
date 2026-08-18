import { useRef } from 'react';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';

import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
  getButtonVariant,
  getButtonConnection,
  getBgColour,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import ContentImage from '@/components/Components/ContentImage';
import Button from '@/components/Components/Button';
import Decoration from '@/components/Components/Decoration';
import DecorationLine from '@/components/Components/DecorationLine';
import Headline from '@/components/Components/Headline';
import useDesktopScrollEffect from '@/hooks/desktop-scroll-effect';

const SectionTextAndDoubleImage = ({ data }: { data: any }) => {
  const sectionSettings: SectionSettings = {
    bgColour: data.section_background_colour,
    paddingTop: data.section_padding_top,
    paddingBottom: data.section_padding_bottom,
    containerSize: data.section_container_size,
    fontSize: data.section_font_size,
    textAlignment: data.section_text_alignment,
  };

  const parentRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  // Dwa zdjecia tej sekcji sa `loading="lazy"`, ale to nie wystarcza: przy
  // wolnym laczu Chrome trzyma prog lazy-loadingu na ~3000 px od viewportu,
  // wiec i tak pobieral je od razu. W pomiarze Lighthouse ruszaly o 850-851 ms,
  // czyli 75 ms po obrazku LCP, i lacznie 65,9 KB szlo rownolegle z nim -
  // 19% wszystkich bajtow w oknie LCP.
  // `useInView` z zapasem 200 px odklada je do momentu, gdy sekcja naprawde
  // zbliza sie do ekranu. Ramki `figure` maja staly stosunek bokow
  // (`pb-[55%]` / `pb-[45%]`), a zdjecia i tak sa w nich pozycjonowane
  // absolutnie, wiec pusta ramka trzyma layout i nic sie nie przesuwa (CLS 0).
  const { ref: imagesRef, inView: imagesInView } = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });

  // Odsloniecie dekoracji (scale 0 -> 1, opacity 0 -> 1) zeszlo z gsap-a na
  // wlasne klasy `animation-expandIn` / `animation-fadeIn`, ktore i tak sa juz
  // w projekcie i chodza na zwyklym IntersectionObserverze (useAnimationOnScroll).
  // Dzieki temu telefon w ogole nie pobiera gsap-a, a dekoracje nadal sie
  // pojawiaja - wczesniej `scale-0` i `opacity-0` w klasach czekaly na gsap-a,
  // wiec pominiecie go zostawiloby je niewidoczne.
  // Keyframe `expandIn` animuje wlasciwosc `scale`, a nie `transform`, wiec nie
  // gryzie sie z parallaxem ponizej, ktory rusza `y`.
  //
  // Sam parallax zostaje przy gsapie, ale tylko na desktopie i z dynamicznym
  // importem - to efekt ze `scrub`, czyli praca w kazdej klatce scrolla.
  useDesktopScrollEffect((gsap) =>
    gsap.context(() => {
      gsap.to(circleRef.current, {
        scrollTrigger: {
          trigger: parentRef.current,
          scrub: 1,
          start: 'top-=200 top',
          end: 'center top',
        },
        y: '-96px',
      });

      gsap.to(dotsRef.current, {
        scrollTrigger: {
          trigger: parentRef.current,
          scrub: 1,
          start: 'top-=200 top',
          end: 'center top',
        },
        y: '96px',
      });
    }, parentRef)
  );

  return (
    <section
      ref={parentRef}
      id={data.id}
      className={`
        section
        overflow-hidden
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <div className={getContainerSize(sectionSettings.containerSize)}>
        <div className='grid gap-9 md:gap-12 xl:grid-cols-2 xl:items-center'>
          <div className='flex flex-col gap-6 md:gap-12 3xl:gap-20'>
            {data.headline && (
              <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} animation-fadeIn`}>
                {data.headline}
              </Headline>
            )}

            <div className='relative pl-9 md:pl-12 xl:px-12 3xl:px-36 flex flex-col gap-6 xl:gap-9 3xl:gap-12'>
              {data.description && (
                <div className='content'>
                  <DecorationLine
                    direction='left'
                    bgClassName={getBgColour(data.decoration_line_colour)}
                    className='top-[12px] !right-[calc(100%-18px)] md:!right-[calc(100%-24px)] 3xl:!right-[calc(100%-96px)] animation-drawInLeft'
                  />
                  <div className='animation-fadeIn' dangerouslySetInnerHTML={{ __html: data.description }}></div>
                </div>
              )}

              {!!data.btns.length && (
                <div className='flex flex-wrap gap-4'>
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
                      ></Button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className='relative' ref={imagesRef}>
            <figure className='relative w-[80%] pb-[55%] ml-auto z-[1] xl:w-[93%] xl:pb-[62%] animation-revealFromCircle'>
              {imagesInView && (
                <ContentImage
                  className='absolute w-full h-full object-cover'
                  id={data.image_primary}
                  sizes="(max-width: 1999px) 80vw, 40vw"
                />
              )}
            </figure>
            <figure className='relative -mt-[10%] w-[70%] pb-[45%] xl:w-[78%] xl:pb-[52%] xl:-ml-[48px] animation-revealFromCircle'>
              {imagesInView && (
                <ContentImage
                  className='absolute w-full h-full object-cover '
                  id={data.image_secondary}
                  sizes="(max-width: 1999px) 80vw, 40vw"
                />
              )}
            </figure>

            <Decoration
              ref={circleRef}
              type={1}
              colour={0}
              variant='custom'
              className='w-[45%] pb-[45%] left-[-18px] top-[50%] translate-y-[-50%] md:left-[-48px] xl:left-[-96px] xl:w-[55%] xl:pb-[55%] animation-expandIn'
            />

            <Decoration
              ref={dotsRef}
              type={2}
              colour={2}
              variant='custom'
              className='w-[35%] pb-[35%] right-[18px] bottom-[18px] xl:right-[36px] xl:bottom-[36px] xl:w-[43%] xl:pb-[43%] 3xl:right-[48px] 3xl:bottom-[48px] z-[1] animation-fadeIn'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionTextAndDoubleImage;
