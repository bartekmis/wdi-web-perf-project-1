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
      getMenus(),
      getMediaItems(),
      getGravityForms(),
      getAllCaseStudies(),
      getAllKnowledgeArticles(),
      getAllFaqs(),
      getAllPartials(),
    ]);

    const staticProps = result?.props || {};

    return {
      ...result,
      props: {
        ...staticProps,
        menus,
        mediaItems,
        forms,
        caseStudies,
        knowledgeArticles,
        faqs,
        partials,
      },
    };
  };