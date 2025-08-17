import StandoutCta, {
  StandoutCtaData,
} from '@/components/Components/StandoutCta';

const SectionKnowledgeStandoutCta = ({ data }: { data: any }) => {
  const standoutCtaData: StandoutCtaData = {
    isReversed: data.is_reversed,
    isSingleColumn: data.is_single_column,
    bgColour: data.bg_colour,
    headline: data.headline,
    headlineSize: data.headline_size,
    headlineTag: data.headline_tag,
    text: data.text,
    image: data.image,
    btns: data.btns,
  };

  return (
    <section id={data.id} className='section section--article bg-lightGrey'>
      <div className='container-small'>
        <StandoutCta data={standoutCtaData} />
      </div>
    </section>
  );
};

export default SectionKnowledgeStandoutCta;
