import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import Button from '@/components/Components/Button';
import { KnowledgeArticle, KnowledgeAssociation } from '@/types/knowledge';
import { KnowledgeContext } from '@/contexts/knowledge';
import { useInView } from 'react-intersection-observer';
import Headline from '@/components/Components/Headline';

const SectionLatestKnowledge = ({ data }: { data: any }) => {
  const router = useRouter();
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);

  const sectionSettings: SectionSettings = {
    bgColour: data.section_background_colour,
    paddingTop: data.section_padding_top,
    paddingBottom: data.section_padding_bottom,
    containerSize: data.section_container_size,
    fontSize: data.section_font_size,
    textAlignment: data.section_text_alignment,
  };

  const allKnowledgeArticles = useContext(
    KnowledgeContext
  ) as KnowledgeArticle[];
  const overridenKnowledgeArticles =
    data.knowledge_articles_overriden as KnowledgeAssociation[];

  const CardsSlider = dynamic(
    () => import('../../Components/Swiper/CardsSlider')
  );

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  useEffect(() => {
    const handleArticles = () => {
      let filteredArticles: KnowledgeArticle[] = [];

      if (!!overridenKnowledgeArticles?.length) {
        // get overriden articles
        filteredArticles = allKnowledgeArticles.filter((article) => {
          return overridenKnowledgeArticles.some((item) => {
            return item.id === article.databaseId.toString();
          });
        });
      } else {
        // get all articles except the current route and sort by newest
        filteredArticles = allKnowledgeArticles
          .filter((article) => article.slug !== router.query.slug)
          .sort((a, b) => {
            const date1 = new Date(a.date);
            const date2 = new Date(b.date);

            return date2.getTime() - date1.getTime();
          });
      }

      return filteredArticles;
    };

    const articles = handleArticles();
    setArticles(articles.slice(0, 3)); // return three latest records
  }, [allKnowledgeArticles, overridenKnowledgeArticles, router.query.slug]);

  return (
    <section
      ref={ref}
      id={data.id}
      className={`
        section
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <div
        className={`${getContainerSize(sectionSettings.containerSize)} ${
          data.btn_text && data.btn_url ? 'mb-12' : ''
        }`}
      >
        <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} text-center animation-fadeIn`}>
          {data.headline || 'Latest Articles'}
        </Headline>

        {inView && !!articles.length && (
          <div className='mt-12 md:mt-16'>
            <CardsSlider items={articles} />
          </div>
        )}
      </div>

      {data.btn_text && data.btn_url && (
        <div className='absolute bottom-0 left-1/2 translate-x-[-50%] translate-y-[50%] z-[1]'>
          <Button
            component={Link}
            href={data.btn_url}
            title={data.btn_text}
            text={data.btn_text}
            variant='secondary-yellow'
          ></Button>
        </div>
      )}
    </section>
  );
};

export default SectionLatestKnowledge;
