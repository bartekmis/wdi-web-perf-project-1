// @ts-ignore
import { Curtains } from '../../../node_modules/curtainsjs/src/core/Curtains';
import { CurtainsContext } from '@/contexts/curtains';
import { useContext, useEffect, useRef } from 'react';

const CurtainsCanvas = () => {
  const canvasRef = useRef<any>(null);
  const { setCurtains } = useContext(CurtainsContext);

  useEffect(() => {
    const canvas = canvasRef?.current.querySelector('canvas');

    if (canvas) {
      return;
    }

    const curtains = new Curtains({
      container: canvasRef.current,
      watchScroll: false,
      pixelRatio: Math.min(1.5, window.devicePixelRatio),
    });

    setCurtains(curtains);

    const handleScroll = () => {
      var scrollValues = {
        x: window.scrollX,
        y: window.scrollY,
      };

      curtains.updateScrollValues(scrollValues.x, scrollValues.y);
    };

    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [setCurtains]);

  return (
    <>
      <style jsx global>
        {`
          .curtains-canvas {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 100vh;
            z-index: 1;
            pointer-events: none;
          }
        `}
      </style>
      <div className='curtains-canvas' ref={canvasRef}></div>
    </>
  );
};

// example usage in Layout.tsx:
// import CurtainsCanvas from '../Components/Curtains/CurtainsCanvas';
// import Device from '../Components/Device';

{/* <Device>
  {({ isMobile }) => {
    if (!isMobile) {
      return <CurtainsCanvas />;
    }
  }}
</Device> */} 

export default CurtainsCanvas;
