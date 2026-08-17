import { fetchAPI } from '../lib/api-utils';

type ResponseWithHeaders = { setHeader: (name: string, value: string) => void };

export const getMediaItems = async (res?: ResponseWithHeaders) => {
  const start = Date.now();

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
  // WPGraphQL zwraca kursor kolejnej strony dopiero po pobraniu bieżącej, więc
  // stronicowanie jest z natury sekwencyjne (nie da się zrównoleglić bez kursorów
  // z góry). Dlatego kluczowe jest, że to zapytanie odpala się teraz tylko przy
  // buildzie/rewalidacji ISR, a nie przy każdym requeście (patrz `withGlobalData`).
  const allMediaItems: any[] = [];
  let after: string | undefined = undefined;
  let hasNextPage = true;

  while (hasNextPage) {
    const { mediaItems } = await getPaginatedData({ first: 100, after });
    allMediaItems.push(...mediaItems.edges);
    hasNextPage = mediaItems.pageInfo.hasNextPage;
    after = mediaItems.pageInfo.endCursor;
  }

  // Ile trwało pobranie całej biblioteki mediów (wszystkie strony paginacji).
  // Widoczne w DevTools > Network > Timing danego requestu.
  res?.setHeader('Server-Timing', `media;dur=${Date.now() - start}`);

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