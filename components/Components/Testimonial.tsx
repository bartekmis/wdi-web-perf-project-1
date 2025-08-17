import { RiDoubleQuotesL } from 'react-icons/ri';
import { getFontSize } from '@/lib/theme-utils';

const Testimonial = ({
  text,
  author,
  company,
  fontSize,
  className,
  isReversed = false,
  animationDisabled = false,
}: {
  text: string;
  author?: string;
  company?: string;
  fontSize?: number;
  className?: string;
  isReversed?: boolean;
  animationDisabled?: boolean;
}) => {
  return (
    <div
      className={`${
        className || ''
      } bg-yellow p-4.5 flex flex-col gap-2 md:flex-row md:gap-6 md:p-12 3xl:p-16 ${
        !animationDisabled ? 'animation-fadeIn' : ''
      } ${
        isReversed
          ? 'rounded-l-[96px] md:rounded-l-[192px] pl-16 md:pl-20 3xl:pl-32'
          : 'rounded-r-[96px] md:rounded-r-[192px] pr-16 md:pr-20 3xl:pr-32'
      }`}
    >
      {(author || company) && (
        <RiDoubleQuotesL className='text-[24px] md:text-[36px] xl:text-[48px]' />
      )}

      <div className='flex-1'>
        {text && (
          <div className='content'>
            <p
              className={`!font-medium ${
                fontSize ? getFontSize(fontSize) : ''
              }`}
            >
              {text}
            </p>
          </div>
        )}

        {author && (
          <p className='leading-none font-medium text-[16px] mt-4.5 md:mt-9 md:text-[18px] xl:text-[20px] xl:mt-12'>
            {author}
          </p>
        )}

        {company && (
          <p className='leading-none text-[16px] mt-2 md:text-[18px] xl:text-[20px]'>
            {company}
          </p>
        )}
      </div>
    </div>
  );
};

export default Testimonial;
