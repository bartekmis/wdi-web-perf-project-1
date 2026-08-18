import dynamic from 'next/dynamic';

// Wszystkie ~60 szablonów sekcji było importowanych STATYCZNIE, więc każda
// strona wysyłała do przeglądarki kod każdego szablonu - razem z bibliotekami,
// które one ciągną: Swiper, GSAP, curtains.js (WebGL), react-youtube,
// @react-google-maps/api. Homepage renderuje 1 header i 9 sekcji z tej puli,
// a mimo to np. chunk Swipera (88,7 kB) kosztował ~396 ms wykonania przy 99,5%
// nieużytego kodu (Lighthouse: unused-javascript).
//
// dynamic() z domyślnym ssr:true nie zmienia renderowania po stronie serwera -
// HTML wychodzi taki sam - ale Next dokłada do strony tylko te chunki, których
// faktycznie użyła. Reszta nie jest już pobierana ani parsowana.

const HeaderImageSplit = dynamic(() => import('./Templates/HeaderImageSplit'));
const HeaderSimpleText = dynamic(() => import('./Templates/HeaderSimpleText'));
const HeaderKnowledgeArticle = dynamic(() => import('./Templates/HeaderKnowledgeArticle'));

const Section100 = dynamic(() => import('./Templates/Section100'));
const Section50x50 = dynamic(() => import('./Templates/Section50x50'));
const Section33x33x33 = dynamic(() => import('./Templates/Section33x33x33'));
const Section25x25x25x25 = dynamic(() => import('./Templates/Section25x25x25x25'));
const Section50x50Image = dynamic(() => import('./Templates/Section50x50Image'));
const SectionBigImage = dynamic(() => import('./Templates/SectionBigImage'));
const SectionHeadingAndText = dynamic(() => import('./Templates/SectionHeadingAndText'));
const SectionLogoTicker = dynamic(() => import('./Templates/SectionLogoTicker'));
const Section50x50ServicesIntro = dynamic(() => import('./Templates/Section50x50ServicesIntro'));
const SectionTextAndDoubleImage = dynamic(() => import('./Templates/SectionTextAndDoubleImage'));
const SectionFeaturedCaseStudy = dynamic(() => import('./Templates/SectionFeaturedCaseStudy'));
const SectionPanningText = dynamic(() => import('./Templates/SectionPanningText'));
const SectionTextWithCta = dynamic(() => import('./Templates/SectionTextWithCta'));
const SectionVideoCta = dynamic(() => import('./Templates/SectionVideoCta'));
const SectionCaseStudyPortraitAndText = dynamic(() => import('./Templates/SectionCaseStudyPortraitAndText'));
const SectionCaseStudyLandscapeAndText = dynamic(() => import('./Templates/SectionCaseStudyLandscapeAndText'));
const SectionCaseStudyEdgeImageAndText = dynamic(() => import('./Templates/SectionCaseStudyEdgeImageAndText'));
const SectionCaseStudyLargeImage = dynamic(() => import('./Templates/SectionCaseStudyLargeImage'));
const SectionCaseStudyTripleImage = dynamic(() => import('./Templates/SectionCaseStudyTripleImage'));
const SectionCaseStudyDoubleImage = dynamic(() => import('./Templates/SectionCaseStudyDoubleImage'));
const SectionCaseStudyTestimonial = dynamic(() => import('./Templates/SectionCaseStudyTestimonial'));
const SectionFeaturedCaseStudies = dynamic(() => import('./Templates/SectionFeaturedCaseStudies'));
const SectionCaseStudyTwoImages = dynamic(() => import('./Templates/SectionCaseStudyTwoImages'));
const SectionCaseStudyImagesSelection = dynamic(() => import('./Templates/SectionCaseStudyImagesSelection'));
const SectionCaseStudyBeforeAndAfter = dynamic(() => import('./Templates/SectionCaseStudyBeforeAndAfter'));
const SectionLatestKnowledge = dynamic(() => import('./Templates/SectionLatestKnowledge'));
const SectionPreFooter = dynamic(() => import('./Templates/SectionPreFooter'));
const SectionKnowledgeText = dynamic(() => import('./Templates/SectionKnowledgeText'));
const HeaderKnowledgeDownload = dynamic(() => import('./Templates/HeaderKnowledgeDownload'));
const SectionKnowledgeFaq = dynamic(() => import('./Templates/SectionKnowledgeFaq'));
const SectionKnowledgeTable = dynamic(() => import('./Templates/SectionKnowledgeTable'));
const SectionKnowledgeImage = dynamic(() => import('./Templates/SectionKnowledgeImage'));
const SectionKnowledgeVideo = dynamic(() => import('./Templates/SectionKnowledgeVideo'));
const SectionKnowledgeMap = dynamic(() => import('./Templates/SectionKnowledgeMap'));
const SectionKnowledgeStandoutCta = dynamic(() => import('./Templates/SectionKnowledgeStandoutCta'));
const SectionKnowledgePanningTextCta = dynamic(() => import('./Templates/SectionKnowledgePanningTextCta'));
const SectionFaq = dynamic(() => import('./Templates/SectionFaq'));
const SectionStandoutCta = dynamic(() => import('./Templates/SectionStandoutCta'));
const SectionStandoutTestimonial = dynamic(() => import('./Templates/SectionStandoutTestimonial'));
const SectionStory = dynamic(() => import('./Templates/SectionStory'));
const SectionTeamListing = dynamic(() => import('./Templates/SectionTeamListing'));
const SectionStandoutFeaturedContent = dynamic(() => import('./Templates/SectionStandoutFeaturedContent'));
const SectionLocationAndMap = dynamic(() => import('./Templates/SectionLocationAndMap'));
const HeaderContact = dynamic(() => import('./Templates/HeaderContact'));
const HeaderWithForm = dynamic(() => import('./Templates/HeaderWithForm'));
const Section50x50Form = dynamic(() => import('./Templates/Section50x50Form'));
const SectionCenteredForm = dynamic(() => import('./Templates/SectionCenteredForm'));
const SectionProcess = dynamic(() => import('./Templates/SectionProcess'));
const SectionLogoGrid = dynamic(() => import('./Templates/SectionLogoGrid'));
const SectionKnowledgeIframe = dynamic(() => import('./Templates/SectionKnowledgeIframe'));
const SectionCaseStudyIframe = dynamic(() => import('./Templates/SectionCaseStudyIframe'));

interface ContentTemplateComponent {
  _type: string;
  data: object;
}

export type ContentDetails = {
  title: string;
  date: string;
  category: {
    name: string;
    slug: string;
  };
};

export type ContentData = {
  content_header: Array<ContentTemplateComponent>;
  content_sections: Array<ContentTemplateComponent>;
};

interface Props {
  data: ContentData;
  details?: ContentDetails;
}

type ContentTemplates = {
  [key: string]: React.ComponentType<any>;
};

const headerTemplates: ContentTemplates = {
  'header-simple-text': HeaderSimpleText,
  'header-image-split': HeaderImageSplit,
  'header-contact': HeaderContact,
  'header-with-form': HeaderWithForm,
  'header-knowledge-article': HeaderKnowledgeArticle,
  'header-knowledge-download': HeaderKnowledgeDownload,
};

const sectionTemplates: ContentTemplates = {
  'section-100': Section100,
  'section-50-50': Section50x50,
  'section-33-33-33': Section33x33x33,
  'section-25-25-25-25': Section25x25x25x25,
  'section-50-50-image': Section50x50Image,
  'section-50-50-services-intro': Section50x50ServicesIntro,
  'section-50-50-form': Section50x50Form,
  'section-centered-form': SectionCenteredForm,
  'section-big-image': SectionBigImage,
  'section-heading-and-text': SectionHeadingAndText,
  'section-logo-ticker': SectionLogoTicker,
  'section-text-and-double-image': SectionTextAndDoubleImage,
  'section-panning-text': SectionPanningText,
  'section-text-with-cta': SectionTextWithCta,
  'section-video-cta': SectionVideoCta,
  'section-pre-footer': SectionPreFooter,
  'section-featured-case-study': SectionFeaturedCaseStudy,
  'section-faq': SectionFaq,
  'section-standout-cta': SectionStandoutCta,
  'section-standout-testimonial': SectionStandoutTestimonial,
  'section-story': SectionStory,
  'section-team-listing': SectionTeamListing,
  'section-standout-featured-content': SectionStandoutFeaturedContent,
  'section-location-and-map': SectionLocationAndMap,
  'section-process': SectionProcess,
  'section-logo-grid': SectionLogoGrid,
  
  'section-case-study-portrait-and-text': SectionCaseStudyPortraitAndText,
  'section-case-study-landscape-and-text': SectionCaseStudyLandscapeAndText,
  'section-case-study-images-selection': SectionCaseStudyImagesSelection,
  'section-case-study-edge-image-and-text': SectionCaseStudyEdgeImageAndText,
  'section-case-study-large-image': SectionCaseStudyLargeImage,
  'section-case-study-triple-image': SectionCaseStudyTripleImage,
  'section-case-study-double-image': SectionCaseStudyDoubleImage,
  'section-case-study-two-images': SectionCaseStudyTwoImages,
  'section-case-study-testimonial': SectionCaseStudyTestimonial,
  'section-case-study-before-and-after': SectionCaseStudyBeforeAndAfter,
  'section-featured-case-studies': SectionFeaturedCaseStudies,
  'section-case-study-iframe': SectionCaseStudyIframe,

  'section-latest-knowledge': SectionLatestKnowledge,
  'section-knowledge-text': SectionKnowledgeText,
  'section-knowledge-faq': SectionKnowledgeFaq,
  'section-knowledge-table': SectionKnowledgeTable,
  'section-knowledge-image': SectionKnowledgeImage,
  'section-knowledge-video': SectionKnowledgeVideo,
  'section-knowledge-map': SectionKnowledgeMap,
  'section-knowledge-standout-cta': SectionKnowledgeStandoutCta,
  'section-knowledge-panning-text-cta': SectionKnowledgePanningTextCta,
  'section-knowledge-iframe': SectionKnowledgeIframe,
};

export default function Content({ data, details }: Props) {
  return (
    <>
      {data.content_header &&
        data.content_header.map((header) => {
          const HeaderTemplate: any = headerTemplates[header._type];
          return (
            <HeaderTemplate key='header' data={header} details={details} />
          );
        })}

      {data.content_sections &&
        data.content_sections.map((section, index) => {
          const SectionTemplate: any = sectionTemplates[section._type];
          return <SectionTemplate key={index + 1} data={section} />;
        })}
    </>
  );
}
