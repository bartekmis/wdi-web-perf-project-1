import Link from 'next/link';

import ContentImage from '@/components/Components/ContentImage';
import { ContentDetails } from '../Content';
import GravityForm from '@/components/Components/GravityForms/GravityForm';
import { useState } from 'react';
import Button from '@/components/Components/Button';
import { getButtonConnection, getButtonTarget, getButtonVariant } from '@/lib/theme-utils';
import Decoration from '@/components/Components/Decoration';
import { FormSettings } from '@/types/theme';

const HeaderKnowledgeDownload = ({
  data,
  details,
}: {
  data: any;
  details?: ContentDetails;
}) => {
  const formSettings: FormSettings = {
    id: data.gravity_form_id,
    bgColour: data.gravity_form_bg_colour,
    btnColour: data.gravity_form_btn_colour,
    title: data.gravity_form_title,
    title_size: data.gravity_form_title_size,
    title_tag: data.gravity_form_title_tag,
    description: data.gravity_form_description,
    footer: data.gravity_form_footer,
  }

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (isSuccess: boolean) => {
    setIsSuccess(isSuccess);
  };

  return (
    <header className='bg-black overflow-hidden'>
      {data.image && (
        <figure className='relative w-full pb-[40vh]'>
          <ContentImage
            className='absolute w-full h-full object-cover'
            id={data.image}
            sizes='100vw'
            priority
          />
        </figure>
      )}

      <div className='container-large bg-black xl:rounded-tr-[240px] xl:mt-[-150px]'>
        <Decoration type={1} colour={0} variant='custom' className='w-[25%] pb-[25%] md:w-[16%] md:pb-[16%] right-0 top-0  translate-y-[-50%] xl:translate-x-[25%]' />
        
        <div className='grid xl:grid-cols-2 gap-12 3xl:gap-16 p-6 md:p-12 3xl:p-20 items-start'>
          <div className='flex flex-col justify-center xl:p-12 3xl:p-16 self-center'>
            <div className='text-[18px] md:text-[20px]'>
              <Link href='/knowledge' title='Knowledge'>
                Knowledge
              </Link>
              {details?.category.name && details?.category.slug && (
                <Link href={`/knowledge/category/${details.category.slug}`}>
                  {' '}
                  / {details.category.name}
                </Link>
              )}
              {details?.title && (
                <p className='inline'>
                  {' '}
                  / <span className='text-yellow'>{details.title}</span>
                </p>
              )}
            </div>

            {data.headline && (
              <h1 className='headline-2 mt-12'>{data.headline}</h1>
            )}

            {!isSuccess && data.text && (
              <div className='content mt-12'>
                <p>{data.text}</p>
              </div>
            )}

            {isSuccess && !!data.btns?.length && (
              <div className='flex flex-wrap gap-4 mt-12'>
                {data.btns.map((btn: any, index: number) => {
                  return (
                    <Button
                      key={index}
                      component={Link}
                      href={btn.url}
                      title={btn.title}
                      text={btn.title}
                      variant={getButtonVariant(btn.style)}
                      connection={getButtonConnection(btn.connection)}
                      target={getButtonTarget(btn.is_open_in)}
                    ></Button>
                  );
                })}
              </div>
            )}
          </div>
          
          { data.gravity_form_id && <GravityForm settings={formSettings} onSubmit={handleSubmit} /> }
        </div>
      </div>
    </header>
  );
};

export default HeaderKnowledgeDownload;
