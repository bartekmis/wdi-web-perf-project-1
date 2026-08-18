import Headline from '@/components/Components/Headline';
import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';

// dynamic() musi stać w module, nie w ciele komponentu. Wywołane przy każdym
// renderze tworzy ZA KAŻDYM RAZEM nowy typ komponentu, więc React nie widzi
// tego samego drzewa - odmontowuje stare i montuje nowe, kasując DOM i stan,
// a slider (Swiper) inicjalizuje się od zera po każdym renderze rodzica.
const StorySlider = dynamic(
  () => import('../../Components/Swiper/StorySlider')
);

const SectionStory = ({ data }: { data: any }) => {
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
      {data.headline && (
        <div className={getContainerSize(sectionSettings.containerSize)}>
          <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} mb-9 animation-fadeIn`}>
            {data.headline}
          </Headline>
        </div>
      )}

      <div className='container-fluid'>
        <div className='relative'>
          {inView && <StorySlider items={data.items} />}
        </div>
      </div>
    </section>
  );
};

export default SectionStory;
