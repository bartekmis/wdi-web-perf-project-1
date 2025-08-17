import { PageSeo } from './page-seo';

type KnowledgeInstance = {
  title: string;
  content: string;
  slug: string;
  date: string;
  lead: KnowledgeLead;
  knowledgeCategories: {
    edges: [
      {
        node: KnowledgeCategory;
      }
    ];
  };
  seo: PageSeo | null;
};

type KnowledgeCta = {
  headline: string;
  description: string;
  btn_text: string;
  btn_url: string;
};

type KnowledgeLead = {
  is_featured: boolean;
  image_main: string;
  cta: KnowledgeCta,
};

type KnowledgeArticle = {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  date: string;
  lead: KnowledgeLead;
  knowledgeCategories: {
    edges: [
      {
        node: KnowledgeCategory;
      }
    ];
  };
  seo: PageSeo | null;
};

type KnowledgeAssociation = {
  id: string;
  subtype: string;
  type: string;
  value: string;
};

type KnowledgeCategoryInstance = {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  knowledgeArticles: {
    edges: [
      {
        node: KnowledgeArticle;
      }
    ];
  };
  seo: PageSeo | null;
};

type KnowledgeCategory = {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
};

export type {
  KnowledgeLead,
  KnowledgeInstance,
  KnowledgeArticle,
  KnowledgeAssociation,
  KnowledgeCategoryInstance,
  KnowledgeCategory,
};
