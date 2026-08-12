import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';

import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import Headline from '@/components/Components/Headline';

// MOVED to module scope 2026-08-12. Created inside the component body this
// was a new component type on every render, so React remounted the lazy
// subtree instead of updating it. Any `inView` gating around its usage is
// unaffected - that still controls when it renders.
const ProcessSlider = dynamic(
  () => import('../../Components/Swiper/ProcessSlider')
);

const SectionProcess = ({ data }: { data: any }) => {
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
          <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} text-center animation-fadeIn`}>
            {data.headline}
          </Headline>
        )}
      </div>

      {!!data.items?.length && inView && (
        <ProcessSlider
          items={data.items}
          thumbsColour={data.thumbs_colour}
          inView={inView}
        />
      )}
    </section>
  );
};

export default SectionProcess;
