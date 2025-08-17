import { getMediaItems } from "@/queries/media";
import { getMenus } from "./menu-utils";
import { getAllCaseStudies } from "@/queries/case-studies";
import { getGravityForms } from "@/queries/gravity-forms";
import { getAllKnowledgeArticles } from "@/queries/knowledge";
import { getAllFaqs } from "@/queries/faq";
import { getAllPartials } from "@/queries/partials";

const API_URL = process.env.WORDPRESS_API_URL || "";

type HeadersType = {
  "Content-Type": string;
  Authorization?: string;
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

  // WPGraphQL Plugin must be enabled
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
    throw new Error("Failed to fetch API");
  }

  return json.data;
};

export const withGlobalData =
  (getStaticProps: any) =>
  async (...props: any) => {
    const result = await getStaticProps(...props);
    const staticProps = result?.props || {};

    const menus = await getMenus();
    const mediaItems = await getMediaItems();
    const forms = await getGravityForms();
    const caseStudies = await getAllCaseStudies();
    const knowledgeArticles = await getAllKnowledgeArticles();
    const faqs = await getAllFaqs();
    const partials = await getAllPartials();

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