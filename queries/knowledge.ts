import { fetchAPI } from '../lib/api-utils';

export const getAllKnowledgeArticlesWithSlugs = async () => {
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
      query getKnowledgeArticles($first: Int, $last: Int, $after: String, $before: String) {
        knowledgeArticles(first: $first, last: $last, after: $after, before: $before) {
          edges {
            node {
              slug
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
  const allKnowledgeArticles = initialData.knowledgeArticles.edges;

  let hasNextPage = initialData.knowledgeArticles.pageInfo.hasNextPage;
  let endCursor = initialData.knowledgeArticles.pageInfo.endCursor;

  if (hasNextPage && endCursor) {
    while (hasNextPage) {
      const additionalData = await getPaginatedData({
        first: 100,
        after: endCursor,
      });
      allKnowledgeArticles.push(...additionalData.knowledgeArticles.edges);
      hasNextPage = additionalData.knowledgeArticles.pageInfo.hasNextPage;
      endCursor = additionalData.knowledgeArticles.pageInfo.endCursor;
    }
  }

  return allKnowledgeArticles.map((item: any) => item.node);
};

export const getKnowledgeArticleBySlug = async (slug: string) => {
  const data = await fetchAPI(`
  {
    knowledgeArticle(id: "${slug}", idType: URI) {
      title
      content
      slug
      date
      lead {
        is_featured
        image_main
        cta {
          headline
          description
          btn_text
          btn_url
        }
      }
      knowledgeCategories(first: 100) {
        edges {
          node {
            id
            databaseId
            name
            slug
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

  return data?.knowledgeArticle;
};

export const getAllKnowledgeArticles = async () => {
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
      query getKnowledgeArticles($first: Int, $last: Int, $after: String, $before: String) {
        knowledgeArticles(first: $first, last: $last, after: $after, before: $before) {
          edges {
            node {
              id
              databaseId
              title
              slug
              date
              lead {
                is_featured
                image_main
                cta {
                  headline
                  description
                  btn_text
                  btn_url
                }
              }
              knowledgeCategories(first: 100) {
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
  const allKnowledgeArticles = initialData.knowledgeArticles.edges;

  let hasNextPage = initialData.knowledgeArticles.pageInfo.hasNextPage;
  let endCursor = initialData.knowledgeArticles.pageInfo.endCursor;

  if (hasNextPage && endCursor) {
    while (hasNextPage) {
      const additionalData = await getPaginatedData({
        first: 100,
        after: endCursor,
      });
      allKnowledgeArticles.push(...additionalData.knowledgeArticles.edges);
      hasNextPage = additionalData.knowledgeArticles.pageInfo.hasNextPage;
      endCursor = additionalData.knowledgeArticles.pageInfo.endCursor;
    }
  }

  return allKnowledgeArticles.map((item: any) => item.node);
};

export const getAllCategoriesWithSlugs = async () => {
  const data = await fetchAPI(`
  {
    knowledgeCategories(first: 100) {
      edges {
        node {
          slug
        }
      }
    }
  }
  `);

  return data?.knowledgeCategories.edges.map((item: any) => item.node);
};

export const getCategoryBySlug = async (slug: string) => {
  const data = await fetchAPI(`
  {
    knowledgeCategory(id: "${slug}", idType: SLUG) {
      id
      databaseId
      name
      slug
      knowledgeArticles(first: 100) {
        edges {
          node {
            id
            databaseId
            title
            slug
            date
            lead {
              is_featured
              image_main
              cta {
                headline
                description
                btn_text
                btn_url
              }
            }
            knowledgeCategories(first: 100) {
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

  return data?.knowledgeCategory;
};

export const getAllCategories = async () => {
  const data = await fetchAPI(`
  {
    knowledgeCategories(first: 100) {
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

  return data?.knowledgeCategories.edges.map((item: any) => item.node);
};
