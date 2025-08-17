import StandoutCta, {
  StandoutCtaData,
} from '@/components/Components/StandoutCta';
import { getContainerSize, getSectionSettings } from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';

const SectionStandoutCta = ({ data }: { data: any }) => {
  const sectionSettings: SectionSettings = {
    bgColour: data.section_background_colour,
    paddingTop: data.section_padding_top,
    paddingBottom: data.section_padding_bottom,
    containerSize: data.section_container_size,
    fontSize: data.section_font_size,
    textAlignment: data.section_text_alignment,
  };

  const standoutCtaData: StandoutCtaData = {
    isReversed: data.is_reversed,
    isSingleColumn: data.is_single_column,
    bgColour: data.box_bg_colour,
    headline: data.headline,
    headlineSize: data.headline_size,
    headlineTag: data.headline_tag,
    text: data.text,
    image: data.image,
    btns: data.btns,
  };

  return (
    <section
      id={data.id}
      className={`
        section
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <div className={getContainerSize(sectionSettings.containerSize)}>
        <StandoutCta data={standoutCtaData} />
      </div>
    </section>
  );
};

export default SectionStandoutCta;
