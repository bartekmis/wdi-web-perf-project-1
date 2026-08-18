import { useEffect } from 'react';

import useDetectDevice from './detect-device';

type Gsap = typeof import('gsap')['gsap'];

/**
 * Odpala efekt oparty o gsap + ScrollTrigger TYLKO na desktopie i dopiero po
 * dynamicznym doładowaniu gsap-a.
 *
 * Po co (pomiar Lighthouse 13, mobile, Moto G Power):
 * chunk z gsap-em miał 2516 ms `bootup-time` - najdroższa pojedyncza pozycja
 * na całej stronie. Płaciliśmy to za dekoracje: parallax na siatkach kropek
 * i kółkach, każdy przez `ScrollTrigger` ze `scrub`, czyli praca powiązana ze
 * scrollem w każdej klatce.
 *
 * Szablony i tak już wyłączały pozostałe animacje przez `if (isMobile) return`
 * - tylko efekty parallaxu tego nie robiły i chodziły również na telefonie.
 * Ten hook domyka tę intencję i idzie krok dalej: przy statycznym imporcie
 * gsap trafiał do bundle'a niezależnie od urządzenia, przy dynamicznym
 * telefon w ogóle go nie pobiera.
 *
 * `setup` dostaje instancję gsap-a z już zarejestrowanym ScrollTriggerem i
 * powinno zwrócić `gsap.context(...)`, żeby sprzątanie cofnęło animacje.
 */
const useDesktopScrollEffect = (
  setup: (gsap: Gsap) => { revert: () => void } | void,
  deps: unknown[] = []
) => {
  const currentDevice = useDetectDevice();
  const isMobile = currentDevice.isMobile();

  useEffect(() => {
    if (isMobile) {
      return;
    }

    let ctx: { revert: () => void } | void;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { default: ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/dist/ScrollTrigger'),
      ]);

      if (cancelled) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      ctx = setup(gsap);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, ...deps]);
};

export default useDesktopScrollEffect;
