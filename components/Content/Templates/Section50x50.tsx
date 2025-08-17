import Button from '@/components/Components/Button';
import Decoration from '@/components/Components/Decoration';
import Headline from '@/components/Components/Headline';
import {
  getButtonConnection,
  getButtonVariant,
  getContainerSize,
  getHeadlineSize,
  getSectionSettings,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import Link from 'next/link';

const Section50x50 = ({ data }: { data: any }) => {
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
      <Decoration
        type={data.decoration_type}
        colour={data.decoration_colour}
        position={data.decoration_position}
        animate
      />

      <div className={getContainerSize(sectionSettings.containerSize)}>
        {data.headline && (
          <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size) || 'headline-2'} mb-12 animation-fadeIn`}>
            {data.headline}
          </Headline>
        )}

        <div className='content grid gap-20 lg:grid-cols-2'>
          {data.column1_text && (
            <div className='flex flex-col'>
              <div
                className='content animation-fadeIn'
                dangerouslySetInnerHTML={{ __html: data.column1_text }}
              />

              {!!data.column1_btns?.length && (
                <div className='flex flex-wrap gap-4 mt-6 lg:mt-9'>
                  {data.column1_btns.map((btn: any, index: number) => {
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
          )}

          {data.column2_text && (
            <div className='flex flex-col'>
              <div
                className='content animation-fadeIn'
                dangerouslySetInnerHTML={{ __html: data.column2_text }}
              />

              {!!data.column2_btns?.length && (
                <div className='flex flex-wrap gap-4 mt-6 lg:mt-9'>
                  {data.column2_btns.map((btn: any, index: number) => {
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
          )}
        </div>
      </div>
    </section>
  );
};

export default Section50x50;
