import { KnowledgeArticle } from '@/types/knowledge';
import Link from 'next/link';
import ContentImage from './ContentImage';
import CategoryTag from './CategoryTag';
import { useContext } from 'react';
import { CursorContext } from '@/contexts/cursor';

const KnowledgeCard = ({ article }: { article: KnowledgeArticle }) => {
  const { onChange } = useContext(CursorContext);

  return (
    <Link
      key={article.id}
      href={`/knowledge/${article.slug}`}
      title={article.title}
      className='group'
      onMouseEnter={() => onChange(true)}
      onMouseLeave={() => onChange(false)}
      onClick={() => onChange(false)}
    >
      <figure className='relative w-full pb-[66%] group-hover:rounded-r-[164px] overflow-hidden transition-[border-radius] duration-300'>
        <ContentImage
          className='absolute w-full h-full object-cover'
          id={article.lead.image_main}
          sizes="(max-width: 767px) 100vw, (min-width: 768px and max-width: 1199px) 50vw, 33vw"
        />

        {!!article.knowledgeCategories.edges.length && 
          <div className="absolute top-4 left-4 flex flex-wrap gap-4">
            {article.knowledgeCategories.edges.map((item) => (
              <CategoryTag key={item.node.id} label={item.node.name} />
            ))}
          </div>
        }
      </figure>

      {article.title && (
        <p className='headline-4 mt-4 md:mt-6 underline decoration-transparent group-hover:decoration-black transition duration-300'>
          {article.title}
        </p>
      )}
    </Link>
  );
};

export default KnowledgeCard;
