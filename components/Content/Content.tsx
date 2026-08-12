import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';

/**
 * CHANGED 2026-08-12: every template below used to be a static `import` at the
 * top of this file - all 54 of them, on every page.
 *
 * This file is the single entry point for page content, so whatever it imports
 * lands in the shared bundle that every route pays for. The homepage renders
 * exactly 10 templates; it was downloading, parsing and evaluating all 54,
 * dragging in gsap, curtainsjs (WebGL), swiper, @react-google-maps/api,
 * react-youtube and the Gravity Forms field set along the way - none of which
 * the homepage uses.
 *
 * `next/dynamic` with the default `ssr: true` keeps the server-rendered HTML
 * byte-for-byte identical (so the hero image is still discoverable in the
 * initial document and LCP is unaffected) while giving each template its own
 * chunk. Next's loadable manifest only preloads the chunks a given page
 * actually renders, so a page now ships the templates it uses and nothing else.
 *
 * Keep these as `dynamic(...)`. Converting one back to a static import quietly
 * re-adds it - and its whole dependency tree - to every route in the site.
 */

type ContentTemplate = ComponentType<any>;

type ContentTemplates = {
  [key: string]: ContentTemplate;
};

const headerTemplates: ContentTemplates = {
  'header-simple-text': dynamic(() => import('./Templates/HeaderSimpleText')),
  'header-image-split': dynamic(() => import('./Templates/HeaderImageSplit')),
  'header-contact': dynamic(() => import('./Templates/HeaderContact')),
  'header-with-form': dynamic(() => import('./Templates/HeaderWithForm')),
  'header-knowledge-article': dynamic(
    () => import('./Templates/HeaderKnowledgeArticle')
  ),
  'header-knowledge-download': dynamic(
    () => import('./Templates/HeaderKnowledgeDownload')
  ),
};

const sectionTemplates: ContentTemplates = {
  'section-100': dynamic(() => import('./Templates/Section100')),
  'section-50-50': dynamic(() => import('./Templates/Section50x50')),
  'section-33-33-33': dynamic(() => import('./Templates/Section33x33x33')),
  'section-25-25-25-25': dynamic(
    () => import('./Templates/Section25x25x25x25')
  ),
  'section-50-50-image': dynamic(() => import('./Templates/Section50x50Image')),
  'section-50-50-services-intro': dynamic(
    () => import('./Templates/Section50x50ServicesIntro')
  ),
  'section-50-50-form': dynamic(() => import('./Templates/Section50x50Form')),
  'section-centered-form': dynamic(
    () => import('./Templates/SectionCenteredForm')
  ),
  'section-big-image': dynamic(() => import('./Templates/SectionBigImage')),
  'section-heading-and-text': dynamic(
    () => import('./Templates/SectionHeadingAndText')
  ),
  'section-logo-ticker': dynamic(() => import('./Templates/SectionLogoTicker')),
  'section-text-and-double-image': dynamic(
    () => import('./Templates/SectionTextAndDoubleImage')
  ),
  'section-panning-text': dynamic(
    () => import('./Templates/SectionPanningText')
  ),
  'section-text-with-cta': dynamic(
    () => import('./Templates/SectionTextWithCta')
  ),
  'section-video-cta': dynamic(() => import('./Templates/SectionVideoCta')),
  'section-pre-footer': dynamic(() => import('./Templates/SectionPreFooter')),
  'section-featured-case-study': dynamic(
    () => import('./Templates/SectionFeaturedCaseStudy')
  ),
  'section-faq': dynamic(() => import('./Templates/SectionFaq')),
  'section-standout-cta': dynamic(
    () => import('./Templates/SectionStandoutCta')
  ),
  'section-standout-testimonial': dynamic(
    () => import('./Templates/SectionStandoutTestimonial')
  ),
  'section-story': dynamic(() => import('./Templates/SectionStory')),
  'section-team-listing': dynamic(
    () => import('./Templates/SectionTeamListing')
  ),
  'section-standout-featured-content': dynamic(
    () => import('./Templates/SectionStandoutFeaturedContent')
  ),
  'section-location-and-map': dynamic(
    () => import('./Templates/SectionLocationAndMap')
  ),
  'section-process': dynamic(() => import('./Templates/SectionProcess')),
  'section-logo-grid': dynamic(() => import('./Templates/SectionLogoGrid')),

  'section-case-study-portrait-and-text': dynamic(
    () => import('./Templates/SectionCaseStudyPortraitAndText')
  ),
  'section-case-study-landscape-and-text': dynamic(
    () => import('./Templates/SectionCaseStudyLandscapeAndText')
  ),
  'section-case-study-images-selection': dynamic(
    () => import('./Templates/SectionCaseStudyImagesSelection')
  ),
  'section-case-study-edge-image-and-text': dynamic(
    () => import('./Templates/SectionCaseStudyEdgeImageAndText')
  ),
  'section-case-study-large-image': dynamic(
    () => import('./Templates/SectionCaseStudyLargeImage')
  ),
  'section-case-study-triple-image': dynamic(
    () => import('./Templates/SectionCaseStudyTripleImage')
  ),
  'section-case-study-double-image': dynamic(
    () => import('./Templates/SectionCaseStudyDoubleImage')
  ),
  'section-case-study-two-images': dynamic(
    () => import('./Templates/SectionCaseStudyTwoImages')
  ),
  'section-case-study-testimonial': dynamic(
    () => import('./Templates/SectionCaseStudyTestimonial')
  ),
  'section-case-study-before-and-after': dynamic(
    () => import('./Templates/SectionCaseStudyBeforeAndAfter')
  ),
  'section-featured-case-studies': dynamic(
    () => import('./Templates/SectionFeaturedCaseStudies')
  ),
  'section-case-study-iframe': dynamic(
    () => import('./Templates/SectionCaseStudyIframe')
  ),

  'section-latest-knowledge': dynamic(
    () => import('./Templates/SectionLatestKnowledge')
  ),
  'section-knowledge-text': dynamic(
    () => import('./Templates/SectionKnowledgeText')
  ),
  'section-knowledge-faq': dynamic(
    () => import('./Templates/SectionKnowledgeFaq')
  ),
  'section-knowledge-table': dynamic(
    () => import('./Templates/SectionKnowledgeTable')
  ),
  'section-knowledge-image': dynamic(
    () => import('./Templates/SectionKnowledgeImage')
  ),
  'section-knowledge-video': dynamic(
    () => import('./Templates/SectionKnowledgeVideo')
  ),
  'section-knowledge-map': dynamic(
    () => import('./Templates/SectionKnowledgeMap')
  ),
  'section-knowledge-standout-cta': dynamic(
    () => import('./Templates/SectionKnowledgeStandoutCta')
  ),
  'section-knowledge-panning-text-cta': dynamic(
    () => import('./Templates/SectionKnowledgePanningTextCta')
  ),
  'section-knowledge-iframe': dynamic(
    () => import('./Templates/SectionKnowledgeIframe')
  ),
};

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

export default function Content({ data, details }: Props) {
  return (
    <>
      {data.content_header &&
        data.content_header.map((header) => {
          const HeaderTemplate = headerTemplates[header._type];
          if (!HeaderTemplate) {
            return null;
          }
          return (
            <HeaderTemplate key='header' data={header} details={details} />
          );
        })}

      {data.content_sections &&
        data.content_sections.map((section, index) => {
          const SectionTemplate = sectionTemplates[section._type];
          if (!SectionTemplate) {
            return null;
          }
          return <SectionTemplate key={index + 1} data={section} />;
        })}
    </>
  );
}
