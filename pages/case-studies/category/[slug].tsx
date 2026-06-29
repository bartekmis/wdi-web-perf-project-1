import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getFullHead } from '@/lib/helper-utils';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

import {
  CaseStudyCategory,
  CaseStudyCategoryInstance,
} from '@/types/case-study';
import {
  getAllCategories,
  getCategoryBySlug,
} from '@/queries/case-studies';
import ContentImage from '@/components/Components/ContentImage';
import Button from '@/components/Components/Button';
import Decoration from '@/components/Components/Decoration';
import CaseStudyCard from '@/components/Components/CaseStudyCard';
import DecorationLine from '@/components/Components/DecorationLine';
import { withGlobalData } from '@/lib/api-utils';
import ListingCategoryMenu from '@/components/Components/ListingCategoryMenu';
import Error from '@/pages/_error';

const CaseStudyCategory = ({
  page,
  categories,
}: {
  page: CaseStudyCategoryInstance;
  categories: CaseStudyCategory[];
}) => {
  const router = useRouter();
  const [displayNumber, setDisplayNumber] = useState(10);

  if (!router.isFallback && !page?.slug) {
    return <Error statusCode={404} />;
  }

  const caseStudies =
    page?.caseStudies.edges.map((caseStudy) => caseStudy.node) || [];

  const featuredCaseStudy = caseStudies.filter(
    (caseStudy) => caseStudy.lead.is_featured
  )[0];

  const caseStudiesList = caseStudies.filter(
    (caseStudy) => caseStudy.id !== featuredCaseStudy?.id
  );

  const handleLoadMore = () => {
    setDisplayNumber((prevDisplayNumber) => prevDisplayNumber + 12);
  };

  const fullHead = getFullHead(page?.seo?.fullHead || '');

  return (
    <>
      <Head>{fullHead}</Head>
      <main>
        <header className='pt-24 bg-lightGrey'>
          <div className='container-large'>
            <h1 className='headline-1'>Office design projects</h1>
          </div>

          {!!categories?.length && (
            <ListingCategoryMenu
              categories={categories}
              module='case-studies'
            />
          )}
        </header>

        <section className='section bg-lightGrey'>
          <div className='container-large'>
            {!!caseStudies.length && (
              <>
                <div className='grid md:grid-cols-2 gap-9 md:gap-12 xl:gap-y-16'>
                  {featuredCaseStudy && (
                    <Link
                      href={`/case-studies/${featuredCaseStudy.slug}`}
                      className='group relative bg-white rounded-tr-[60px] md:rounded-tr-[240px] flex flex-col md:flex-row md:col-[1/3]'
                    >
                      <Decoration
                        type={1}
                        colour={0}
                        variant='custom'
                        className='asbolute right-[72px] top-0 translate-y-[-50%] w-[20%] pb-[20%]'
                      />

                      <div className='relative md:w-[calc(50%+24px)] p-9 md:px-12 md:py-20'>
                        <div className='relative'>
                          <p className='text-[18px] md:text-[20px] text-redSecondary'>
                            Featured Office Design Case Study
                          </p>
                          <DecorationLine
                            direction='left'
                            bgClassName='bg-red'
                            className='!right-[calc(100%+24px)]'
                          />
                        </div>

                        {featuredCaseStudy.title && (
                          <p className='headline-2 mt-4 md:mt-6 underline decoration-transparent group-hover:decoration-black transition duration-300'>
                            {featuredCaseStudy.title}
                          </p>
                        )}

                        {featuredCaseStudy.lead.location && (
                          <p className='md:text-[18px]'>
                            {featuredCaseStudy.lead.location}
                          </p>
                        )}

                        {featuredCaseStudy.lead.logo && (
                          <figure className='mt-9'>
                            <ContentImage
                              className='w-[120px] h-[120px] object-contain'
                              id={featuredCaseStudy.lead.logo.id}
                              width={+featuredCaseStudy.lead.logo.width}
                              height={+featuredCaseStudy.lead.logo.height}
                            />
                          </figure>
                        )}

                        <Decoration
                          type={2}
                          colour={1}
                          variant='custom'
                          className='right-0 bottom-0 w-[42%] !h-[30%] !bg-cover'
                        />
                      </div>
                      <figure className='relative flex-1 md:rounded-tr-[240px] overflow-hidden'>
                        <ContentImage
                          className='md:absolute w-full h-full object-cover'
                          id={featuredCaseStudy.lead.image_main}
                        />
                      </figure>
                    </Link>
                  )}

                  {caseStudiesList.slice(0, displayNumber).map((caseStudy) => {
                    return (
                      <CaseStudyCard
                        key={caseStudy.id}
                        caseStudy={caseStudy}
                      />
                    );
                  })}
                </div>

                {displayNumber < caseStudiesList.length && (
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

            {!!caseStudies.length === false && (
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
    const caseStudyCategories = await getAllCategories();

    return {
      props: {
        page,
        categories: caseStudyCategories,
      },
    };
  }
);

export default CaseStudyCategory;
