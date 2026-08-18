import ContentImage from '@/components/Components/ContentImage';
import { ConditionalWrapper } from '@/lib/helper-utils';
import Link from 'next/link';
import { ReactNode } from 'react';

const SectionKnowledgeImage = ({ data }: { data: any }) => {
  return (
    <section id={data.id} className='section section--article bg-lightGrey'>
      <div className='container-extra-small'>
        <ConditionalWrapper
          condition={!!data.url}
          wrapper={(children: ReactNode) => (
            <Link href={data.url} title={data.title || ''}>
              {children}
            </Link>
          )}
        >
          <figure className='flex flex-col'>
            <ContentImage
              className='w-full'
              sizes='(max-width: 767px) 90vw, 40vw'
              id={data.image}
            />

            {data.caption && (
              <figcaption
                className={`inline-block relative mt-3 xl:mt-4.5 text-sm font-medium`}
              >
                <span>{data.caption}</span>
              </figcaption>
            )}
          </figure>
        </ConditionalWrapper>
      </div>
    </section>
  );
};

export default SectionKnowledgeImage;
