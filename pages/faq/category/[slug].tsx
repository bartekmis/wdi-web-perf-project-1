import { ChangeEvent, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getFullHead } from '@/lib/helper-utils';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { FiSearch } from 'react-icons/fi';

import {
  getAllCategories,
  getAllCategoriesWithSlugs,
  getCategoryBySlug,
} from '@/queries/faq';
import {
  FaqCategory as FaqCategoryType,
  FaqCategoryInstance,
} from '@/types/faq';
import FaqGroup from '@/components/Components/FaqGroup';
import Button from '@/components/Components/Button';
import { ParsedUrlQuery } from 'querystring';
import { AccordionItem } from '@/components/Components/FaqGroup';
import { withGlobalData } from '@/lib/api-utils';
import ListingCategoryMenu from '@/components/Components/ListingCategoryMenu';
import Error from '@/pages/_error';

const FaqCategory = ({
  page,
  categories,
}: {
  page: FaqCategoryInstance;
  categories: FaqCategoryType[];
}) => {
  const router = useRouter();
  const [displayNumber, setDisplayNumber] = useState(9);
  const [filteredItems, setFilteredItems] = useState<AccordionItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const faqs = page?.faqs.edges.map((faq) => faq.node) || [];

  const items = faqs.map(
    (faq) =>
      ({
        title: faq.title,
        text: faq.lead.text,
      } as AccordionItem)
  );

  if (!router.isFallback && !page?.slug) {
    return <Error statusCode={404} />;
  }

  const handleLoadMore = () => {
    setDisplayNumber((prevDisplayNumber) => prevDisplayNumber + 9);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    let query = e.target.value;
    let updatedList = [...items];
    setDisplayNumber(9);

    if (!query?.length) {
      setIsSearching(false);
      setFilteredItems([]);
      return;
    }

    updatedList = items.filter((item) => {
      return item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });

    setIsSearching(true);
    setFilteredItems(updatedList);
  };

  const fullHead = getFullHead(page?.seo?.fullHead || '');

  return (
    <>
      <Head>{fullHead}</Head>
      <main>
        <header className='pt-24 bg-lightGrey'>
          <div className='container-large'>
            <div className='grid gap-9 md:gap-16 xl:gap-24 md:grid-cols-2 items-center'>
              <div className='content'>
                <h1 className='headline-1'>FAQs</h1>
                <p>
                  If you have any questions that we haven’t covered here, please
                  contact us and we’ll do the best we can to answer them.
                </p>
              </div>

              <form
                className='w-full md:max-w-[600px] ml-auto'
                onSubmit={(e) => e.preventDefault()}
              >
                <div className='relative'>
                  <input
                    type='text'
                    aria-label='Search input'
                    placeholder='Search'
                    onInput={handleSearch}
                    className='block w-full py-4 px-6 md:py-6 md:px-9 md:text-[20px] font-bold rounded-[66px] placeholder:text-black placeholder:opacity-50 border-none focus:ring-transparent'
                  ></input>
                  <button
                    type='button'
                    aria-label='Search'
                    className='pointer-events-none absolute right-6 top-4 md:right-9 md:top-6'
                  >
                    <FiSearch className='w-[24px] h-[24px] opacity-50' />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {!!categories?.length && (
            <ListingCategoryMenu categories={categories} module='faq' />
          )}
        </header>

        <section className='section bg-lightGrey'>
          <div className='container-large'>
            {!!items?.length && !isSearching && (
              <>
                <FaqGroup items={items.slice(0, displayNumber)} />

                {displayNumber < items.length && (
                  <div className='flex justify-end mt-20'>
                    <Button
                      onClick={handleLoadMore}
                      type='button'
                      text='Load more FAQs'
                      variant='primary-black'
                      connection='left'
                    />
                  </div>
                )}
              </>
            )}

            {!!filteredItems?.length && isSearching && (
              <>
                <FaqGroup items={filteredItems.slice(0, displayNumber)} />

                {displayNumber < filteredItems.length && (
                  <div className='flex justify-end mt-20'>
                    <Button
                      onClick={handleLoadMore}
                      type='button'
                      text='Load more FAQs'
                      variant='primary-black'
                      connection='left'
                    />
                  </div>
                )}
              </>
            )}

            {((!!items?.length === false && !isSearching) ||
              (!!filteredItems?.length === false && isSearching)) && (
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

export const getStaticProps: GetStaticProps = withGlobalData(
  async (context: any) => {
    const { slug } = context.params as ParsedUrlQuery & { slug: string };
    const page = await getCategoryBySlug(slug);
    const faqCategories = await getAllCategories();

    return {
      props: {
        page,
        categories: faqCategories,
      },
      revalidate: 60,
    };
  }
);

export const getStaticPaths: GetStaticPaths = async () => {
  const categoriesWithSlugs = await getAllCategoriesWithSlugs();

  return {
    paths:
      categoriesWithSlugs.map(
        (page: any) => `/faq/category/${page.slug}/`
      ) || [],
    fallback: true,
  };
};

export default FaqCategory;
