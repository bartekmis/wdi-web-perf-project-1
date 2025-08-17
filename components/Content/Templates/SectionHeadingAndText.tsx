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

const SectionHeadingAndText = ({ data }: { data: any }) => {
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

      <div className={`${getContainerSize(sectionSettings.containerSize)}`}>
        <div className='grid md:grid-cols-2 gap-12'>
          <div>
            {data.headline && (
              <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} animation-fadeIn`}>
                {data.headline}
              </Headline>
            )}

            {!!data.btns.length && (
              <div className='flex flex-wrap gap-4 mt-12 md:mt-20'>
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

          {data.text && (
            <div
              className='content animation-fadeIn'
              dangerouslySetInnerHTML={{ __html: data.text }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default SectionHeadingAndText;
