import Link from 'next/link';

import {
  getSectionSettings,
  getContainerSize,
  getButtonConnection,
  getButtonVariant,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import Button from '@/components/Components/Button';
import Testimonial from '@/components/Components/Testimonial';

const SectionCaseStudyTestimonial = ({ data }: { data: any }) => {
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
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <div className={getContainerSize(sectionSettings.containerSize)}>
        <div className='grid gap-12 xl:grid-cols-12 xl:overflow-hidden'>
          <div
            className={`relative z-[1] ${
              data.is_reversed
                ? 'xl:col-[4/13] 3xl:col-[5/13]'
                : 'xl:col-[1/10] 3xl:col-[1/9]'
            }`}
          >
            <Testimonial
              text={data.text}
              author={data.author}
              company={data.company}
              fontSize={data.fontSize}
              animationDisabled
            />
          </div>

          {!!data.btns.length && (
            <div
              className={`flex flex-wrap gap-4 mt-9 xl:mt-0 items-center ${
                data.is_reversed
                  ? 'xl:row-[1/2] xl:col-[1/3] 3xl:col-[1/5]'
                  : 'xl:col-[11/13] 3xl:col-[9/13] justify-end'
              }`}
            >
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
                    animationDisabled
                  ></Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SectionCaseStudyTestimonial;
