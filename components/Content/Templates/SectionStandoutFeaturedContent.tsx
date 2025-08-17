import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

import {
  getSectionSettings,
  getContainerSize,
  getBgColour,
  getHeadlineSize,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import ContentImage from '@/components/Components/ContentImage';
import Decoration from '@/components/Components/Decoration';
import styles from '@/styles/sections/section-standout-featured-content.module.scss';
import Headline from '@/components/Components/Headline';

const SectionStandoutFeaturedContent = ({ data }: { data: any }) => {
  gsap.registerPlugin(ScrollTrigger);

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
  const buttons: HTMLButtonElement[] = [];
  const images: HTMLElement[] = [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(circleRef.current, {
        scrollTrigger: {
          trigger: parentRef.current,
          scrub: 1,
          start: `top-=250px top`,
          end: `bottom-=250px top`,
        },
        top: '90px',
      });
    }, parentRef);

    return () => ctx.revert();
  }, []);

  const handleClick = (index: number) => {
    const currentButton = buttons[index];
    buttons.forEach((btn) =>
      btn.parentElement?.classList.remove(styles['active'])
    );
    currentButton.parentElement?.classList.add(styles['active']);

    const oldImage = images.find((img) =>
      img.classList.contains(styles['active'])
    );
    oldImage?.classList.remove(styles['active'], styles['animated']);
    oldImage?.classList.add(styles['inactive'], styles['animated']);

    const currentImage = images[index];
    currentImage.classList.remove(styles['inactive'], styles['animated']);
    currentImage.classList.add(styles['active'], styles['animated']);
  };

  return (
    <section
      ref={parentRef}
      id={data.id}
      className={`
        section
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <div
        className={`${getBgColour(data.bg_half_colour)} ${
          data.bg_half_position === 1 ? 'bottom-0' : 'top-0'
        } absolute w-full h-1/2`}
      ></div>

      <div className={getContainerSize(sectionSettings.containerSize)}>
        <div className={styles['block']}>
          <div className={styles['block__content']}>
            <Decoration
              ref={circleRef}
              type={1}
              colour={0}
              variant='custom'
              className='w-[21%] pb-[21%] absolute bottom-[36px] right-0 translate-x-[50%] z-[1]'
            />

            {data.headline && (
              <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size) || 'headline-3'}`}>
                {data.headline}
              </Headline>
            )}

            {!!data.items.length && (
              <ul className={styles['menu']}>
                {data.items.map((item: any, index: number) => {
                  return (
                    <li
                      key={index}
                      className={`${styles['menu__item']} ${
                        index === 0 ? styles['active'] : ''
                      }`}
                    >
                      <button
                        ref={(ref: HTMLButtonElement) => (buttons[index] = ref)}
                        type='button'
                        className={styles['menu__btn']}
                        onClick={() => handleClick(index)}
                      >
                        {item.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className={styles['block__image-wrapper']}>
            {!!data.items.length &&
              data.items.map((item: any, index: number) => {
                return (
                  <figure
                    key={index}
                    ref={(ref: HTMLElement) => (images[index] = ref)}
                    className={`${styles['block__figure']} ${
                      index === 0 ? styles['active'] : ''
                    }`}
                  >
                    <ContentImage
                      className={styles['block__image']}
                      sizes="(max-width: 1199px) 100vw, 50vw"
                      id={item.image || data.fallback_image}
                    />

                    <figcaption className={styles['block__description']}>
                      {item.title && (
                        <Headline type={item.title_tag} className={`${getHeadlineSize(item.title_size) || 'headline-4'}`}>
                          {item.title}
                        </Headline>
                      )}

                      {item.description && (
                        <div className='content mt-4'>
                          <p>{item.description}</p>
                        </div>
                      )}
                    </figcaption>
                  </figure>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionStandoutFeaturedContent;
