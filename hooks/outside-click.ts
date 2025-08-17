import { useEffect, useRef } from 'react';

const useOutsideClick = (callback: () => void) => {
  const ref = useRef<any>();

  useEffect(() => {
    const handleClick = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [ref, callback]);

  return ref;
};

export default useOutsideClick;
