import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { getFullHead } from "@/lib/helper-utils";
import Error from "../_error";
import { MdOutlineClose } from "react-icons/md";

import Content from "@/components/Content";
import { ContentData, ContentDetails } from "@/components/Content/Content";
import { KnowledgeInstance } from "@/types/knowledge";
import Button from "@/components/Components/Button";
import Loading from "@/components/Components/Loading";
import PerformanceMonitor from "@/components/Components/PerformanceMonitor";
import CSRWrapper from "@/components/CSRWrapper";

const KnowledgeArticle = () => {
  const router = useRouter();
  const ctaRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<KnowledgeInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      if (!router.query.slug) return;

      try {
        setLoading(true);

        // Use API endpoint to avoid DNS issues with client-side GraphQL
        const response = await fetch(`/api/knowledge/${router.query.slug}`);

        if (!response.ok) {
          console.error("Failed to fetch page:", response.statusText);
          setError(true);
          return;
        }

        const pageData = await response.json();
        setPage(pageData);
        setError(false);
      } catch (err) {
        console.error("Error fetching page:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [router.query.slug]);

  if (loading) {
    return <Loading active={true} />;
  }

  if (error || !page?.slug) {
    return <Error statusCode={404} />;
  }

  const content: ContentData = page?.content ? JSON.parse(page.content) : {};
  const fullHead = getFullHead(page?.seo?.fullHead || "");

  const details: ContentDetails = {
    title: page?.title,
    date: page?.date,
    category: {
      name: page?.knowledgeCategories.edges[0]?.node.name,
      slug: page?.knowledgeCategories.edges[0]?.node.slug,
    },
  };

  return (
    <CSRWrapper>
      <Head>{fullHead}</Head>
      <main className="relative">
        {/* sticky CTA */}
        {(page?.lead.cta.headline || page?.lead.cta.description) && (
          <div
            ref={ctaRef}
            className="fixed bottom-0 left-0 w-full z-[90] xl:absolute xl:bottom-[unset] xl:h-full xl:mt-[calc(30%-150px)] xl:w-[calc((100vw-(var(--containerSmallWidth)))/2)]"
          >
            <div className="w-full xl:px-2 xl:sticky xl:top-[124px] 3xl:px-[60px]">
              <div className="flex flex-col items-start bg-yellow p-6 pr-12 xl:p-4.5 3xl:p-9 overflow-hidden xl:max-w-[315px] mx-auto">
                <button
                  type="button"
                  aria-label="Close"
                  className="xl:hidden absolute right-0 top-0 p-4"
                  onClick={() =>
                    ctaRef.current && ctaRef.current.classList.add("hidden")
                  }
                >
                  <MdOutlineClose />
                </button>

                {page.lead.cta.headline && (
                  <p className="headline-5 mb-3 xl:mb-6">
                    {page.lead.cta.headline}
                  </p>
                )}
                {page.lead.cta.description && (
                  <div className="content mb-4 xl:mb-9">
                    <p>{page.lead.cta.description}</p>
                  </div>
                )}
                {page.lead.cta.btn_text && page.lead.cta.btn_url && (
                  <Button
                    className=""
                    component={Link}
                    href={page.lead.cta.btn_url}
                    variant="primary-black"
                    size="small"
                    connection="right"
                    text={page.lead.cta.btn_text}
                  ></Button>
                )}
              </div>
            </div>
          </div>
        )}

        <Content data={content} details={details} />
      </main>
      <PerformanceMonitor pageType="CSR" />
    </CSRWrapper>
  );
};

export default KnowledgeArticle;
