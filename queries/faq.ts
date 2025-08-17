import { fetchAPI } from '../lib/api-utils';

export const getAllFaqs = async () => {
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
      query getFaqs($first: Int, $last: Int, $after: String, $before: String) {
        faqs(first: $first, last: $last, after: $after, before: $before) {
          edges {
            node {
              id
              databaseId
              title
              slug
              lead {
                text
              }
              faqCategories(first: 100) {
                edges {
                  node {
                    id
                    databaseId
                    name
                    slug
                  }
                }
              }
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
  const allFaqs = initialData.faqs.edges;

  let hasNextPage = initialData.faqs.pageInfo.hasNextPage;
  let endCursor = initialData.faqs.pageInfo.endCursor;

  if (hasNextPage && endCursor) {
    while (hasNextPage) {
      const additionalData = await getPaginatedData({
        first: 100,
        after: endCursor,
      });
      allFaqs.push(...additionalData.faqs.edges);
      hasNextPage = additionalData.faqs.pageInfo.hasNextPage;
      endCursor = additionalData.faqs.pageInfo.endCursor;
    }
  }

  return allFaqs.map((item: any) => item.node);
};

export const getAllCategoriesWithSlugs = async () => {
  const data = await fetchAPI(`
  {
    faqCategories(first: 100) {
      edges {
        node {
          slug
        }
      }
    }
  }
  `);

  return data?.faqCategories.edges.map((item: any) => item.node);
};

export const getCategoryBySlug = async (slug: string) => {
  const data = await fetchAPI(`
  {
    faqCategory(id: "${slug}", idType: SLUG) {
      id
      databaseId
      name
      slug
      faqs(first: 100) {
        edges {
          node {
            id
            databaseId
            title
            slug
            lead {
              text
            }
            faqCategories(first: 100) {
              edges {
                node {
                  id
                  databaseId
                  name
                  slug
                }
              }
            }
          }
        }
      }
      seo {
        metaDesc
        title
        fullHead
      }
    }
  }
  `);

  return data?.faqCategory;
};

export const getAllCategories = async () => {
  const data = await fetchAPI(`
  {
    faqCategories(first: 100) {
      edges {
        node {
          id
          databaseId
          name
          slug
        }
      }
    }
  }
  `);

  return data?.faqCategories.edges.map((item: any) => item.node);
};