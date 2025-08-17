import Decoration from '@/components/Components/Decoration';
import GravityForm from '@/components/Components/GravityForms/GravityForm';
import Headline from '@/components/Components/Headline';
import {
  getSectionSettings,
  getContainerSize,
  getHeadlineSize,
} from '@/lib/theme-utils';
import { FormSettings, SectionSettings } from '@/types/theme';

const SectionCenteredForm = ({ data }: { data: any }) => {
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
      {data.decoration_type === 1 && <div className='animation-expandInSibling'></div>}
      <Decoration
        type={data.decoration_type}
        colour={data.decoration_type === 1 ? 0 : 3}
        variant='custom'
        className={`w-[45%] pb-[45%] xl:w-[20%] xl:pb-[20%] left-0 top-1/2 translate-y-[-50%] ${
          data.decoration_type === 1 ? 'translate-x-[-50%] origin-top-left' : 'animation-fadeIn'
        }`}
      />

      {data.decoration_type === 1 && <div className='animation-expandInSibling'></div>}
      <Decoration
        type={data.decoration_type}
        colour={data.decoration_type === 1 ? 0 : 3}
        variant='custom'
        className={`w-[45%] pb-[45%] xl:w-[20%] xl:pb-[20%] right-0 top-1/2 translate-y-[-50%] ${
          data.decoration_type === 1 ? 'translate-x-[50%] origin-top-right' : 'animation-fadeIn'
        }`}
      />

      <div className={getContainerSize(sectionSettings.containerSize)}>
        {data.headline && (
          <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} text-center animation-fadeIn`}>
            {data.headline}
          </Headline>
        )}

        {data.gravity_form_id && (
          <div className='mt-12'>
            <GravityForm settings={formSettings} animationClass='animation-fadeIn' />
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionCenteredForm;
