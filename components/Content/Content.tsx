import HeaderImageSplit from './Templates/HeaderImageSplit';
import HeaderSimpleText from './Templates/HeaderSimpleText';
import HeaderKnowledgeArticle from './Templates/HeaderKnowledgeArticle';

import Section100 from './Templates/Section100';
import Section50x50 from './Templates/Section50x50';
import Section33x33x33 from './Templates/Section33x33x33';
import Section25x25x25x25 from './Templates/Section25x25x25x25';
import Section50x50Image from './Templates/Section50x50Image';
import SectionBigImage from './Templates/SectionBigImage';
import SectionHeadingAndText from './Templates/SectionHeadingAndText';
import SectionLogoTicker from './Templates/SectionLogoTicker';
import Section50x50ServicesIntro from './Templates/Section50x50ServicesIntro';
import SectionTextAndDoubleImage from './Templates/SectionTextAndDoubleImage';
import SectionFeaturedCaseStudy from './Templates/SectionFeaturedCaseStudy';
import SectionPanningText from './Templates/SectionPanningText';
import SectionTextWithCta from './Templates/SectionTextWithCta';
import SectionVideoCta from './Templates/SectionVideoCta';
import SectionCaseStudyPortraitAndText from './Templates/SectionCaseStudyPortraitAndText';
import SectionCaseStudyLandscapeAndText from './Templates/SectionCaseStudyLandscapeAndText';
import SectionCaseStudyEdgeImageAndText from './Templates/SectionCaseStudyEdgeImageAndText';
import SectionCaseStudyLargeImage from './Templates/SectionCaseStudyLargeImage';
import SectionCaseStudyTripleImage from './Templates/SectionCaseStudyTripleImage';
import SectionCaseStudyDoubleImage from './Templates/SectionCaseStudyDoubleImage';
import SectionCaseStudyTestimonial from './Templates/SectionCaseStudyTestimonial';
import SectionFeaturedCaseStudies from './Templates/SectionFeaturedCaseStudies';
import SectionCaseStudyTwoImages from './Templates/SectionCaseStudyTwoImages';
import SectionCaseStudyImagesSelection from './Templates/SectionCaseStudyImagesSelection';
import SectionCaseStudyBeforeAndAfter from './Templates/SectionCaseStudyBeforeAndAfter';
import SectionLatestKnowledge from './Templates/SectionLatestKnowledge';
import SectionPreFooter from './Templates/SectionPreFooter';
import SectionKnowledgeText from './Templates/SectionKnowledgeText';
import HeaderKnowledgeDownload from './Templates/HeaderKnowledgeDownload';
import SectionKnowledgeFaq from './Templates/SectionKnowledgeFaq';
import SectionKnowledgeTable from './Templates/SectionKnowledgeTable';
import SectionKnowledgeImage from './Templates/SectionKnowledgeImage';
import SectionKnowledgeVideo from './Templates/SectionKnowledgeVideo';
import SectionKnowledgeMap from './Templates/SectionKnowledgeMap';
import SectionKnowledgeStandoutCta from './Templates/SectionKnowledgeStandoutCta';
import SectionKnowledgePanningTextCta from './Templates/SectionKnowledgePanningTextCta';
import SectionFaq from './Templates/SectionFaq';
import SectionStandoutCta from './Templates/SectionStandoutCta';
import SectionStandoutTestimonial from './Templates/SectionStandoutTestimonial';
import SectionStory from './Templates/SectionStory';
import SectionTeamListing from './Templates/SectionTeamListing';
import SectionStandoutFeaturedContent from './Templates/SectionStandoutFeaturedContent';
import SectionLocationAndMap from './Templates/SectionLocationAndMap';
import HeaderContact from './Templates/HeaderContact';
import HeaderWithForm from './Templates/HeaderWithForm';
import Section50x50Form from './Templates/Section50x50Form';
import SectionCenteredForm from './Templates/SectionCenteredForm';
import SectionProcess from './Templates/SectionProcess';
import SectionLogoGrid from './Templates/SectionLogoGrid';
import SectionKnowledgeIframe from './Templates/SectionKnowledgeIframe';
import SectionCaseStudyIframe from './Templates/SectionCaseStudyIframe';

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
