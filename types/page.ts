import { PageSeo } from './page-seo';

type PageInstance = {
  title: string;
  content: string;
  slug: string;
  uri: string;
  seo: PageSeo | null;
};

export type { PageInstance };
