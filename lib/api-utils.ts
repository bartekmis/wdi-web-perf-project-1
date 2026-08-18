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

/**
 * Ship only the media items a page can actually render.
 *
 * `getMediaItems` fetches the ENTIRE WordPress media library, and
 * `withGlobalData` used to hand all of it to every page as a prop. Next
 * serialises props into the __NEXT_DATA__ script tag in the HTML, so the
 * homepage document was:
 *
 *     document total          517,744 chars
 *     __NEXT_DATA__           471,133 chars   (91% of the document)
 *     pageProps.mediaItems    460,065 chars   (1705 items)
 *
 * for a page that renders about 14 images. Every visitor downloaded, parsed and
 * re-hydrated ~450KB of JSON describing images that are not on the page - on the
 * critical path, before hydration can finish.
 *
 * ContentImage resolves an image by looking up `databaseId` against an id that
 * came out of these very props (`data.image`, `caseStudy.lead.logo.id`,
 * `logo.image`, ...). So the set of ids a page can possibly ask for is exactly
 * the set of integers appearing anywhere in its serialised props. We collect
 * those and keep only the matching items.
 *
 * Deliberately biased towards keeping too much: any integer anywhere in the
 * props counts as a potential id, so an unrelated number that happens to equal a
 * databaseId merely keeps one extra item. The failure mode that would actually
 * break rendering - dropping an item a page needed - requires an id that is
 * absent from the props, which cannot happen for anything rendered from them.
 *
 * NOTE: /api/global-data (used by CSRWrapper for preview) is intentionally left
 * alone and still returns the full library - it is a runtime fetch on an
 * authenticated preview path, not part of any visitor's critical path.
 */
const pruneMediaItems = (mediaItems: any, referenceSources: unknown[]) => {
  if (!Array.isArray(mediaItems) || mediaItems.length === 0) {
    return mediaItems;
  }

  const referencedIds = new Set(
    JSON.stringify(referenceSources).match(/\d+/g) || []
  );

  return mediaItems.filter((item: any) =>
    referencedIds.has(String(item?.databaseId))
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

    return {
      ...result,
      props: {
        ...staticProps,
        menus,
        mediaItems: pruneMediaItems(mediaItems, [
          staticProps,
          menus,
          forms,
          caseStudies,
          knowledgeArticles,
          faqs,
          partials,
        ]),
        forms,
        caseStudies,
        knowledgeArticles,
        faqs,
        partials,
      },
    };
  };