import Decoration from '@/components/Components/Decoration';
import GravityForm from '@/components/Components/GravityForms/GravityForm';
import Headline from '@/components/Components/Headline';
import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
} from '@/lib/theme-utils';
import { FormSettings, SectionSettings } from '@/types/theme';

const Section50x50Form = ({ data }: { data: any }) => {
  const sectionSettings: SectionSettings = {
    bgColour: data.section_background_colour,
    paddingTop: data.section_padding_top,
    paddingBottom: data.section_padding_bottom,
    containerSize: data.section_container_size,
    fontSize: data.section_font_size,
    textAlignment: data.section_text_alignment,
  };

  const formSettings: FormSettings = {
    id: data.gravity_form_id,
    bgColour: data.gravity_form_bg_colour,
    btnColour: data.gravity_form_btn_colour,
    title: data.gravity_form_title,
    title_size: data.gravity_form_title_size,
    title_tag: data.gravity_form_title_tag,
    description: data.gravity_form_description,
    footer: data.gravity_form_footer,
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
      <div className='animation-expandInSibling' aria-hidden='true'></div>
      <Decoration
        type={1}
        colour={0}
        variant='custom'
        className={`w-[45%] pb-[45%] xl:w-[21%] xl:pb-[21%] left-0 translate-x-[-50%] ${
          data.decoration_position === 0
            ? 'top-0 translate-y-[-50%] origin-top-left'
            : 'bottom-0 translate-y-[50%] origin-bottom-left'
        }`}
      />

      <div className='animation-expandInSibling' aria-hidden='true'></div>
      <Decoration
        type={1}
        colour={0}
        variant='custom'
        className={`w-[10%] pb-[10%] left-[30%] ${
          data.decoration_position === 0
            ? 'bottom-0 translate-y-[50%] origin-bottom'
            : 'top-0 translate-y-[-50%] origin-top'
        }`}
      />

      <div className={getContainerSize(sectionSettings.containerSize)}>
        <div className='grid xl:grid-cols-2 gap-16 xl:gap-24 3xl:gap-32 items-center'>
          <div className='flex flex-col justify-center'>
            {data.headline && (
              <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} animation-fadeIn`}>
                {data.headline}
              </Headline>
            )}

            {data.text && (
              <div
                className='content mt-6 xl:mt-9 animation-fadeIn'
                dangerouslySetInnerHTML={{ __html: data.text }}
              ></div>
            )}
          </div>

          {data.gravity_form_id && (
            <div className='relative'>
              <Decoration
                type={2}
                colour={3}
                variant='custom'
                className='w-[40%] pb-[40%] left-0 top-1/2 translate-y-[-50%] translate-x-[-50%] animation-fadeIn'
              />

              <GravityForm settings={formSettings} animationClass='animation-fadeIn'/>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Section50x50Form;
