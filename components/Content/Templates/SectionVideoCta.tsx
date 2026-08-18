import Link from 'next/link';

import {
  getSectionSettings,
  getContainerSize,
  getButtonVariant,
  getButtonConnection,
  getHeadlineSize,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import Button from '@/components/Components/Button';
import VideoPlayer from '@/components/Components/VideoPlayer';
import Headline from '@/components/Components/Headline';

const SectionVideoCta = ({ data }: { data: any }) => {
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
        {data.headline && (
          <Headline type={data.headline_tag} className={`${getHeadlineSize(data.headline_size)} animation-fadeIn mb-12`}>
            {data.headline}
          </Headline>
        )}

        <div className='group relative'>
          {data.video_id && (
            <div className={`overflow-hidden rounded-[12px] xl:rounded-[30px] ${!data.is_autoplay ? 'xl:shadow-[0_0_0_0_var(--yellow)] xl:group-hover:shadow-[0_0_0_5px_var(--yellow)] xl:transition xl:duration-500' : ''}`}>
              <VideoPlayer id={data.video_id} autoplay={data.is_autoplay} poster={data.poster} />
            </div>
          )}

          {data.is_autoplay && 
            <div className='mt-6 md:mt-9 xl:mt-0 xl:absolute xl:top-0 xl:left-0 xl:w-full xl:h-full xl:opacity-0 xl:transition xl:duration-500 xl:group-hover:opacity-100'>
              {!!data.btns?.length && (
                <div className='flex flex-wrap justify-end gap-4 xl:absolute xl:top-1/2 xl:left-1/2 xl:translate-y-[-50%] xl:translate-x-[-50%]'>
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
          }
        </div>
      </div>
    </section>
  );
};

export default SectionVideoCta;
