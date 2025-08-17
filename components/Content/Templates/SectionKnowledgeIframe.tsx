import IframeEmbed from '@/components/Components/IframeEmbed';

const SectionKnowledgeIframe = ({ data }: { data: any }) => {
  return (
    <section id={data.id} className='section section--article bg-lightGrey'>
      <div className='container-extra-small'>
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

export default SectionKnowledgeIframe;
