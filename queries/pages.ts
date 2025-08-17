import { fetchAPI } from '../lib/api-utils';

export const getAllPagesWithSlugs = async () => {
  const getPaginatedData = async ({
    first,
    last,
    after,
    before,
  }: {
    first?: number;
    last?: number;
    after?: string;
    before?: string;
  }) => {
    return fetchAPI(
      `
      query getPages($first: Int, $last: Int, $after: String, $before: String) {
        pages(first: $first, last: $last, after: $after, before: $before) {
          edges {
            node {
              slug
              uri
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
        }
      }
    `,
      {
        variables: {
          first,
          after,
          last,
          before,
        },
      }
    );
  };

  const initialData = await getPaginatedData({ first: 100 });
  const allPages = initialData.pages.edges;

  let hasNextPage = initialData.pages.pageInfo.hasNextPage;
  let endCursor = initialData.pages.pageInfo.endCursor;

  if (hasNextPage && endCursor) {
    while (hasNextPage) {
      const additionalData = await getPaginatedData({
        first: 100,
        after: endCursor,
      });
      allPages.push(...additionalData.pages.edges);
      hasNextPage = additionalData.pages.pageInfo.hasNextPage;
      endCursor = additionalData.pages.pageInfo.endCursor;
    }
  }

  return allPages.map((item: any) => item.node);
};

export const getPageBySlug = async (slug: string) => {
  const data = await fetchAPI(`
  {
    page(id: "${slug}", idType: URI) {
      title
      content(format: RAW)
      slug
      uri
      seo {
        metaDesc
        title
        fullHead
      }
    }
  }
  `);

  return data?.page;
};

export const getPreviewPageByID = async (id: string | string[]) => {
  const data = await fetchAPI(
    `
    query PreviewPage($id: ID!) {
      page(idType: DATABASE_ID, id: $id, asPreview: true) {
        title
        content(format: RAW)
        slug
        uri
        seo {
          metaDesc
          title
          fullHead
        }
      }
    }`,
    {
      variables: { id },
    }
  )
  return data?.page;
}