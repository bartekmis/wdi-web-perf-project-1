import Button from '@/components/Components/Button';
import DecorationLine from '@/components/Components/DecorationLine';
import {
  getSectionSettings,
  getContainerSize,
  getButtonVariant,
  getButtonConnection,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import Link from 'next/link';

const SectionTextWithCta = ({ data }: { data: any }) => {
  const sectionSettings: SectionSettings = {
    bgColour: data.section_background_colour,
    paddingTop: data.section_padding_top,
    paddingBottom: data.section_padding_bottom,
    containerSize: data.section_container_size,
    fontSize: data.section_font_size,
    textAlignment: data.section_text_alignment,
  };

  return (
    <section
      id={data.id}
      className={`
        section
        overflow-hidden
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <div className={getContainerSize(sectionSettings.containerSize)}>
        <div className={`grid gap-9 md:grid-cols-2 md:gap-12 xl:grid-cols-12 ${data.is_reversed ? 'pr-9 md:pr-0': 'pl-9 md:pl-0'}` }>
          {data.text && (
            <div
              className={`relative content ${
                data.is_reversed
                  ? 'md:row-[1/2] md:col-[2/3] xl:col-[7/13] 3xl:col-[6/13]'
                  : 'xl:col-[1/7] 3xl:col-[1/8]'
              }`}
            >
              {!data.is_reversed && (
                <>
                  <DecorationLine
                    direction='left'
                    className='top-4 3xl:top-6 !right-[calc(100%+18px)] md:!right-[calc(100%+24px)] animation-drawInLeft'
                  />
                  <div className='text-large animation-fadeIn' dangerouslySetInnerHTML={{ __html: data.text }}></div>
                </>
              )}

              {data.is_reversed && (
                <>
                  <div className='text-large animation-fadeIn' dangerouslySetInnerHTML={{ __html: data.text }}></div>
                  <DecorationLine
                    direction='right'
                    className='top-4 3xl:top-6 !left-[calc(100%+18px)] md:!right-[calc(100%+24px)] animation-drawInRight'
                  />
                </>
              )}
            </div>
          )}

          <div
            className={`flex flex-col gap-6 md:gap-9 3xl:gap-12 ${
              data.is_reversed
                ? 'md:row-[1/2] md:col-[1/2] xl:col-[1/6] 3xl:col-[1/5]'
                : 'xl:col-[8/13] xl:col-[9/13]'
            }  ${!data.feature_text ? 'justify-center' : ''}`}
          >
            {data.feature_text && (
              <div className='flex flex-col'>
                <p className='font-medium text-[20px] 3xl:text-[24px] animation-fadeIn'>
                  {data.feature_text}
                </p>
                {(data.feature_figure_1 || data.feature_figure_2) && (
                  <div className='flex items-center text-red mt-2 md:mt-3 animation-fadeIn'>
                    {data.feature_figure_1 && (
                      <p className='headline-1'>{data.feature_figure_1}</p>
                    )}
                    {data.feature_figure_2 && (
                      <>
                        <span className='flex-1 bg-red mx-3 max-w-[40px] h-[4px] 3xl:mx-6 3xl:h-[7px]'></span>
                        <p className='headline-1'>{data.feature_figure_2}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {!!data.btns.length && (
              <div className='flex flex-wrap gap-4'>
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
                    ></Button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionTextWithCta;
