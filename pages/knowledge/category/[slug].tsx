import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getFullHead } from '@/lib/helper-utils';
import Error from '@/pages/_error';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

import ContentImage from '@/components/Components/ContentImage';
import Button from '@/components/Components/Button';
import {
  KnowledgeCategory,
  KnowledgeCategoryInstance,
} from '@/types/knowledge';
import {
  getAllCategories,
  getCategoryBySlug,
} from '@/queries/knowledge';
import CategoryTag from '@/components/Components/CategoryTag';
import KnowledgeCard from '@/components/Components/KnowledgeCard';
import Decoration from '@/components/Components/Decoration';
import DecorationLine from '@/components/Components/DecorationLine';
import { withGlobalData } from '@/lib/api-utils';
import ListingCategoryMenu from '@/components/Components/ListingCategoryMenu';

const KnowledgeCategory = ({
  page,
  categories,
}: {
  page: KnowledgeCategoryInstance;
  categories: KnowledgeCategory[];
}) => {
  const router = useRouter();
  const [displayNumber, setDisplayNumber] = useState(12);

  if (!router.isFallback && !page?.slug) {
    return <Error statusCode={404} />;
  }

  const articles =
    page?.knowledgeArticles.edges.map((article) => article.node) || [];

  const featuredArticle = articles.filter(
    (article) => article.lead.is_featured
  )[0];

  const articlesList = articles.filter(
    (article) => article.id !== featuredArticle?.id
  );

  const handleLoadMore = () => {
    setDisplayNumber((prevDisplayNumber) => prevDisplayNumber + 12);
  };

  const fullHead = getFullHead(page?.seo?.fullHead || '');

  return (
    <>
      <Head>{fullHead}</Head>
      <main>
        <Decoration
          type={2}
          colour={1}
          variant='custom'
          className='w-[50%] pb-[100%] !bg-cover right-0 opacity-25 z-[1] md:pb-[50%] xl:w-[30%] xl:pb-[30%]'
        />

        <header className='pt-24 bg-lightGrey'>
          <div className='container-large'>
            <h1 className='headline-1'>Industry insights and thought pieces</h1>
          </div>

          {!!categories?.length && (
            <ListingCategoryMenu categories={categories} module='knowledge' />
          )}
        </header>

        <section className='section bg-lightGrey'>
          <div className='container-large z-[1]'>
            {!!articles.length && (
              <>
                <div className='grid md:grid-cols-3 gap-9 md:gap-12 xl:gap-y-16'>
                  {featuredArticle && (
                    <Link
                      href={`/knowledge/${featuredArticle.slug}`}
                      className='group relative bg-white flex flex-col md:flex-row md:col-[1/4] p-6'
                    >
                      <div className='relative md:w-[calc(50%+24px)] p-9 md:px-12 md:py-24'>
                        <div className='relative'>
                          <p className='text-[18px] md:text-[20px] text-redSecondary'>
                            Featured Knowledge piece
                          </p>
                          <DecorationLine
                            direction='left'
                            bgClassName='bg-red'
                            className='!right-[calc(100%+24px)]'
                          />
                        </div>

                        {featuredArticle.title && (
                          <p className='headline-2 mt-4 md:mt-6 underline decoration-transparent group-hover:decoration-black transition duration-300'>
                            {featuredArticle.title}
                          </p>
                        )}

                        {!!featuredArticle.knowledgeCategories?.edges
                          .length && (
                          <div className='mt-6 flex gap-4'>
                            {featuredArticle.knowledgeCategories.edges.map(
                              (item) => (
                                <CategoryTag
                                  key={item.node.id}
                                  label={item.node.name}
                                />
                              )
                            )}
                          </div>
                        )}
                      </div>
                      <figure className='relative flex-1 rounded-tl-[240px] overflow-hidden group-hover:rounded-l-[240px] transition-[border-radius] duration-300'>
                        <ContentImage
                          className='md:absolute w-full h-full object-cover'
                          id={featuredArticle.lead.image_main}
                        />
                      </figure>
                    </Link>
                  )}

                  {articlesList.slice(0, displayNumber).map((article) => (
                    <KnowledgeCard key={article.id} article={article} />
                  ))}
                </div>

                {displayNumber < articlesList.length && (
                  <div className='flex justify-end mt-20'>
                    <Button
                      onClick={handleLoadMore}
                      type='button'
                      text='Load more'
                      variant='primary-black'
                      connection='left'
                    />
                  </div>
                )}
              </>
            )}

            {!!articles.length === false && (
              <p className='text-center text-xl font-medium'>
                There are no results to display
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withGlobalData(
  async (context: any) => {
    const { slug } = context.params as ParsedUrlQuery & { slug: string };
    const page = await getCategoryBySlug(slug);
    const knowledgeCategories = await getAllCategories();

    return {
      props: {
        page,
        categories: knowledgeCategories,
      },
    };
  }
);

export default KnowledgeCategory;
