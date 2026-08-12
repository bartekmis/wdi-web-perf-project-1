import { SectionSettings } from '@/types/theme';
import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
} from '@/lib/theme-utils';
import DecorationLine from '@/components/Components/DecorationLine';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import Headline from '@/components/Components/Headline';

// MOVED to module scope 2026-08-12. Created inside the component body this
// was a new component type on every render, so React remounted the lazy
// subtree instead of updating it. Any `inView` gating around its usage is
// unaffected - that still controls when it renders.
const ImagesSelectionSlider = dynamic(
  () => import('../../Components/Swiper/ImagesSelectionSlider')
);

const SectionCaseStudyImagesSelection = ({ data }: { data: any }) => {
  const sectionSettings: SectionSettings = {
    bgColour: data.section_background_colour,
    paddingTop: data.section_padding_top,
    paddingBottom: data.section_padding_bottom,
    containerSize: data.section_container_size,
    fontSize: data.section_font_size,
    textAlignment: data.section_text_alignment,
  };


  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      id={data.id}
      className={`
        section
        overflow-hidden
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <div className={getContainerSize(sectionSettings.containerSize)}>
        {data.headline && (
          <div className='relative inline-flex pr-9'>
            <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} animation-fadeIn`}>
              {data.headline}
            </Headline>

            <DecorationLine
              direction='right'
              className='animation-drawInRight'
            />
          </div>
        )}
      </div>

      <div className='container-fluid mt-20'>
        {inView && !!data.images?.length && (
          <ImagesSelectionSlider images={data.images} autoplay={data.is_autoplay} speed={+data.autoplay_speed || 10000}/>
        )}
      </div>
    </section>
  );
};

export default SectionCaseStudyImagesSelection;
