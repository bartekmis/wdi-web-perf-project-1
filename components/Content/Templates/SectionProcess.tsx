import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';

import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import Headline from '@/components/Components/Headline';

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

  const ProcessSlider = dynamic(
    () => import('../../Components/Swiper/ProcessSlider')
  );

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
