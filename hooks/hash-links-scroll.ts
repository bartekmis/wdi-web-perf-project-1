import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// https://stackoverflow.com/questions/75490284/nextjs-13-experimental-app-dir-hash-in-routes-not-directing-to-the-hash-id
// Next.js forwards to 404 not found page if hash is used in <Link> component

const useHashLinkScroll = () => {
  const pathname = usePathname();

  useEffect(() => {
    const hashLinks = Array.from(document.querySelectorAll('a[href*="#"]'));

    hashLinks.forEach((link: any) => {
      const { href } = link;
      const hashValue = href.substr(href.indexOf('#'));
      let target: any = null;

      if (hashValue) {
        try {
          target = document.querySelector(hashValue);
        } catch (e) {
          target = null;
        }
      }

      if (target) {
        link.addEventListener('click', (event: Event) => {
          event.preventDefault();

          target.scrollIntoView({ behavior: 'smooth' });
          return false;
        });
      }
    });
  }, [pathname]);
};

export default useHashLinkScroll;
