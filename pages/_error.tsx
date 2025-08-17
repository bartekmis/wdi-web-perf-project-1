import Button from '@/components/Components/Button';
import Decoration from '@/components/Components/Decoration';
import SectionPreFooter from '@/components/Content/Templates/SectionPreFooter';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineClose } from 'react-icons/md';

function Error({ statusCode }: any) {
  const preFooterData = {
    section_background_colour: 2,
    section_padding_top: 2,
    section_padding_bottom: 2,
    section_container_size: 3,
    section_font_size: 0,
    section_text_alignment: 0,
    text: 'We love working with clients to design and build amazing new workspaces.',
    btns: [
      {
        url: '/contact',
        title: 'Book a consultation',
        style: 'primary-yellow',
        connection: 0,
      }
    ],
  };

  return (
    <>
      <header className='relative min-h-[100vh] w-full'>
        <figure className='absolute w-full h-full left-0 top-0'>
          <Image
            className='absolute w-full h-full object-cover'
            src='/error.png'
            width={1920}
            height={1080}
            alt='Background image'
            priority
          />
        </figure>

        <div className='w-full h-full min-h-[inherit] flex items-end p-6 3xl:p-16'>
          <div className='flex flex-col md:flex-row'>
            <div className='overflow-hidden mb-9 md:mb-0 md:mr-9 xl:mr-24 3xl:mr-32 relative bg-yellow p-9 3xl:py-20 3xl:px-32 rounded-r-[48px] md:rounded-r-[120px] 3xl:rounded-r-[240px] z-[1]'>
              <p className='absolute top-1/2 left-0 translate-y-[-50%] font-medium text-[180px] md:text-[320px] 3xl:text-[480px] text-black opacity-5'>
                {statusCode}
              </p>
              <Decoration
                colour={1}
                type={2}
                className='w-[60%] pb-[60%] right-[-10%] opacity-25 top-1/2 translate-y-[-50%]'
                variant='custom'
              />

              <h1 className='relative headline-display w-3/4'>
                <span>{statusCode}</span>
                <MdOutlineClose className='absolute right-0 top-1/2 translate-y-[-50%] text-redSecondary text-[24px] md:text-[32px]' />
              </h1>
              <p className='headline-1 mt-3 md:mt-0'>
                {statusCode === 404 ? 'Page not found' : 'An error occured'}
              </p>
              <p className='headline-4 mt-6 md:mt-12 md:w-3/4'>
                {statusCode === 404
                  ? 'Sorry, we couldn’t find the page you’re looking for.'
                  : 'Please try again later.'}
              </p>
            </div>

            <Button
              component={Link}
              href='/'
              variant='primary-black'
              connection='left'
              text='Back to homepage'
            />
          </div>
        </div>
      </header>

      <SectionPreFooter data={preFooterData} />
    </>
  );
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
