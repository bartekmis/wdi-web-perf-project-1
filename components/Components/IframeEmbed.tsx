import { ReactNode, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const IframeEmbed = ({
  url,
  children,
  className,
}: {
  url?: string;
  children?: ReactNode,
  className?: string;
}) => {
  const lockRef = useRef(false);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  if (inView) {
    lockRef.current = true;
  }

  return (
    <div ref={ref} className={`relative w-full ${className || ''}`}>
      {lockRef.current && url && (
        <iframe className='w-full' src={url} scrolling='no'></iframe>
      )}

      {lockRef.current && !url && (
        children
      )}
    </div>
  );
};

export default IframeEmbed;
