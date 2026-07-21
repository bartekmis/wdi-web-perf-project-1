import { useRouter } from 'next/router';
import Head from 'next/head';
import { getFullHead } from '@/lib/helper-utils';
import Error from './_error';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { getPageBySlug } from '@/queries/pages';
import Content from '@/components/Content';
import { PageInstance } from '@/types/page';
import { ContentData } from '@/components/Content/Content';
import { withGlobalData, REVALIDATE_SECONDS } from '@/lib/api-utils';

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

// Nie pre-renderujemy żadnych ścieżek w buildzie - strony powstają na żądanie
// przy pierwszym wejściu (fallback: 'blocking'), a potem są serwowane ze
// statycznego cache i odświeżane w tle co REVALIDATE_SECONDS.
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = withGlobalData(
  async (context: any) => {
    const { slug } = context.params as ParsedUrlQuery & { slug: string[] };
    const slugString = slug.join('/');
    const page: PageInstance = await getPageBySlug(slugString);

    return {
      props: {
        page,
      },
      revalidate: REVALIDATE_SECONDS,
    };
  }
);

export default Page;
