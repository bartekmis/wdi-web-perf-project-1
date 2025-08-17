import { CSSProperties, useEffect, useRef, useState } from 'react';

type DecorationLineDirection = 'left' | 'right';

const DecorationLine = ({
  direction,
  className,
  bgClassName = 'bg-black',
}: {
  direction: DecorationLineDirection;
  className?: string;
  bgClassName?: string;
}) => {
  const internalRef = useRef<any>();
  const [positionLeft, setPositionLeft] = useState(0);
  const [positionRight, setPositionRight] = useState(0);

  useEffect(() => {
    const handlePosition = () => {
      const { left, right } = internalRef.current?.getBoundingClientRect();
      setPositionLeft(Math.ceil(left));
      setPositionRight(Math.floor(document.body.clientWidth - right));
    };

    handlePosition();
    window.addEventListener('resize', handlePosition, true);

    return () => {
      window.removeEventListener('resize', handlePosition, true);
    };
  }, []);

  const getLineStyles = () => {
    let styles: CSSProperties = {};

    if (direction === 'right') {
      styles = {
        width: `${positionRight}px`,
      };
    } else {
      styles = {
        width: `${positionLeft}px`,
        right: '100%',
      };
    }

    return styles;
  };

  return (
    <div
      ref={internalRef}
      className={`${className || ''} absolute h-[1px] w-[1px] top-1/2 ${
        direction === 'right' ? 'left-full' : 'right-full'
      }`}
    >
      <div
        className={`${bgClassName} absolute h-full`}
        style={getLineStyles()}
      ></div>
    </div>
  );
};

export default DecorationLine;
