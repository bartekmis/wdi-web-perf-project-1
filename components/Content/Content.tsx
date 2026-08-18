import dynamic from 'next/dynamic';

/**
 * CODE-SPLIT 2026-08-18. Every one of these templates used to be a STATIC
 * import, so the bundle for any route contained all of them plus everything
 * they pull in - react-curtains, @react-google-maps/api, the Gravity Forms
 * components and each of the six swiper sliders - and the browser evaluated
 * the lot before it could hydrate. The homepage renders 11 of them.
 *
 * WRITE THESE AS LITERAL `dynamic(() => import('...'))` CALLS. Do not factor
 * the repetition out behind a helper such as
 *   `const template = (l) => dynamic(l, { ssr: true })`.
 * It looks identical and it breaks the page. Next's SWC `next-dynamic`
 * transform pattern-matches the literal call shape to attach
 * `loadableGenerated`, which is what registers each chunk against the route in
 * the build manifest. Behind a helper the transform sees nothing, the build
 * does not know the route needs these modules, the client hydrates before the
 * chunks exist, all 54 components render their null fallback, and the
 * server-rendered body is wiped and re-inserted. Measured when that was tried:
 * <script> chunk tags in the HTML fell 15 -> 5, __NEXT_DATA__.dynamicIds went
 * missing, and CLS went 0 -> 0.945 (individual runs to 1.825).
 *
 * `ssr: true` is required for the same reason it is stated explicitly: these
 * sections must still server-render, or the page paints empty and CLS goes
 * with it.
 */
const HeaderImageSplit = dynamic(() => import('./Templates/HeaderImageSplit'), { ssr: true });
const HeaderSimpleText = dynamic(() => import('./Templates/HeaderSimpleText'), { ssr: true });
const HeaderKnowledgeArticle = dynamic(() => import('./Templates/HeaderKnowledgeArticle'), { ssr: true });

const Section100 = dynamic(() => import('./Templates/Section100'), { ssr: true });
const Section50x50 = dynamic(() => import('./Templates/Section50x50'), { ssr: true });
const Section33x33x33 = dynamic(() => import('./Templates/Section33x33x33'), { ssr: true });
const Section25x25x25x25 = dynamic(() => import('./Templates/Section25x25x25x25'), { ssr: true });
const Section50x50Image = dynamic(() => import('./Templates/Section50x50Image'), { ssr: true });
const SectionBigImage = dynamic(() => import('./Templates/SectionBigImage'), { ssr: true });
const SectionHeadingAndText = dynamic(() => import('./Templates/SectionHeadingAndText'), { ssr: true });
const SectionLogoTicker = dynamic(() => import('./Templates/SectionLogoTicker'), { ssr: true });
const Section50x50ServicesIntro = dynamic(() => import('./Templates/Section50x50ServicesIntro'), { ssr: true });
const SectionTextAndDoubleImage = dynamic(() => import('./Templates/SectionTextAndDoubleImage'), { ssr: true });
const SectionFeaturedCaseStudy = dynamic(() => import('./Templates/SectionFeaturedCaseStudy'), { ssr: true });
const SectionPanningText = dynamic(() => import('./Templates/SectionPanningText'), { ssr: true });
const SectionTextWithCta = dynamic(() => import('./Templates/SectionTextWithCta'), { ssr: true });
const SectionVideoCta = dynamic(() => import('./Templates/SectionVideoCta'), { ssr: true });
const SectionCaseStudyPortraitAndText = dynamic(() => import('./Templates/SectionCaseStudyPortraitAndText'), { ssr: true });
const SectionCaseStudyLandscapeAndText = dynamic(() => import('./Templates/SectionCaseStudyLandscapeAndText'), { ssr: true });
const SectionCaseStudyEdgeImageAndText = dynamic(() => import('./Templates/SectionCaseStudyEdgeImageAndText'), { ssr: true });
const SectionCaseStudyLargeImage = dynamic(() => import('./Templates/SectionCaseStudyLargeImage'), { ssr: true });
const SectionCaseStudyTripleImage = dynamic(() => import('./Templates/SectionCaseStudyTripleImage'), { ssr: true });
const SectionCaseStudyDoubleImage = dynamic(() => import('./Templates/SectionCaseStudyDoubleImage'), { ssr: true });
const SectionCaseStudyTestimonial = dynamic(() => import('./Templates/SectionCaseStudyTestimonial'), { ssr: true });
const SectionFeaturedCaseStudies = dynamic(() => import('./Templates/SectionFeaturedCaseStudies'), { ssr: true });
const SectionCaseStudyTwoImages = dynamic(() => import('./Templates/SectionCaseStudyTwoImages'), { ssr: true });
const SectionCaseStudyImagesSelection = dynamic(() => import('./Templates/SectionCaseStudyImagesSelection'), { ssr: true });
const SectionCaseStudyBeforeAndAfter = dynamic(() => import('./Templates/SectionCaseStudyBeforeAndAfter'), { ssr: true });
const SectionLatestKnowledge = dynamic(() => import('./Templates/SectionLatestKnowledge'), { ssr: true });
const SectionPreFooter = dynamic(() => import('./Templates/SectionPreFooter'), { ssr: true });
const SectionKnowledgeText = dynamic(() => import('./Templates/SectionKnowledgeText'), { ssr: true });
const HeaderKnowledgeDownload = dynamic(() => import('./Templates/HeaderKnowledgeDownload'), { ssr: true });
const SectionKnowledgeFaq = dynamic(() => import('./Templates/SectionKnowledgeFaq'), { ssr: true });
const SectionKnowledgeTable = dynamic(() => import('./Templates/SectionKnowledgeTable'), { ssr: true });
const SectionKnowledgeImage = dynamic(() => import('./Templates/SectionKnowledgeImage'), { ssr: true });
const SectionKnowledgeVideo = dynamic(() => import('./Templates/SectionKnowledgeVideo'), { ssr: true });
const SectionKnowledgeMap = dynamic(() => import('./Templates/SectionKnowledgeMap'), { ssr: true });
const SectionKnowledgeStandoutCta = dynamic(() => import('./Templates/SectionKnowledgeStandoutCta'), { ssr: true });
const SectionKnowledgePanningTextCta = dynamic(() => import('./Templates/SectionKnowledgePanningTextCta'), { ssr: true });
const SectionFaq = dynamic(() => import('./Templates/SectionFaq'), { ssr: true });
const SectionStandoutCta = dynamic(() => import('./Templates/SectionStandoutCta'), { ssr: true });
const SectionStandoutTestimonial = dynamic(() => import('./Templates/SectionStandoutTestimonial'), { ssr: true });
const SectionStory = dynamic(() => import('./Templates/SectionStory'), { ssr: true });
const SectionTeamListing = dynamic(() => import('./Templates/SectionTeamListing'), { ssr: true });
const SectionStandoutFeaturedContent = dynamic(() => import('./Templates/SectionStandoutFeaturedContent'), { ssr: true });
const SectionLocationAndMap = dynamic(() => import('./Templates/SectionLocationAndMap'), { ssr: true });
const HeaderContact = dynamic(() => import('./Templates/HeaderContact'), { ssr: true });
const HeaderWithForm = dynamic(() => import('./Templates/HeaderWithForm'), { ssr: true });
const Section50x50Form = dynamic(() => import('./Templates/Section50x50Form'), { ssr: true });
const SectionCenteredForm = dynamic(() => import('./Templates/SectionCenteredForm'), { ssr: true });
const SectionProcess = dynamic(() => import('./Templates/SectionProcess'), { ssr: true });
const SectionLogoGrid = dynamic(() => import('./Templates/SectionLogoGrid'), { ssr: true });
const SectionKnowledgeIframe = dynamic(() => import('./Templates/SectionKnowledgeIframe'), { ssr: true });
const SectionCaseStudyIframe = dynamic(() => import('./Templates/SectionCaseStudyIframe'), { ssr: true });

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

// React.ComponentType, not React.FC: next/dynamic returns a ComponentType, and
// the map is consumed through an `any`-typed local anyway.
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
