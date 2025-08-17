import { fetchAPI } from '../lib/api-utils';

export const getAllCaseStudiesWithSlugs = async () => {
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
      query getCaseStudies($first: Int, $last: Int, $after: String, $before: String) {
        caseStudies(first: $first, last: $last, after: $after, before: $before) {
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
  const allCaseStudies = initialData.caseStudies.edges;

  let hasNextPage = initialData.caseStudies.pageInfo.hasNextPage;
  let endCursor = initialData.caseStudies.pageInfo.endCursor;

  if (hasNextPage && endCursor) {
    while (hasNextPage) {
      const additionalData = await getPaginatedData({
        first: 100,
        after: endCursor,
      });
      allCaseStudies.push(...additionalData.caseStudies.edges);
      hasNextPage = additionalData.caseStudies.pageInfo.hasNextPage;
      endCursor = additionalData.caseStudies.pageInfo.endCursor;
    }
  }

  return allCaseStudies.map((item: any) => item.node);
};

export const getCaseStudyBySlug = async (slug: string) => {
  const data = await fetchAPI(`
  {
    caseStudy(id: "${slug}", idType: URI) {
      title
      content
      slug
      lead {
        is_featured
        headline
        logo {
          id
          width
          height
        }
        image_main
        image_hover
        company
        size
        location
        services
      }
      seo {
        metaDesc
        title
        fullHead
      }
    }
  }
  `);

  return data?.caseStudy;
};

export const getAllCaseStudies = async () => {
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
      query getCaseStudies($first: Int, $last: Int, $after: String, $before: String) {
        caseStudies(first: $first, last: $last, after: $after, before: $before) {
          edges {
            node {
              id
              databaseId
              title
              slug
              lead {
                is_featured
                headline
                logo {
                  id
                  width
                  height
                }
                image_main
                image_hover
                company
                size
                location
                services
              }
              caseStudyCategories(first: 100) {
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
  const allCaseStudies = initialData.caseStudies.edges;

  let hasNextPage = initialData.caseStudies.pageInfo.hasNextPage;
  let endCursor = initialData.caseStudies.pageInfo.endCursor;

  if (hasNextPage && endCursor) {
    while (hasNextPage) {
      const additionalData = await getPaginatedData({
        first: 100,
        after: endCursor,
      });
      allCaseStudies.push(...additionalData.caseStudies.edges);
      hasNextPage = additionalData.caseStudies.pageInfo.hasNextPage;
      endCursor = additionalData.caseStudies.pageInfo.endCursor;
    }
  }

  return allCaseStudies.map((item: any) => item.node);
};

export const getAllCategoriesWithSlugs = async () => {
  const data = await fetchAPI(`
  {
    caseStudyCategories(first: 100) {
      edges {
        node {
          slug
        }
      }
    }
  }
  `);

  return data?.caseStudyCategories.edges.map((item: any) => item.node);
};

export const getCategoryBySlug = async (slug: string) => {
  const data = await fetchAPI(`
  {
    caseStudyCategory(id: "${slug}", idType: SLUG) {
      id
      databaseId
      name
      slug
      caseStudies(first: 100) {
        edges {
          node {
            id
            databaseId
            title
            slug
            lead {
              is_featured
              headline
              logo {
                id
                width
                height
              }
              image_main
              image_hover
              company
              size
              location
              services
            }
            caseStudyCategories(first: 100) {
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

  return data?.caseStudyCategory;
};

export const getAllCategories = async () => {
  const data = await fetchAPI(`
  {
    caseStudyCategories(first: 100) {
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

  return data?.caseStudyCategories.edges.map((item: any) => item.node);
};
