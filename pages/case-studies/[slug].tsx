import { useRouter } from 'next/router';
import Head from 'next/head';
import { getFullHead } from '@/lib/helper-utils';
import Error from '../_error';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

import Content from '@/components/Content';
import { CaseStudyInstance } from '@/types/case-study';
import { getCaseStudyBySlug } from '@/queries/case-studies';
import { ContentData } from '@/components/Content/Content';
import HeaderCaseStudy from '@/components/Content/Static/HeaderCaseStudy';
import { withGlobalData } from '@/lib/api-utils';

const CaseStudy = ({ page }: { page: CaseStudyInstance }) => {
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
        {page?.lead && <HeaderCaseStudy lead={page.lead} title={page.title} />}
        <Content data={content} />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withGlobalData(
  async (context: any) => {
    const { slug } = context.params as ParsedUrlQuery & { slug: string };

    const page = await getCaseStudyBySlug(slug);

    return {
      props: {
        page,
      },
    };
  }
);

export default CaseStudy;
