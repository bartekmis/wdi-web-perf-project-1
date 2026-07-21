import { useRouter } from 'next/router';
import Head from 'next/head';
import { getFullHead } from '@/lib/helper-utils';
import Error from './_error';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { getAllPagesWithSlugs, getPageBySlug } from '@/queries/pages';
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

// Ścieżki obsługiwane przez dedykowane routy (mają własne pliki w pages/) - nie
// generujemy ich tutaj, żeby nie kolidowały z catch-allem.
const RESERVED_TOP_LEVEL = new Set(['faq', 'case-studies', 'knowledge', 'preview']);

// Pre-renderujemy w buildzie wszystkie istniejące strony WP, żeby pierwszy
// odwiedzający też miał szybko. Nowe/nieznane strony nadal generują się na
// żądanie przy pierwszym wejściu (fallback: 'blocking').
export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getAllPagesWithSlugs();

  const paths = pages
    .map((page: any) => String(page?.uri || '').split('/').filter(Boolean))
    .filter(
      (segments: string[]) =>
        segments.length > 0 && !RESERVED_TOP_LEVEL.has(segments[0])
    )
    .map((segments: string[]) => ({ params: { slug: segments } }));

  return {
    paths,
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
