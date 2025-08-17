import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const useAnimationOnScroll = () => {
  const pathname = usePathname();

  useEffect(() => {
    const animationClassTable = [
      'animation-fadeIn',
      'animation-fadeInSibling',
      'animation-slideInLeft',
      'animation-slideInLeftSibling',
      'animation-slideInRight',
      'animation-drawInLeft',
      'animation-drawInRight',
      'animation-expandIn',
      'animation-expandInSibling',
      'animation-swipeRight',
      'animation-revealFromCircle',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !entry.target.classList.contains('animated')
          ) {
            entry.target.classList.add('animated');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );

    animationClassTable.forEach((className) => {
      const targets: HTMLElement[] = Array.from(document.querySelectorAll(`.${className}`));

      targets.forEach((target) => {
        observer.observe(target);
      });
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);
};

export default useAnimationOnScroll;
