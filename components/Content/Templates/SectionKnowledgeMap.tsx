import Map from '@/components/Components/Map';

const SectionKnowledgeMap = ({ data }: { data: any }) => {
  return (
    <section id={data.id} className='section section--article bg-lightGrey'>
      <div className='container-extra-small'>
        <Map latitude={+data.latitude} longitude={+data.longitude} />
      </div>
    </section>
  );
};

export default SectionKnowledgeMap;
