import Device from '@/components/Components/Device';
import { getSectionSettings } from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import dynamic from 'next/dynamic';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useInView } from 'react-intersection-observer';

// MOVED to module scope 2026-08-12. Created inside the component body this
// was a new component type on every render, so React remounted the lazy
// subtree instead of updating it. Any `inView` gating around its usage is
// unaffected - that still controls when it renders.
const TeamListingSlider = dynamic(
  () => import('../../Components/Swiper/TeamListingSlider')
);

const SectionTeamListing = ({ data }: { data: any }) => {
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
      <div className='container-large mb-9 md:mb-12'>
        <div className='content flex items-center'>
          <MdChevronLeft />
          
          <Device>
            {({ isMobile }) => {
              if (!isMobile) {
                return <p className='mx-2 !my-0'>Hold & Drag</p>
              } else {
                return <p className='mx-2 !my-0'>Swipe</p>
              }
            }}
          </Device>

          <MdChevronRight />
        </div>
      </div>

      <div className='container-fluid'>
        {inView && <TeamListingSlider people={data.people} />}
      </div>
    </section>
  );
};

export default SectionTeamListing;
