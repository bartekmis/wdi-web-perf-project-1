import dynamic from 'next/dynamic';

// EVERY SECTION TEMPLATE IS CODE-SPLIT (2026-08-17).
//
// These 54 templates used to be static imports, so every route shipped and
// evaluated all of them - including gsap, curtainsjs (WebGL), swiper,
// @react-google-maps/api and react-youtube - no matter which ones it rendered.
// The homepage renders about 10.
//
// That cost shows up as script evaluation on the main thread, which is what
// Lighthouse's simulated LCP is waiting on. Measured before this change
// (mobile/simulate, Moto G Power + Fast 4G): Script Evaluation 1475ms total,
// with chunks 178 and 137 - the template barrel - contributing 347ms + 224ms.
//
// `ssr: true` is the important part: the server still renders every template
// inline, so the HTML is byte-identical and the LCP image stays discoverable
// by the preload scanner in the initial document. Only the CLIENT bundle is
// split, so a route downloads and evaluates just the templates it uses.
//
// The template() calls MUST stay at module scope. Calling dynamic() inside
// render creates a new component type on every render, which remounts the
// whole subtree and throws away its DOM - that regression was shipped once
// already (fixed in e750ef1) so do not move these inside Content().

// `ssr: true` is next/dynamic's default in the pages router, but it is the one
// property this whole approach depends on, so it is stated once here rather
// than left implicit 54 times below.
// The cast keeps the two template maps below typed exactly as they were:
// next/dynamic erases the loaded component's props to ComponentType<{}>, which
// would not satisfy ContentTemplates.
const template = (loader: () => Promise<any>) =>
  dynamic(loader, { ssr: true }) as React.FC<ContentTemplateComponent>;

const HeaderImageSplit = template(() => import('./Templates/HeaderImageSplit'));
const HeaderSimpleText = template(() => import('./Templates/HeaderSimpleText'));
const HeaderKnowledgeArticle = template(() => import('./Templates/HeaderKnowledgeArticle'));
const Section100 = template(() => import('./Templates/Section100'));
const Section50x50 = template(() => import('./Templates/Section50x50'));
const Section33x33x33 = template(() => import('./Templates/Section33x33x33'));
const Section25x25x25x25 = template(() => import('./Templates/Section25x25x25x25'));
const Section50x50Image = template(() => import('./Templates/Section50x50Image'));
const SectionBigImage = template(() => import('./Templates/SectionBigImage'));
const SectionHeadingAndText = template(() => import('./Templates/SectionHeadingAndText'));
const SectionLogoTicker = template(() => import('./Templates/SectionLogoTicker'));
const Section50x50ServicesIntro = template(() => import('./Templates/Section50x50ServicesIntro'));
const SectionTextAndDoubleImage = template(() => import('./Templates/SectionTextAndDoubleImage'));
const SectionFeaturedCaseStudy = template(() => import('./Templates/SectionFeaturedCaseStudy'));
const SectionPanningText = template(() => import('./Templates/SectionPanningText'));
const SectionTextWithCta = template(() => import('./Templates/SectionTextWithCta'));
const SectionVideoCta = template(() => import('./Templates/SectionVideoCta'));
const SectionCaseStudyPortraitAndText = template(() => import('./Templates/SectionCaseStudyPortraitAndText'));
const SectionCaseStudyLandscapeAndText = template(() => import('./Templates/SectionCaseStudyLandscapeAndText'));
const SectionCaseStudyEdgeImageAndText = template(() => import('./Templates/SectionCaseStudyEdgeImageAndText'));
const SectionCaseStudyLargeImage = template(() => import('./Templates/SectionCaseStudyLargeImage'));
const SectionCaseStudyTripleImage = template(() => import('./Templates/SectionCaseStudyTripleImage'));
const SectionCaseStudyDoubleImage = template(() => import('./Templates/SectionCaseStudyDoubleImage'));
const SectionCaseStudyTestimonial = template(() => import('./Templates/SectionCaseStudyTestimonial'));
const SectionFeaturedCaseStudies = template(() => import('./Templates/SectionFeaturedCaseStudies'));
const SectionCaseStudyTwoImages = template(() => import('./Templates/SectionCaseStudyTwoImages'));
const SectionCaseStudyImagesSelection = template(() => import('./Templates/SectionCaseStudyImagesSelection'));
const SectionCaseStudyBeforeAndAfter = template(() => import('./Templates/SectionCaseStudyBeforeAndAfter'));
const SectionLatestKnowledge = template(() => import('./Templates/SectionLatestKnowledge'));
const SectionPreFooter = template(() => import('./Templates/SectionPreFooter'));
const SectionKnowledgeText = template(() => import('./Templates/SectionKnowledgeText'));
const HeaderKnowledgeDownload = template(() => import('./Templates/HeaderKnowledgeDownload'));
const SectionKnowledgeFaq = template(() => import('./Templates/SectionKnowledgeFaq'));
const SectionKnowledgeTable = template(() => import('./Templates/SectionKnowledgeTable'));
const SectionKnowledgeImage = template(() => import('./Templates/SectionKnowledgeImage'));
const SectionKnowledgeVideo = template(() => import('./Templates/SectionKnowledgeVideo'));
const SectionKnowledgeMap = template(() => import('./Templates/SectionKnowledgeMap'));
const SectionKnowledgeStandoutCta = template(() => import('./Templates/SectionKnowledgeStandoutCta'));
const SectionKnowledgePanningTextCta = template(() => import('./Templates/SectionKnowledgePanningTextCta'));
const SectionFaq = template(() => import('./Templates/SectionFaq'));
const SectionStandoutCta = template(() => import('./Templates/SectionStandoutCta'));
const SectionStandoutTestimonial = template(() => import('./Templates/SectionStandoutTestimonial'));
const SectionStory = template(() => import('./Templates/SectionStory'));
const SectionTeamListing = template(() => import('./Templates/SectionTeamListing'));
const SectionStandoutFeaturedContent = template(() => import('./Templates/SectionStandoutFeaturedContent'));
const SectionLocationAndMap = template(() => import('./Templates/SectionLocationAndMap'));
const HeaderContact = template(() => import('./Templates/HeaderContact'));
const HeaderWithForm = template(() => import('./Templates/HeaderWithForm'));
const Section50x50Form = template(() => import('./Templates/Section50x50Form'));
const SectionCenteredForm = template(() => import('./Templates/SectionCenteredForm'));
const SectionProcess = template(() => import('./Templates/SectionProcess'));
const SectionLogoGrid = template(() => import('./Templates/SectionLogoGrid'));
const SectionKnowledgeIframe = template(() => import('./Templates/SectionKnowledgeIframe'));
const SectionCaseStudyIframe = template(() => import('./Templates/SectionCaseStudyIframe'));

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
  [key: string]: React.FC<ContentTemplateComponent>;
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
