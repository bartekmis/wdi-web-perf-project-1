import { NextApiRequest, NextApiResponse } from "next";
import { getKnowledgeArticleBySlug } from "@/queries/knowledge";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  console.log(`API: Fetching knowledge article for slug: ${slug}`);

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const page = await getKnowledgeArticleBySlug(slug as string);
    console.log(`API: Query result for ${slug}:`, page ? "Found" : "Not found");

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.status(200).json(page);
  } catch (error: unknown) {
    console.error("API: Error fetching knowledge article:", error);
    res
      .status(500)
      .json({
        message: "Internal server error",
        error: (error as Error).message,
      });
  }
}
