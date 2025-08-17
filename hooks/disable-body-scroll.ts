import { useEffect } from 'react';

const useDisableBodyScroll = (isOpen: boolean) => {
  useEffect(() => {
    isOpen
      ? document.body.classList.add('stop-scrolling')
      : document.body.classList.remove('stop-scrolling');
  }, [isOpen]);
};

export default useDisableBodyScroll;