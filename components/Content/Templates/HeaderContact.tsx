import Link from 'next/link';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

import Decoration from '@/components/Components/Decoration';
import DecorationLine from '@/components/Components/DecorationLine';
import { useEffect, useRef } from 'react';
import GravityForm from '@/components/Components/GravityForms/GravityForm';
import { FormSettings } from '@/types/theme';
import SocialIcons from '@/components/Components/SocialIcons';
import { formatPhone } from '@/lib/helper-utils';

const HeaderContact = ({ data }: any) => {
  gsap.registerPlugin(ScrollTrigger);

  const parentRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  const formSettings: FormSettings = {
    id: data.gravity_form_id,
    bgColour: data.gravity_form_bg_colour,
    btnColour: data.gravity_form_btn_colour,
    title: data.gravity_form_title,
    title_size: data.gravity_form_title_size,
    title_tag: data.gravity_form_title_tag,
    description: data.gravity_form_description,
    footer: data.gravity_form_footer,
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(circleRef.current, {
        scrollTrigger: {
          trigger: parentRef.current,
          scrub: 1,
          start: `top top`,
          end: `bottom top`,
        },
        bottom: 'calc(100% - 60px)',
      });

      gsap.to(dotsRef.current, {
        scrollTrigger: {
          trigger: parentRef.current,
          scrub: 1,
          start: `top top`,
          end: `bottom top`,
        },
        top: '100%',
      });
    }, parentRef);

    return () => ctx.revert();
  }, [data.decoration_position]);

  return (
    <header
      ref={parentRef}
      id={data.id}
      className='relative py-16 overflow-hidden bg-black'
    >
      <Decoration
        ref={dotsRef}
        type={2}
        colour={0}
        position={3}
        variant='custom'
        className='w-[35%] pb-[35%] xl:w-[17%] xl:pb-[17%] translate-x-[-24px] translate-y-[24px] animation-fadeIn mobile-no-animation'
      />

      <div className='container-extra-large'>
        <div className='grid xl:grid-cols-2 gap-16 xl:gap-24 3xl:gap-32 items-center'>
          <div className='flex flex-col justify-center'>
            {data.headline && (
              <div
                className='headline-1 animation-fadeIn mobile-no-animation'
                dangerouslySetInnerHTML={{ __html: data.headline }}
              ></div>
            )}

            {(data.phone || data.email) && (
              <>
                <div className='flex flex-col gap-6 mt-9 xl:mt-12 3xl:mt-24'>
                  {data.phone && (
                    <div className='relative'>
                      <Link
                        href={`tel:${formatPhone(data.phone)}`}
                        className='text-lg link link--basic animation-fadeIn mobile-no-animation'
                      >
                        {data.phone}
                      </Link>
                      <DecorationLine
                        direction='left'
                        className='!right-[calc(100%+16px)] animation-drawInLeft mobile-no-animation'
                        bgClassName='bg-white'
                      />
                    </div>
                  )}

                  {data.email && (
                    <div className='relative'>
                      <Link
                        href={`mailto:${data.email}`}
                        className='text-lg link link--basic animation-fadeIn mobile-no-animation'
                      >
                        {data.email}
                      </Link>
                      <DecorationLine
                        direction='left'
                        className='!right-[calc(100%+16px)] animation-drawInLeft mobile-no-animation'
                        bgClassName='bg-white'
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {!data.is_social_hidden && (
              <div className='relative mt-12'>
                <SocialIcons className='animation-fadeIn mobile-no-animation' />
                <DecorationLine
                  direction='left'
                  className='!right-[calc(100%+16px)] animation-drawInLeft mobile-no-animation'
                  bgClassName='bg-white'
                />
              </div>
            )}
          </div>

          {data.gravity_form_id && (
            <div className='relative'>
              <Decoration
                ref={circleRef}
                type={1}
                colour={0}
                variant='custom'
                className='w-[33%] pb-[33%] left-0 bottom-[60px] translate-x-[-50%] animation-expandIn mobile-no-animation'
              />
              <GravityForm
                settings={formSettings}
                animationClass='animation-fadeIn mobile-no-animation'
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderContact;
