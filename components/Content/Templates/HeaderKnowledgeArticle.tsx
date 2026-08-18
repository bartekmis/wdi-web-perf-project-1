import Link from 'next/link';

import ContentImage from '@/components/Components/ContentImage';
import DecorationLine from '@/components/Components/DecorationLine';
import { ContentDetails } from '../Content';

const HeaderKnowledgeArticle = ({
  data,
  details,
}: {
  data: any;
  details?: ContentDetails;
}) => {
  const formatDate = (date: string) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formattedDate;
  };

  return (
    <header className='overflow-hidden bg-lightGrey'>
      {data.image && (
        <figure className='relative w-full pb-[40vh]'>
          <ContentImage
            className='absolute w-full h-full object-cover'
            id={data.image}
            sizes='100vw'
            priority
          />
        </figure>
      )}

      <div className='container-extra-small py-9 mb-5 md:py-16 md:mb-8 xl:mt-[-150px] 3xl:py-20 3xl:mb-12'>
        <div className='hidden xl:block absolute bg-lightGrey w-[calc(100%+120px)] h-full top-0 left-[-60px] rounded-r-[300px] 3xl:w-[calc(100%+144px)] 3xl:left-[-72px]'></div>

        <div className='relative flex flex-col z-[1]'>
          <div className='text-[18px] md:text-[20px]'>
            <Link href='/knowledge' title='Knowledge'>
              Knowledge
            </Link>
            {details?.category.name && details?.category.slug && (
              <Link href={`/knowledge/category/${details.category.slug}`}>
                {' '}
                / {details.category.name}
              </Link>
            )}
            {details?.title && (
              <p className='inline'>
                {' '}
                / <span className='text-red'>{details.title}</span>
              </p>
            )}
          </div>

          {data.headline && (
            <h1 className='headline-2 mt-6 md:mt-12'>{data.headline}</h1>
          )}

          {details?.date && (
            <time className='headline-6 mt-6 md:mt-9'>
              {formatDate(details.date)}
            </time>
          )}
        </div>

        <DecorationLine direction='right' className='!top-[initial] bottom-0 !left-0' />
      </div>
    </header>
  );
};

export default HeaderKnowledgeArticle;
