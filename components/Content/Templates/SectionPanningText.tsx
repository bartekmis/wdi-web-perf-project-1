import { CSSProperties, useEffect, useRef, useState } from 'react';

import {
  getHeadlineSize,
  getSectionSettings,
  getTextColour,
} from '@/lib/theme-utils';
import { SectionSettings } from '@/types/theme';
import styles from '@/styles/sections/section-panning-text.module.scss';
import Headline from '@/components/Components/Headline';

const SectionPanningText = ({ data }: { data: any }) => {
  const sectionSettings: SectionSettings = {
    bgColour: data.section_background_colour,
    paddingTop: data.section_padding_top,
    paddingBottom: data.section_padding_bottom,
    containerSize: data.section_container_size,
    fontSize: data.section_font_size,
    textAlignment: data.section_text_alignment,
  };

  const textRef = useRef<any>(null);
  const [textStyle, setTextStyle] = useState({});
  const durationStyle = { '--ad': data.duration || '12s' } as CSSProperties;

  useEffect(() => {
    const style = {
      '--tw': `${textRef.current.offsetWidth + 24}px`,
    } as CSSProperties;
    setTextStyle(style);
  }, []);

  return (
    <section
      id={data.id}
      className={`
        section
        ${getSectionSettings(sectionSettings)}
      `}
    >
      <div className='container-fluid'>
        {data.text && (
          <Headline type={data.text_tag}
            className={`${styles['marquee']} ${getHeadlineSize(
              data.text_size
            )} ${getTextColour(data.text_colour)}`}
            style={{ ...textStyle, ...durationStyle }}
          >
            <span ref={textRef}>{data.text}</span>
          </Headline>
        )}
      </div>
    </section>
  );
};

export default SectionPanningText;
