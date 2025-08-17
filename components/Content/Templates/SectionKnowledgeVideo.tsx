import VideoPlayer from '@/components/Components/VideoPlayer';

const SectionKnowledgeVideo = ({ data }: { data: any }) => {
  return (
    <section id={data.id} className='section section--article  bg-lightGrey'>
      <div className='container-extra-small'>
        <VideoPlayer id={data.video_id} autoplay={false} poster={data.poster}/>
      </div>
    </section>
  );
};

export default SectionKnowledgeVideo;
