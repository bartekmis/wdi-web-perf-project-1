import { fetchAPI } from '@/lib/api-utils';

export const getAllPartials = async () => {
  const data = await fetchAPI(`
    {
      partials {
        social {
          pinterest_url
          instagram_url
          linkedin_url
          twitter_url
          youtube_url
        }
        navigation {
          nav_btn_text
          nav_btn_url
          nav_logo
        }
        footer {
          copyright_text
          footer_logo
        }
        company {
          address
          directions_url
          email
          phone
        }
        forms {
          forms_redirect_url
        }
      }
    }
  `);

  return data?.partials;
};