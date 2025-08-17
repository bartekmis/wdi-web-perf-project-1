import Button from '@/components/Components/Button';
import FaqGroup, { AccordionItem } from '@/components/Components/FaqGroup';
import Headline from '@/components/Components/Headline';
import { FaqContext } from '@/contexts/faq';
import {
  getButtonConnection,
  getButtonVariant,
  getContainerSize,
  getHeadlineSize,
  getSectionSettings,
} from '@/lib/theme-utils';
import { FaqAssociation, FaqItem } from '@/types/faq';
import { SectionSettings } from '@/types/theme';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

const SectionFaq = ({ data }: { data: any }) => {
  const router = useRouter();
  const [faqItems, setFaqItems] = useState<AccordionItem[]>([]);

  const sectionSettings: SectionSettings = {
    bgColour: data.section_background_colour,
    paddingTop: data.section_padding_top,
    paddingBottom: data.section_padding_bottom,
    containerSize: data.section_container_size,
    fontSize: data.section_font_size,
    textAlignment: data.section_text_alignment,
  };

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
        filteredFaqs = filteredFaqs.filter((faq) => {
          return faq.faqCategories.edges.some((item) => {
            return (
              overridenCategories[0].id === item.node.databaseId.toString()
            );
          });
        }).slice(0, 5);
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
    <section
      id={data.id}
      className={`
        section
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <div className={getContainerSize(sectionSettings.containerSize)}>
        {data.headline && (
          <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} mb-16 animation-fadeIn`}>
            {data.headline}
          </Headline>
        )}

        {!!faqItems.length && (
          <FaqGroup
            items={faqItems}
            variant={data.is_secondary ? 'secondary' : undefined}
          />
        )}

        {!!data.btns?.length && (
          <div className='flex flex-wrap gap-4 mt-20 justify-end'>
            {data.btns.map((btn: any, index: number) => {
              return (
                <Button
                  key={index}
                  component={Link}
                  href={btn.url}
                  title={btn.title}
                  text={btn.title}
                  variant={getButtonVariant(btn.style)}
                  connection={getButtonConnection(btn.connection)}
                ></Button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionFaq;
