import { PageSeo } from './page-seo';

type FaqInstance = {
  title: string;
  slug: string;
  lead: FaqLead;
  faqCategories: {
    edges: [
      {
        node: FaqCategory;
      }
    ];
  };
};

type FaqLead = {
  text: string;
};

type FaqAssociation = {
  id: string;
  subtype: string;
  type: string;
  value: string;
};

type FaqItem = {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  lead: FaqLead;
  faqCategories: {
    edges: [
      {
        node: FaqCategory;
      }
    ];
  };
};

type FaqCategoryInstance = {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  faqs: {
    edges: [
      {
        node: FaqItem;
      }
    ];
  };
  seo: PageSeo | null;
};

type FaqCategory = {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
};

export type {
  FaqLead,
  FaqInstance,
  FaqItem,
  FaqAssociation,
  FaqCategoryInstance,
  FaqCategory,
};
