// @ts-ignore
import { Curtains } from '../../../node_modules/curtainsjs/src/core/Curtains';
// @ts-ignore
import { Plane } from '../../../node_modules/curtainsjs/src/core/Plane';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';

import { fs, vs } from '@/lib/curtains-utils';
import ContentImage from '../ContentImage';
import Decoration from '../Decoration';
import { useInView } from 'react-intersection-observer';
import useDetectDevice from '@/hooks/detect-device';
import { getHeadlineSize } from '@/lib/theme-utils';
import Headline from '../Headline';

const CurtainsServicesCard = ({
  card,
  layoutClass,
}: {
  card: any;
  layoutClass: string;
}) => {
  const currentDevice = useDetectDevice();
  const isMobile = currentDevice.isMobile();
  
  const canvasRef = useRef<any>(null);
  const planeRef = useRef<any>(null);
  const planeElement = useRef<any>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imgMainLoaded, setImgMainLoaded] = useState(false);
  const [imgHoverLoaded, setImgHoverLoaded] = useState(false);
  const [imgEffectLoaded, setImgEffectLoaded] = useState(false);
  const [planeReady, setPlaneReady] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    const canvas = canvasRef?.current?.querySelector('canvas');

    if (isMobile || !imagesLoaded || canvas) {
      return;
    }

    const curtains = new Curtains({
      container: canvasRef.current,
      watchScroll: false,
      pixelRatio: Math.min(1.5, window.devicePixelRatio),
    });

    let plane: any = null;

    const params = {
      vertexShader: vs,
      fragmentShader: fs,
      widthSegments: 40,
      heightSegments: 40, // 40*40*6 = 9600 vertices
      uniforms: {
        time: {
          name: 'uTime',
          type: '1f',
          value: 0,
        },
        mousepos: {
          name: 'uMouse',
          type: '2f',
          value: [0, 0],
        },
        resolution: {
          name: 'uReso',
          type: '2f',
          value: [innerWidth, innerHeight],
        },
        progress: {
          name: 'uProgress',
          type: '1f',
          value: 0,
        },
      },
    };

    if (!plane) {
      plane = new Plane(curtains, planeRef.current, params);
      plane.visible = false;
    }

    if (plane) {
      plane.onReady(() => {
        planeElement.current = plane;

        plane.visible = true;
        setPlaneReady(true);

        plane.onRender(() => {
          plane.uniforms.time.value += 0.01;
          plane.uniforms.resolution.value = [innerWidth, innerHeight];
        });
      });
    }

    return () => {
      if (plane) {
        plane.remove();
      }
    };
  }, [isMobile, imagesLoaded]);

  useEffect(() => {
    if (inView && imgMainLoaded && imgHoverLoaded && imgEffectLoaded) {
      setImagesLoaded(true);
    }
  }, [inView, imgMainLoaded, imgHoverLoaded, imgEffectLoaded]);

  const onEnter = () => {
    gsap.to(planeElement.current?.uniforms.progress, {
      value: 1,
      duration: 0.6,
    });
  };

  const onLeave = () => {
    gsap.to(planeElement.current?.uniforms.progress, {
      value: 0,
      duration: 0.6,
    });
  };

  return (
    <Link
      ref={ref}
      href={card.url}
      title={card.title || ''}
      className={`group flex flex-col ${layoutClass}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <figure
        className={`relative w-full pb-[56.25%] animation-revealFromCircle ${
          planeReady || (isMobile && inView) ? 'animated' : ''
        }`}
      >
        {!isMobile && (
          <>
            <div
              ref={canvasRef}
              className='absolute w-full h-full inset-0 z-[1]'
            ></div>

            <div className='absolute w-full h-full' ref={planeRef}>
              <ContentImage
                className={`absolute z-[3] w-full h-full object-cover opacity-0`}
                elementId='texture0'
                dataSampler='texture0'
                id={card.image}
                sizes='(max-width: 767px) 100vw, 50vw'
                onLoadingComplete={() => setImgMainLoaded(true)}
              />
              <ContentImage
                className={`absolute z-[2] w-full h-full object-cover opacity-0`}
                elementId='texture1'
                dataSampler='texture1'
                id={card.image_hover}
                sizes='(max-width: 767px) 100vw, 50vw'
                onLoadingComplete={() => setImgHoverLoaded(true)}
              />
              <Image
                className={`absolute z-[1] w-full h-full object-cover opacity-0`}
                alt='Distortion image effect'
                id='map'
                data-sampler='map'
                src='/clouds.png'
                width={257}
                height={257}
                onLoadingComplete={() => setImgEffectLoaded(true)}
              />
            </div>
          </>
        )}

        {isMobile && (
          <ContentImage
            className='absolute w-full h-full object-cover z-[1]'
            sizes='(max-width: 767px) 100vw, 50vw'
            id={card.image}
          />
        )}

        <Decoration
          type={card.decoration_type}
          colour={card.decoration_colour}
          position={card.decoration_position}
          variant='image'
          className={`hidden md:block animation-fadeIn ${
            planeReady || (isMobile && inView)
              ? 'animated'
              : ''
          }`}
        />
      </figure>

      {(card.title || card.description) && (
        <div className='flex flex-col mt-4 xl:mt-6 3xl:mt-9'>
          {card.title && (
            <Headline
              type={card.title_tag}
              className={`${getHeadlineSize(card.title_size) || 'headline-2'} underline decoration-transparent group-hover:decoration-black transition duration-300`}
            >
              {card.title}
            </Headline>
          )}

          {card.description && (
            <div className='content mt-2 xl:mt-4'>
              <p>{card.description}</p>
            </div>
          )}
        </div>
      )}
    </Link>
  );
};

export default CurtainsServicesCard;
