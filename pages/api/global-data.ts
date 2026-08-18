import { NextApiRequest, NextApiResponse } from "next";
import { getMenus } from "@/lib/menu-utils";
import { getMediaItems } from "@/queries/media";
import { getGravityForms } from "@/queries/gravity-forms";
import { getAllCaseStudies } from "@/queries/case-studies";
import { getAllKnowledgeArticles } from "@/queries/knowledge";
import { getAllFaqs } from "@/queries/faq";
import { getAllPartials } from "@/queries/partials";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get all global data (same as withGlobalData)
    const [
      menus,
      mediaItems,
      forms,
      caseStudies,
      knowledgeArticles,
      faqs,
      partials,
    ] = await Promise.all([
      getMenus(),
      getMediaItems(),
      getGravityForms(),
      getAllCaseStudies(),
      getAllKnowledgeArticles(),
      getAllFaqs(),
      getAllPartials(),
    ]);

    res.status(200).json({
      menus,
      mediaItems,
      forms,
      caseStudies,
      knowledgeArticles,
      faqs,
      partials,
    });
  } catch (error) {
    console.error("Error fetching global data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
