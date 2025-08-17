import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import FaqGroup, { AccordionItem } from "@/components/Components/FaqGroup";
import { FaqContext } from "@/contexts/faq";
import { FaqAssociation, FaqItem } from "@/types/faq";
import { getHeadlineSize } from "@/lib/theme-utils";

const SectionKnowledgeFaq = ({ data }: { data: any }) => {
  const router = useRouter();
  const [faqItems, setFaqItems] = useState<AccordionItem[]>([]);

  const allFaqs = useContext(FaqContext) as FaqItem[];
  const overridenFaqs = data.faqs_overriden as FaqAssociation[];
  const overridenCategories = data.faqs_category as FaqAssociation[];

  useEffect(() => {
    const handleFaqs = () => {
      let filteredFaqs: FaqItem[] = [];

      if (!!overridenFaqs?.length) {
        // get overriden faqs
        filteredFaqs = allFaqs.filter((faq) => {
          return overridenFaqs.some((item) => {
            return item.id === faq.databaseId.toString();
          });
        });
      } else {
        // get all faqs except the current route
        filteredFaqs = allFaqs.filter((faq) => faq.slug !== router.query.slug);
      }

      // get case studies of overriden category
      if (!!overridenCategories?.length) {
        filteredFaqs = filteredFaqs
          .filter((faq) => {
            return faq.faqCategories.edges.some((item) => {
              return (
                overridenCategories[0].id === item.node.databaseId.toString()
              );
            });
          })
          .slice(0, 5);
      }

      return filteredFaqs;
    };

    const faqs = handleFaqs();
    const faqItems = faqs.map(
      (faq) =>
        ({
          title: faq.title,
          text: faq.lead.text,
        } as AccordionItem)
    );

    setFaqItems(faqItems);
  }, [allFaqs, overridenFaqs, overridenCategories, router.query.slug]);

  return (
    <section id={data.id} className="section section--article bg-lightGrey">
      <div className="container-extra-small">
        {data.headline && (
          <h2
            className={`${getHeadlineSize(
              data.headline_size
            )} mb-6 animation-fadeIn`}
          >
            {data.headline}
          </h2>
        )}

        {!!faqItems.length && <FaqGroup items={faqItems} />}
      </div>
    </section>
  );
};

export default SectionKnowledgeFaq;
