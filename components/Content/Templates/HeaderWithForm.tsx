import Decoration from '@/components/Components/Decoration';
import GravityForm from '@/components/Components/GravityForms/GravityForm';
import { FormSettings } from '@/types/theme';

const HeaderWithForm = ({ data }: any) => {
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
    <header
      id={data.id}
      className='relative py-16 md:py-36 overflow-hidden bg-black'
    >
      <Decoration
        type={2}
        colour={0}
        position={data.is_decoration_reversed ? 2 : 3}
        variant='custom'
        className={`w-[35%] pb-[35%] xl:w-[17%] xl:pb-[17%] translate-x-[-24px] translate-y-[24px] animation-fadeIn mobile-no-animation ${
          data.is_decoration_reversed
            ? '!translate-x-[-50%] !translate-y-[50%]'
            : ''
        }`}
      />

      <div className='absolute bottom-0 left-0 animation-expandInSibling mobile-no-animation' aria-hidden='true'></div>
      <Decoration
        type={1}
        colour={0}
        position={data.is_decoration_reversed ? 3 : 2}
        variant='custom'
        className='w-[35%] pb-[35%] xl:w-[17%] xl:pb-[17%] origin-bottom-left'
      />

      <div className='container-large'>
        <div className='grid xl:grid-cols-2 gap-16 xl:gap-24 3xl:gap-32 items-center'>
          <div className='flex flex-col justify-center'>
            {data.headline && (
              <h1 className='headline-1 animation-fadeIn mobile-no-animation'>{data.headline}</h1>
            )}
            {data.text && (
              <div
                className='content mt-9 xl:mt-12 animation-fadeIn mobile-no-animation'
                dangerouslySetInnerHTML={{ __html: data.text }}
              ></div>
            )}
          </div>

          {data.gravity_form_id && (
            <GravityForm
              settings={formSettings}
              animationClass='animation-fadeIn mobile-no-animation'
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderWithForm;
