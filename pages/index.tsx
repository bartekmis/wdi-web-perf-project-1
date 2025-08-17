import Head from 'next/head';
import { getFullHead } from '@/lib/helper-utils';
import { GetStaticProps } from 'next';

import Content from '@/components/Content';
import { getPageBySlug } from '@/queries/pages';
import { PageInstance } from '@/types/page';
import { ContentData } from '@/components/Content/Content';
import { withGlobalData } from '@/lib/api-utils';

const Home = ({ page }: { page: PageInstance }) => {
  const content: ContentData = page?.content ? JSON.parse(page.content) : {};

  const fullHead = getFullHead(page?.seo?.fullHead || '');
  
  return (
    <>
      <Head>{fullHead}</Head>
      <main>
        <Content data={content} />
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = withGlobalData(async () => {
  const slug = '/';
  const page: PageInstance = await getPageBySlug(slug);

  return {
    props: {
      page,
    },
    revalidate: 60,
  };
});


export default Home;