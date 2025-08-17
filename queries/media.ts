import { fetchAPI } from '../lib/api-utils';

export const getMediaItems = async () => {
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
      query getMediaItems($first: Int, $last: Int, $after: String, $before: String) {
        mediaItems(first: $first, last: $last, after: $after, before: $before) {
          edges {
            node {
              altText
              databaseId
              sourceUrl
              mediaDetails {
                file
                height
                width
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
  const allMediaItems = initialData.mediaItems.edges;

  let hasNextPage = initialData.mediaItems.pageInfo.hasNextPage;
  let endCursor = initialData.mediaItems.pageInfo.endCursor;

  if (hasNextPage && endCursor) {
    while (hasNextPage) {
      const additionalData = await getPaginatedData({
        first: 100,
        after: endCursor,
      });
      allMediaItems.push(...additionalData.mediaItems.edges);
      hasNextPage = additionalData.mediaItems.pageInfo.hasNextPage;
      endCursor = additionalData.mediaItems.pageInfo.endCursor;
    }
  }

  return allMediaItems.map((item: any) => item.node);
};

export const getMediaItemByID = async (id: string) => {
  const data = await fetchAPI(`
    {
      mediaItem(id: "${id}", idType: DATABASE_ID) {
        altText
        databaseId
        mediaDetails {
          file
          height
          width
        }
      }
    }
  `);

  return data;
};