import { fetchAPI } from '@/lib/api-utils';

export const getContentTypeFullHead = async (contentType: string) => {
  const data = await fetchAPI(`
    {
      seo {
        contentTypes {
          caseStudy {
            archive {
              fullHead
            }
          }
          faq {
            archive {
              fullHead
            }
          }
          knowledgeArticle {
            archive {
              fullHead
            }
          }
        }
      }
    }
  `);

  return data?.seo?.contentTypes?.[contentType]?.archive?.fullHead;
};