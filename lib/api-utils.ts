import * as Sentry from "@sentry/nextjs";
import { getMediaItems } from "@/queries/media";
import { getMenus } from "./menu-utils";
import { getAllCaseStudies } from "@/queries/case-studies";
import { getGravityForms } from "@/queries/gravity-forms";
import { getAllKnowledgeArticles } from "@/queries/knowledge";
import { getAllFaqs } from "@/queries/faq";
import { getAllPartials } from "@/queries/partials";

const API_URL = process.env.WORDPRESS_API_URL || "";

// ISR: jak często (w sekundach) Next ma w tle odświeżać wygenerowaną stronę.
// Strona jest serwowana ze statycznego cache (niski TTFB), a dane odświeżają się
// co REVALIDATE_SECONDS bez blokowania requestu użytkownika.
export const REVALIDATE_SECONDS = 60;

// Next ustawia tę fazę tylko podczas `next build` (jeden proces na cały build).
const IS_BUILD_PHASE = process.env.NEXT_PHASE === "phase-production-build";

// Memoizacja danych globalnych WYŁĄCZNIE na czas builda. Przy pre-renderingu
// (getStaticPaths) każda z setek stron woła withGlobalData, a dane globalne
// (menu, media, formularze...) są dla wszystkich identyczne - bez tego każda
// strona pobierałaby je od nowa, w tym pełną sekwencyjną paginację getMediaItems.
// W runtime (rewalidacja ISR / fallback) cache jest wyłączony, żeby dane były
// świeże - trzymamy Promise, więc równoległe wywołania też się deduplikują.
const buildDataCache = new Map<string, Promise<unknown>>();

const getGlobal = <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  if (!IS_BUILD_PHASE) {
    return fetcher();
  }

  const existing = buildDataCache.get(key) as Promise<T> | undefined;
  if (existing) {
    return existing;
  }

  const value = fetcher().catch((err) => {
    // Nie cache'ujemy błędu - kolejna strona ma szansę spróbować ponownie.
    buildDataCache.delete(key);
    throw err;
  });

  buildDataCache.set(key, value);
  return value;
};

type HeadersType = {
  "Content-Type": string;
  Authorization?: string;
};

// Wyciąga nazwę operacji z zapytania GraphQL, np. "query getMediaItems(...)" -> "getMediaItems".
const getOperationName = (query: string): string => {
  const match = query.match(/\b(?:query|mutation|subscription)\s+([A-Za-z0-9_]+)/);
  return match?.[1] || "anonymous";
};

export const fetchAPI = async (
  query = "",
  { variables }: Record<string, any> = {}
) => {
  const headers: HeadersType = { "Content-Type": "application/json" };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      "Authorization"
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const operationName = getOperationName(query);

  Sentry.addBreadcrumb({
    category: "graphql",
    message: `GraphQL request: ${operationName}`,
    level: "info",
    data: { operationName, variables },
  });

  // WPGraphQL Plugin must be enabled
  return Sentry.startSpan(
    {
      op: "graphql.query",
      name: operationName,
      attributes: {
        "graphql.operation.name": operationName,
      },
    },
    async () => {
      const res = await fetch(API_URL, {
        headers,
        method: "POST",
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const json = await res.json();

      if (json.errors) {
        console.error(json.errors);
        Sentry.captureException(new Error("Failed to fetch API"), {
          tags: { graphql_operation: operationName },
          contexts: {
            graphql: {
              operationName,
              variables,
              errors: json.errors,
            },
          },
        });
        throw new Error("Failed to fetch API");
      }

      return json.data;
    }
  );
};

// Media library entries referenced by a page's props.
//
// PROBLEM (measured on the live homepage, 2026-08-17):
//   document              517,744 chars
//   __NEXT_DATA__         471,133 chars  (91% of the document)
//   pageProps.mediaItems  460,065 chars  = 1705 entries
// ...on a page that renders about 14 images. Every page shipped the ENTIRE
// WordPress media library, and paid for it three times over:
//   1. the render-blocking document is ~10x bigger than it needs to be;
//   2. 460KB of JSON is parsed on the main thread during hydration, inside the
//      window that TBT measures;
//   3. every next/link prefetch re-downloads the same library in the route's
//      _next/data/*.json, and there are a dozen links in the first viewport.
//
// WHY A SCAN IS THE SAFE FILTER HERE:
// MediaItemsContext has exactly one consumer, ContentImage, and it resolves an
// entry only by `item.databaseId.toString() === id`. That `id` always comes out
// of the page's own props (page.content is a JSON string, menus, partials,
// caseStudies, knowledgeArticles, faqs) - there is no other source. So any id
// that could possibly be looked up is, by construction, a numeric token in the
// serialized props. Keeping every entry whose databaseId appears as such a
// token is therefore a superset of what the page can render.
// It is deliberately generous: an id colliding with an unrelated number (a
// width, a year, a post id) just keeps one extra entry, which is harmless. The
// failure we must avoid is the opposite - dropping an entry that IS used, which
// would render <></> and silently lose an image.
const pickReferencedMediaItems = (mediaItems: any[], referencingProps: object) => {
  if (!Array.isArray(mediaItems) || mediaItems.length === 0) {
    return mediaItems;
  }

  const serialized = JSON.stringify(referencingProps ?? {});

  // Every run of digits in the serialized props, whatever it is embedded in
  // (a JSON string, an escaped JSON string, an HTML attribute).
  const referenced = new Set(serialized.match(/\d+/g) ?? []);

  return mediaItems.filter((item) =>
    referenced.has(String(item?.databaseId))
  );
};

export const withGlobalData =
  (getStaticProps: any) =>
  async (...props: any) => {
    // Dane strony i dane globalne są od siebie niezależne - pobieramy je
    // równolegle jednym Promise.all, zamiast czekać po kolei (waterfall).
    const [
      result,
      menus,
      mediaItems,
      forms,
      caseStudies,
      knowledgeArticles,
      faqs,
      partials,
    ] = await Promise.all([
      getStaticProps(...props),
      getGlobal("menus", getMenus),
      getGlobal("mediaItems", getMediaItems),
      getGlobal("forms", getGravityForms),
      getGlobal("caseStudies", getAllCaseStudies),
      getGlobal("knowledgeArticles", getAllKnowledgeArticles),
      getGlobal("faqs", getAllFaqs),
      getGlobal("partials", getAllPartials),
    ]);

    const staticProps = result?.props || {};

    // Everything that can carry a media id. mediaItems itself is excluded -
    // scanning it against itself would match every entry and filter nothing.
    const referencingProps = {
      ...staticProps,
      menus,
      forms,
      caseStudies,
      knowledgeArticles,
      faqs,
      partials,
    };

    return {
      ...result,
      props: {
        ...referencingProps,
        mediaItems: pickReferencedMediaItems(mediaItems, referencingProps),
      },
    };
  };