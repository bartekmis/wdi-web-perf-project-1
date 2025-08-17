import styles from '@/styles/components/decoration.module.scss';
import { CSSProperties, forwardRef } from 'react';

type DecorationOptions = {
  [key: number]: string;
};
type AnimationOptions = {
  [key: number]: string;
};
type DecorationType = 'circle' | 'dots';
type DecorationColour = 'yellow' | 'black' | 'white' | 'red';
type DecorationPosition =
  | 'top-left'
  | 'middle-left'
  | 'bottom-left'
  | 'top-right'
  | 'middle-right'
  | 'bottom-right';

const decorationTypes: DecorationOptions = {
  0: 'none',
  1: 'circle',
  2: 'dots',
};

const decorationColours: DecorationOptions = {
  0: 'yellow',
  1: 'black',
  2: 'white',
  3: 'red',
};

const decorationPositions: DecorationOptions = {
  0: 'top-left',
  1: 'middle-left',
  2: 'bottom-left',
  3: 'top-right',
  4: 'middle-right',
  5: 'bottom-right',
};

const animationOrigins: AnimationOptions = {
  0: 'origin-top-left',
  1: 'origin-top-left',
  2: 'origin-bottom-left',
  3: 'origin-top-right',
  4: 'origin-top-right',
  5: 'origin-bottom-right',
};

const getDecorationType = (index: number) => {
  return decorationTypes[index] as DecorationType;
};

const getDecorationColour = (index: number) => {
  return decorationColours[index] as DecorationColour;
};

const getDecorationPosition = (index: number) => {
  return decorationPositions[index] as DecorationPosition;
};

const Decoration = forwardRef(function Decoration(
  {
    type,
    colour,
    position,
    variant,
    className,
    style,
    animate = false,
  }: {
    type: number;
    colour: number;
    position?: number;
    variant?: 'image' | 'custom';
    className?: string;
    style?: CSSProperties;
    animate?: boolean;
  },
  ref: any
) {
  if (type === 0) {
    return <></>;
  }

  return (
    <>
      {animate && type === 1 && (
        <div className='animation-expandInSibling' aria-hidden='true'></div>
      )}
      <div
        ref={ref}
        className={`
          ${styles[getDecorationType(type)]}
          ${styles[getDecorationColour(colour)]}
          ${
            position !== undefined
              ? styles[getDecorationPosition(position)]
              : ''
          }
          ${variant !== undefined ? styles[variant] : ''}
          ${animate && type === 2 ? 'animation-fadeIn' : ''}
          ${animate && type === 1 ? animationOrigins[position || 0] : ''}
          ${className || ''}
        `}
        style={style}
      ></div>
    </>
  );
});

export default Decoration;
