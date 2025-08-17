import Link from 'next/link';

import ContentImage from '@/components/Components/ContentImage';
import DecorationLine from '@/components/Components/DecorationLine';
import { CaseStudyLead } from '@/types/case-study';

const HeaderCaseStudy = ({ lead, title }: { lead: CaseStudyLead, title: string }) => {
  return (
    <header className='overflow-hidden py-12 md:py-16 3xl:py-24 bg-lightGrey'>
      <div className='container-extra-large'>
        {title && <div className='text-[18px] xl:text-[20px] mb-4'>
          <Link href='/case-studies'>Case Studies</Link> / <p className='inline text-red'>{title}</p>
        </div>}

        {lead.headline && (
          <h1 className='headline-1'>
            {lead.headline}
          </h1>
        )}

        {(lead.location || lead.size || lead.services) && 
          <div className="relative inline-flex flex-col max-w-[80%] gap-9 mt-16 xl:flex-row xl:gap-12 3xl:max-w-[100%] 3xl:gap-32 3xl:mt-24 pr-6 3xl:pr-32">
            {lead.location && (
              <div>
                <p className='text-[18px] xl:text-[20px]'>Location</p>
                <p className='font-bold text-[20px] xl:text-[24px]'>{lead.location}</p>
              </div>
            )}
            
            {lead.size && (
                <div>
                  <p className='text-[18px] xl:text-[20px]'>Size</p>
                  <p className='font-bold text-[20px] xl:text-[24px]'>{lead.size}</p>
                </div>
            )}

            {lead.services && (
              <div>
                <p className='text-[18px] xl:text-[20px]'>Services Provided</p>
                <p className='font-bold text-[20px] xl:text-[24px]'>{lead.services}</p>
              </div>
            )}

            <DecorationLine direction='right' className='!top-[initial] bottom-[15px] xl:bottom-[18px] animation-drawInRight' />
          </div>
        }
      </div>

      {lead.image_main && 
        <div className="container-fluid-left mt-16 3xl:mt-24">
          <div className='relative w-full pb-[50%]'>
            <ContentImage
              className='absolute w-full h-full object-cover'
              sizes='100vw'
              id={lead.image_main}
            />
          </div>
        </div>
      }
    </header>
  );
};

export default HeaderCaseStudy;
