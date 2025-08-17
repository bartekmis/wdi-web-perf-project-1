import { useEffect, useState } from 'react';

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let followInterval: any;
    let mouseX = 0;
    let mouseY = 0;
    let xp = 0;
    let yp = 0;

    const startFollow = () => {
      followInterval = setInterval(() => {
        // change number to alter damping, higher is slower
        xp += (mouseX - xp) / 15;
        yp += (mouseY - yp) / 15;

        setMousePosition({ x: xp, y: yp });
      }, 10);
    };

    const mouseMoveHandler = (event: any) => {
      const { clientX, clientY } = event;

      mouseX = clientX;
      mouseY = clientY;
    };

    window.addEventListener('mousemove', mouseMoveHandler, true);
    startFollow();

    return () => {
      clearInterval(followInterval);
      document.removeEventListener('mousemove', mouseMoveHandler, true);
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;
