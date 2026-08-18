import Link from 'next/link';

import Button from '@/components/Components/Button';
import {
  getSectionSettings,
  getContainerSize,
  getButtonVariant,
  getButtonConnection,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import Decoration from '@/components/Components/Decoration';

const Section100 = ({ data }: { data: any }) => {
  const sectionSettings: SectionSettings = {
    bgColour: data.section_background_colour,
    paddingTop: data.section_padding_top,
    paddingBottom: data.section_padding_bottom,
    containerSize: data.section_container_size,
    fontSize: data.section_font_size,
    textAlignment: data.section_text_alignment,
  };

  const getColumnSize = () => {
    if (data.is_fullwidth) {
      return 'lg:col-[1/13]';
    }

    if (data.alignment === 1 && sectionSettings.containerSize >= 3) {
      return 'lg:col-[7/13]';
    }

    if (data.alignment === 1 && sectionSettings.containerSize < 3) {
      return 'lg:col-[6/12]';
    }
    
    if (data.alignment === 2) {
      return 'lg:col-[4/10]';
    }

    return 'lg:col-[1/7]';
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
      <Decoration
        type={data.decoration_type}
        colour={data.decoration_colour}
        position={data.decoration_position}
        animate
      />

      <div className={getContainerSize(sectionSettings.containerSize)}>
        <div className='lg:grid lg:grid-cols-12'>
          <div className={getColumnSize()}>
            <div className='animation-fadeInSibling' aria-hidden='true'></div>
            {data.text && (
              <div
                className='content'
                dangerouslySetInnerHTML={{ __html: data.text }}
              />
            )}

            {!!data.btns?.length && (
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

export default Section100;
