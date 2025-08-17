type PartialsSocial = {
  instagram_url?: string;
  linkedin_url?: string;
  pinterest_url?: string;
  twitter_url?: string;
  youtube_url?: string;
};

type PartialsNavigation = {
  nav_btn_text?: string;
  nav_btn_url?: string;
  nav_logo?: string;
};

type PartialsFooter = {
  copyright_text?: string;
  footer_logo?: string;
};

type PartialsCompany = {
  address?: string;
  directions_url?: string;
  email?: string;
  phone?: string;
};

type PartialsForms = {
  forms_redirect_url?: string;
};

export type PartialsData = {
  social: PartialsSocial;
  navigation: PartialsNavigation;
  footer: PartialsFooter;
  company: PartialsCompany;
  forms: PartialsForms;
};
