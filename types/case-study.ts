import { PageSeo } from './page-seo';

type CaseStudyInstance = {
  title: string;
  content: string;
  slug: string;
  lead: CaseStudyLead;
  seo: PageSeo | null;
};

type CaseStudyLead = {
  is_featured: boolean;
  headline: string;
  image_main: string;
  image_hover: string;
  company: string;
  size: string;
  services: string;
  location: string;
  logo: {
    id: string;
    height: string;
    width: string;
  };
};

type CaseStudy = {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  lead: CaseStudyLead;
  caseStudyCategories: {
    edges: [
      {
        node: CaseStudyCategory;
      }
    ];
  };
};

type CaseStudyAssociation = {
  id: string;
  subtype: string;
  type: string;
  value: string;
};

type CaseStudyCategoryInstance = {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  caseStudies: {
    edges: [
      {
        node: CaseStudy;
      }
    ];
  };
  seo: PageSeo | null;
};

type CaseStudyCategory = {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
};

export type {
  CaseStudyLead,
  CaseStudyInstance,
  CaseStudy,
  CaseStudyAssociation,
  CaseStudyCategoryInstance,
  CaseStudyCategory,
};
