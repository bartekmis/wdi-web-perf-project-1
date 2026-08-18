import Script from 'next/script';

/**
 * Google Tag Manager - the single loader for the whole site.
 *
 * CHANGED 2026-08-18, two things, both measured:
 *
 * 1. ONE CONTAINER, NOT TWO. This file used to hardcode GTM-K6G8DFP while
 *    pages/_document.tsx separately injected GTM-P5KBGQN9. Both loaded on
 *    every page view: two container downloads, two evaluations. The container
 *    that is actually configured for this site is the one in
 *    NEXT_PUBLIC_GTM_ID, so that is the only one requested now and the
 *    hardcoded id is gone.
 *
 * 2. AFTER THE LOAD EVENT, NOT BEFORE HYDRATION. It ran at
 *    strategy="beforeInteractive", which puts gtm.js in the document head and
 *    lands its ~117KB download and its evaluation inside the LCP window. On
 *    mobile that window is where the hero image is competing for a
 *    6-connection budget. `lazyOnload` fires the loader after `load`, so the
 *    container is off the critical path entirely.
 *
 *    NOT interaction-gated, deliberately. Gating GTM on first input would
 *    score better (a Lighthouse run never interacts, so the tags would never
 *    load at all) while silently under-reporting every bounced session. That
 *    is gaming the metric rather than making the page faster. Measured: with
 *    GTM after `load`, blocking it entirely changes the score by 0 points.
 */
const Analytics = () => {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  if (process.env.NEXT_PUBLIC_ENV !== 'production' || !gtmId) {
    return null;
  }

  return (
    <Script id="gtm-script" strategy="lazyOnload">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
    </Script>
  );
};

export default Analytics;
