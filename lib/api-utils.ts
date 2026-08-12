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

type MediaItem = { databaseId?: number | string };

/**
 * Zwraca tylko te mediaItems, do których dana strona faktycznie się odwołuje.
 *
 * DLACZEGO (2026-08-12): `getMediaItems` pobiera CAŁĄ bibliotekę mediów
 * WordPressa i do 2026-08-12 trafiała ona w całości do propsów każdej strony.
 * Pomiar na produkcji: `__NEXT_DATA__` na stronie głównej ważył 471 KB przy
 * 518 KB całego HTML-a (91%), z czego 460 KB to były same `mediaItems`.
 * Strona główna renderuje ~14 obrazków.
 *
 * Kosztowało to trzy razy:
 *   1. dokument HTML (zasób renderujący, blokujący) był ~10x większy,
 *   2. przeglądarka parsowała 460 KB JSON-a na głównym wątku podczas
 *      hydracji - dokładnie w oknie, w którym Lighthouse liczy TBT,
 *   3. każdy prefetch `_next/data/*.json` ciągnął tę samą bibliotekę
 *      ponownie (~45 KB po kompresji x kilkanaście linków w viewporcie).
 *
 * JAK: `ContentImage` szuka mediów po `databaseId` porównywanym jako string,
 * a identyfikatory siedzą w różnych miejscach - również wewnątrz
 * `page.content`, które jest stringiem z zserializowanym JSON-em. Zamiast
 * zgadywać kształt danych, serializujemy wszystkie POZOSTAŁE propsy i zbieramy
 * z nich każdą liczbę całkowitą. To celowo nadmiarowe: przypadkowa kolizja
 * (np. szerokość 1920 równa jakiemuś databaseId) zostawi jeden obrazek za dużo,
 * co jest nieszkodliwe. Ryzykowny byłby tylko błąd w drugą stronę - dlatego
 * NIE zawężaj tego skanu do wybranych pól.
 */
const pickReferencedMediaItems = (
  mediaItems: unknown,
  otherProps: Record<string, unknown>
): unknown => {
  if (!Array.isArray(mediaItems)) {
    return mediaItems;
  }

  let serialised: string;
  try {
    serialised = JSON.stringify(otherProps) || "";
  } catch {
    // Cykl w danych albo inna niespodzianka - lepiej oddać komplet mediów
    // (wolno, ale poprawnie) niż wyrenderować stronę bez obrazków.
    return mediaItems;
  }

  const referencedIds = new Set(serialised.match(/\d+/g) || []);

  return (mediaItems as MediaItem[]).filter(
    (item) =>
      item?.databaseId !== undefined &&
      referencedIds.has(String(item.databaseId))
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

    // Wszystko poza mediaItems - to jest zbiór, w którym szukamy odwołań.
    const propsWithoutMedia = {
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
        ...propsWithoutMedia,
        mediaItems: pickReferencedMediaItems(mediaItems, propsWithoutMedia),
      },
    };
  };