// @ts-ignore
import { Curtains } from '../../../node_modules/curtainsjs/src/core/Curtains';
// @ts-ignore
import { Plane } from '../../../node_modules/curtainsjs/src/core/Plane';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';

import styles from '@/styles/sections/section-featured-case-study.module.scss';
import { CaseStudy } from '@/types/case-study';
import { fs, vs } from '@/lib/curtains-utils';
import ContentImage from '../ContentImage';
import Decoration from '../Decoration';
import { useInView } from 'react-intersection-observer';
import useDetectDevice from '@/hooks/detect-device';

const CurtainsFeaturedCaseStudy = ({
  data,
  caseStudy,
}: {
  data: any;
  caseStudy?: CaseStudy;
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
      href={caseStudy?.slug ? `/case-studies/${caseStudy.slug}` : ''}
      title={caseStudy?.lead.company ? caseStudy.lead.company : ''}
      className={`${styles['link']} animation-revealFromCircle  ${
        planeReady || (isMobile && inView)
          ? 'animated'
          : ''
      }`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className={styles['link__wrapper']}>
        <div className={styles['link__details']}>
          {caseStudy?.lead.company && (
            <p className='text-[18px] md:text-[20px] font-bold'>
              {caseStudy.lead.company}
            </p>
          )}
          {caseStudy?.lead.size && (
            <p className='text-[16px] md:text-[18px]'>{caseStudy.lead.size}</p>
          )}
          {caseStudy?.lead.location && (
            <p className='text-[16px] md:text-[18px] font-medium'>
              {caseStudy.lead.location}
            </p>
          )}
          <p
            className={`${styles['link__details-anchor']} font-bold underline mt-4`}
          >
            View case study
          </p>
        </div>

        <div
          className={`${styles['link__figure-wrapper']} relative w-[60%] md:w-full`}
        >
          {!data.is_landscape && (
            <Decoration
              type={1}
              colour={0}
              variant='custom'
              className={`${styles['decoration-secondary']} animation-expandIn ${
                planeReady || (isMobile && inView)
                  ? 'animated'
                  : ''
              }`}
            />
          )}

          <figure className={styles['link__figure']}>
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
                    id={data.image}
                    sizes="50vw"
                    onLoadingComplete={() => setImgMainLoaded(true)}
                  />
                  <ContentImage
                    className={`absolute z-[2] w-full h-full object-cover opacity-0`}
                    elementId='texture1'
                    dataSampler='texture1'
                    id={data.image_hover}
                    sizes="50vw"
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
                className={styles['link__image']} 
                sizes="50vw"
                id={data.image} />
            )}
          </figure>
        </div>
      </div>
    </Link>
  );
};

export default CurtainsFeaturedCaseStudy;
