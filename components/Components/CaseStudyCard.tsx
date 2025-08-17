import Link from 'next/link';

import { CaseStudy } from '@/types/case-study';
import ContentImage from './ContentImage';
import { useInView } from 'react-intersection-observer';

const CaseStudyCard = ({ caseStudy }: { caseStudy: CaseStudy }) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <Link
      ref={ref}
      href={`/case-studies/${caseStudy.slug}`}
      title={caseStudy?.lead.company ? caseStudy.lead.company : ''}
      key={caseStudy.id}
      className='group flex flex-col'
    >
      <figure
        className={`relative w-full pb-[56.25%] overflow-hidden animation-revealFromCircle ${
          inView ? 'animated' : ''
        }`}
      >
        <ContentImage
          className='absolute w-full h-full object-cover'
          sizes="(max-width: 767px) 100vw, 50vw"
          id={caseStudy.lead.image_main}
        />
        {caseStudy.lead.logo?.id && (
          <div className='absolute top-1/2 translate-y-[-50%]'>
            <div
              className={`bg-white rounded-r-[192px] p-4 md:p-6 md:pr-9 animation-slideInLeft ${
                inView ? 'animated' : ''
              }`}
            >
              <ContentImage
                className='w-auto max-w-[144px] h-[36px] md:h-[48px] object-contain'
                id={caseStudy.lead.logo.id}
                width={+caseStudy.lead.logo.width}
                height={+caseStudy.lead.logo.height}
              />
            </div>
          </div>
        )}
      </figure>
      {caseStudy.title && (
        <p className='headline-3 mt-4 md:mt-6 underline decoration-transparent group-hover:decoration-black transition duration-300'>
          {caseStudy.title}
        </p>
      )}
      {caseStudy.lead.location && (
        <p className='md:text-[18px]'>{caseStudy.lead.location}</p>
      )}
    </Link>
  );
};

export default CaseStudyCard;
