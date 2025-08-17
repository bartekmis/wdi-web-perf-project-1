import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

import Decoration from '@/components/Components/Decoration';
import DecorationLine from '@/components/Components/DecorationLine';
import { getBgColour } from '@/lib/theme-utils';
import { useEffect, useRef } from 'react';

const HeaderSimpleText = ({ data }: any) => {
  gsap.registerPlugin(ScrollTrigger);

  const parentRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(circleRef.current, {
        scrollTrigger: {
          trigger: parentRef.current,
          scrub: 1,
          start: `top top`,
          end: `bottom top`,
        },
        top: '100%',
      });

      gsap.to(dotsRef.current, {
        scrollTrigger: {
          trigger: parentRef.current,
          scrub: 1,
          start: `top top`,
          end: `bottom top`,
        },
        left: `${data.decoration_position === 0 ? '10%' : '80%'}`,
      });
    }, parentRef);

    return () => ctx.revert();
  }, [data.decoration_position]);

  return (
    <header
      ref={parentRef}
      id={data.id}
      className={`
        relative
        py-24
        md:py-48
        overflow-hidden
        ${getBgColour(data.bg_colour)}
      `}
    >
      <div className='absolute top-0 right-0 animation-expandInSibling mobile-no-animation' aria-hidden='true'></div>
      <Decoration
        ref={circleRef}
        type={1}
        colour={0}
        position={data.decoration_position === 0 ? 3 : 0}
        variant='custom'
        className='w-[22%] pb-[22%] origin-top-right'
      />

      {!data.is_grid_hidden && (
        <Decoration
          ref={dotsRef}
          type={2}
          colour={2}
          position={data.decoration_position === 0 ? 2 : 5}
          variant='custom'
          className='w-[30%] pb-[30%] opacity-[25%] animation-fadeIn mobile-no-animation'
        />
      )}

      <div className='container-large'>
        {data.headline && (
          <div className='relative inline-block md:max-w-[calc(60%+48px)] pr-12'>
            <h1 className='headline-1 animation-fadeIn mobile-no-animation'>{data.headline}</h1>

            <DecorationLine
              direction='right'
              className='top-[initial] bottom-[22px] md:bottom-[28px] 3xl:bottom-[44px] animation-drawInRight mobile-no-animation'
              bgClassName={getBgColour(data.line_colour) || 'bg-white'}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderSimpleText;
