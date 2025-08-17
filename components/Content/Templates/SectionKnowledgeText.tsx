const SectionKnowledgeText = ({ data }: { data: any }) => {
  return (
    <section
      id={data.id}
      className='section section--article bg-lightGrey overflow-hidden'
    >
      <div className='container-extra-small'>
        {data.text && (
          <div
            className='content'
            dangerouslySetInnerHTML={{ __html: data.text }}
          />
        )}
      </div>
    </section>
  );
};

export default SectionKnowledgeText;
