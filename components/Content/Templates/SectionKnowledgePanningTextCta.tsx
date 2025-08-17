import PanningTextCta, {
  PanningTextCtaData,
} from '@/components/Components/PanningTextCta';

const SectionKnowledgePanningTextCta = ({ data }: { data: any }) => {
  const PanningTextCtaData: PanningTextCtaData = {
    text: data.text,
    size: data.text_size,
    bgColour: data.bg_colour,
    bgColourHover: data.bg_colour_hover,
    url: data.url,
    duration: data.duration,
    textColour: data.text_colour,
    textColourHover: data.text_colour_hover,
  };

  return (
    <section id={data.id} className='section section--article bg-lightGrey'>
      <div className='container-small'>
        {data.text && <PanningTextCta data={PanningTextCtaData} />}
      </div>
    </section>
  );
};

export default SectionKnowledgePanningTextCta;
