/**
 * Lazy loader for gsap + ScrollTrigger.
 *
 * WHY (2026-08-12): gsap and ScrollTrigger were static imports in the section
 * templates, which put them in a shared chunk that every page carrying any of
 * those sections had to download and evaluate. Lighthouse attributed 391ms of
 * CPU to that chunk on the mobile profile - the second most expensive script
 * on the homepage after Cloudflare's bot-detection script.
 *
 * Every effect that uses gsap in this codebase is a decorative parallax on a
 * background circle or dot grid, and the components that were written most
 * recently (HeaderImageSplit, and all three Curtains components) already skip
 * those effects on mobile. The library was still being parsed and executed
 * there regardless, because a static import runs whether or not you call it.
 *
 * Importing through here instead means the gsap chunk is only ever fetched on
 * the devices that actually animate. Webpack keeps it as its own chunk, and
 * the module-level promise means concurrent callers share one download.
 */

type GsapModule = {
  gsap: typeof import('gsap')['gsap'];
};

let pending: Promise<GsapModule> | null = null;

export const loadGsap = (): Promise<GsapModule> => {
  if (!pending) {
    pending = Promise.all([
      import('gsap'),
      import('gsap/dist/ScrollTrigger'),
    ]).then(([gsapModule, scrollTriggerModule]) => {
      const gsap = gsapModule.gsap;
      const ScrollTrigger =
        (scrollTriggerModule as any).default || scrollTriggerModule;

      // registerPlugin is idempotent, and this runs once per page load rather
      // than on every render like the old `gsap.registerPlugin(ScrollTrigger)`
      // calls in component bodies did.
      gsap.registerPlugin(ScrollTrigger);

      return { gsap };
    });
  }

  return pending;
};
