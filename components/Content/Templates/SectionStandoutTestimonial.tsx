import Testimonial from '@/components/Components/Testimonial';
import {
  getBgColour,
  getContainerSize,
  getSectionSettings,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';

const SectionStandoutTestimonial = ({ data }: { data: any }) => {
  const sectionSettings: SectionSettings = {
    bgColour: data.section_background_colour,
    paddingTop: data.section_padding_top,
    paddingBottom: data.section_padding_bottom,
    containerSize: data.section_container_size,
    fontSize: data.section_font_size,
    textAlignment: data.section_text_alignment,
  };

  return (
    <section
      id={data.id}
      className={`
        section
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <div
        className={`${getBgColour(data.bg_half_colour)} ${
          data.bg_half_position === 1 ? 'bottom-0' : 'top-0'
        } absolute w-full h-1/2`}
      ></div>
      
      <div className={getContainerSize(sectionSettings.containerSize)}>
        <Testimonial text={data.text} author={data.author} company={data.company} fontSize={data.fontSize} />
      </div>
    </section>
  );
};

export default SectionStandoutTestimonial;
