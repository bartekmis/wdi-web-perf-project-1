import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getFullHead } from '@/lib/helper-utils';
import { useRouter } from 'next/router';
import Error from '../_error';

import Content from '@/components/Content';
import { getPreviewPageByID } from '@/queries/pages';
import { PageInstance } from '@/types/page';
import { ParsedUrlQuery } from 'querystring';
import { ContentData } from '@/components/Content/Content';
import { withGlobalData } from '@/lib/api-utils';

const PagePreview = ({ page }: { page: PageInstance }) => {
  const router = useRouter();

  if (!router.isFallback && !page?.slug) {
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
  )
}

export const getServerSideProps: GetServerSideProps = withGlobalData(async (context: any) => {
  const { id } = context.params as ParsedUrlQuery & { id: string};

  const page: PageInstance = await getPreviewPageByID(id);

  return {
    props: {
      page,
    },
  };
});

export default PagePreview;