import Link from 'next/link';
import { useContext, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

import {
  getSectionSettings,
  getContainerSize,
  getButtonVariant,
  getButtonConnection,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import Button from '@/components/Components/Button';
import Decoration from '@/components/Components/Decoration';
import { PartialsContext } from '@/contexts/partials';
import { PartialsData } from '@/types/partials';
import ContentImage from '@/components/Components/ContentImage';

const SectionPreFooter = ({ data }: { data: any }) => {
  const partials = useContext(PartialsContext) as PartialsData;
  const pathname = usePathname();

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
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(dotsRef.current, {
        scrollTrigger: {
          trigger: parentRef.current,
          scrub: 1,
          start: 'top-=500 top',
          end: 'top top',
        },
        right: '0%',
      });
    }, parentRef);

    return () => ctx.revert();
  }, [pathname]);

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
      <div className={`${getContainerSize(sectionSettings.containerSize)} z-[1]`}>
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:gap-12 xl:gap-16'>
          {partials?.footer?.footer_logo && 
            <Link href='/' title='K2 Space' className='hidden md:block animation-revealFromCircle'>
              <ContentImage
                className='w-[96px] min-w-[96px] 3xl:w-[144px]'
                id={partials.footer.footer_logo}
                width={144}
                height={144}
              />
            </Link>
          }

          {data.text && <p className='headline-3 xl:max-w-[50%] animation-fadeIn'>{data.text}</p>}

          <div className='flex items-center justify-between gap-4 md:ml-auto'>
          
          {partials?.footer?.footer_logo && 
            <Link href='/' title='K2 Space' className='md:hidden animation-revealFromCircle'>
              <ContentImage
                className=''
                id={partials.footer.footer_logo}
                width={72}
                height={72}
              />
            </Link>
          }

            {!!data.btns?.length && (
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
      </div>

      <Decoration ref={dotsRef} type={2} colour={2} variant='custom' className='hidden xl:block absolute right-[8%] top-1/2 translate-y-[-50%] w-[16%] pb-[16%] animation-fadeIn'/>
    </section>
  );
};

export default SectionPreFooter;
