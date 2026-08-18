import { CSSProperties, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { getBgColour, getHeadlineSize, getTextColour } from '@/lib/theme-utils';
import styles from '@/styles/components/panning-text-cta.module.scss';

export type PanningTextCtaData = {
  text: string;
  size: number;
  bgColour: number;
  bgColourHover: number;
  url: string;
  duration: string;
  textColour: number;
  textColourHover: number;
};

const PanningTextCta = ({ data }: { data: PanningTextCtaData }) => {
  const textRef = useRef<any>();
  const [textStyle, setTextStyle] = useState({});
  const durationStyle = { '--ad': data.duration || '12s' } as CSSProperties;

  useEffect(() => {
    const style = {
      '--tw': `${textRef.current.offsetWidth + 24}px`,
    } as CSSProperties;
    setTextStyle(style);
  }, []);

  return (
    <Link
      href={data.url}
      title={data.text}
      className={`group ${styles['panning-text-cta']} ${getBgColour(
        data.bgColour
      )} ${getHeadlineSize(
        data.size
      )} rounded-r-[150px] transition duration-300 hover:${getBgColour(
        data.bgColourHover
      )}`}
      style={{ ...textStyle, ...durationStyle }}
    >
      <span
        ref={textRef}
        className={`${getTextColour(
          data.textColour
        )} group-hover:${getTextColour(
          data.textColourHover
        )} transition duration-300`}
      >
        {data.text}
      </span>
    </Link>
  );
};

export default PanningTextCta;
