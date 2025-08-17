import IframeEmbed from '@/components/Components/IframeEmbed';
import { getContainerSize, getSectionSettings } from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';

const SectionCaseStudyIframe = ({ data }: { data: any }) => {
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
        overflow-hidden
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <div className={getContainerSize(sectionSettings.containerSize)}>
        <IframeEmbed>
          <iframe
            src={data.url}
            width="100%"
            height={data.height || '352'}
            scrolling='no'
            frameBorder={0}
            allowFullScreen={false}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          >
          </iframe>
        </IframeEmbed>
      </div>
    </section>
  );
};

export default SectionCaseStudyIframe;
