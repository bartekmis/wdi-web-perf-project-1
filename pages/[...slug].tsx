import { useRouter } from 'next/router';
import Head from 'next/head';
import { getFullHead } from '@/lib/helper-utils';
import Error from './_error';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { getPageBySlug } from '@/queries/pages';
import Content from '@/components/Content';
import { PageInstance } from '@/types/page';
import { ContentData } from '@/components/Content/Content';
import { withGlobalData } from '@/lib/api-utils';

const Page = ({ page }: { page: PageInstance }) => {
  const router = useRouter();

  if (
    (!router.isFallback && !page?.slug) ||
    (`${router.asPath.split('?')[0]}/` !== page?.uri)
  ) {
    return <Error statusCode={404} />;
  }

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

export const getServerSideProps: GetServerSideProps = withGlobalData(
  async (context: any) => {
    const { slug } = context.params as ParsedUrlQuery & { slug: string[] };
    const slugString = slug.join('/');
    const page: PageInstance = await getPageBySlug(slugString);

    return {
      props: {
        page,
      },
    };
  }
);

export default Page;
