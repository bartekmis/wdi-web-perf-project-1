import { useEffect } from 'react';

// Google Tag Manager, loaded AFTER FIRST PAINT.
//
// Why this file looks like this rather than <Script strategy="...">:
//
// Before 2026-08-17 the container was loaded twice, both times on the critical
// path - once from _document.tsx with `j.async=false` (which on a
// script-inserted <script> means execution-ordered, i.e. it still blocks the
// parser-driven load) and once from here with next/script
// `strategy="beforeInteractive"`, which hoists the tag into the document HEAD
// and is by definition pre-paint. Between them they pulled two full copies of
// the tag stack (HubSpot x5, Clarity, LeadForensics, LinkedIn Insight,
// Demandbase) before anything had rendered.
//
// next/script has no "after the first paint" strategy: `afterInteractive`
// injects during hydration (still inside the window that holds the paint on a
// 4x-throttled CPU) and `lazyOnload` waits for the window `load` event, which
// on this page is seconds late and would delay the consent banner. So the
// trigger is written explicitly against the paint timeline instead.
//
// The container now carries the CookieYes consent tag too - CookieYes was
// removed from _document.tsx, where it was a sync, parser-blocking <script>
// costing 976ms of render-blocking time.
//
// WHY THE TRIGGER IS THE LOAD EVENT AND NOT FIRST PAINT.
// The first version of this file fired on first-contentful-paint plus an idle
// callback. That is "after first paint" by the letter, and it was still wrong,
// because first paint happens BEFORE the LCP image has finished downloading -
// so the container landed in the middle of the LCP window and competed with
// the hero image for bandwidth. Measured on the deployed page:
//
//   LCP image on the wire        67ms -> 276ms
//   gtm.js starts                187ms, 116.7KB          <- inside that window
//   total competing bytes during the image download: 781KB
//
// and DebugBear's independent lab (real throttling, not Lighthouse's
// simulator) put the consequence at `loadDuration` 2758ms for a 42.5KB image.
// Bandwidth during the LCP window is the scarcest resource on the page, and
// 116.7KB of tag manager is the largest single thing that does not need to be
// there yet.
//
// `load` is still comfortably "after first paint", it is where analytics
// belongs, and it keeps the consent banner within a second or so of the page
// being usable. Any interaction still loads the tags immediately, so consent
// is in place before anything a user does can be measured.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// Hard ceiling on how long we will wait for an idle slot after load.
// Reaching this is the expected case on a busy main thread, not the exception.
const IDLE_TIMEOUT_MS = 2000;

const injectGtm = () => {
  if (!GTM_ID) {
    return;
  }

  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
};

const Analytics = () => {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENV !== 'production' || !GTM_ID) {
      return;
    }

    const w = window as any;

    // Guard against a second injection across client-side route changes.
    if (w.__gtmInjected) {
      return;
    }
    w.__gtmInjected = true;

    let done = false;
    const timers: number[] = [];
    let cleanupLoad: (() => void) | undefined;

    const run = () => {
      if (done) {
        return;
      }
      done = true;
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener('pointerdown', run);
      window.removeEventListener('keydown', run);
      injectGtm();
    };

    // Once loading is done, hand the browser an idle slot to do the injection
    // in, so the container's own evaluation does not land on top of whatever
    // the main thread is still finishing. requestIdleCallback is not in
    // Safari, hence the setTimeout fallback.
    const whenIdle = () => {
      if (typeof w.requestIdleCallback === 'function') {
        w.requestIdleCallback(run, { timeout: IDLE_TIMEOUT_MS });
      } else {
        timers.push(window.setTimeout(run, 200));
      }
    };

    if (document.readyState === 'complete') {
      whenIdle();
    } else {
      window.addEventListener('load', whenIdle, { once: true });
      cleanupLoad = () => window.removeEventListener('load', whenIdle);
    }

    // If the user touches the page before any of the above has fired, load the
    // tags immediately - an interaction is worth measuring, and consent should
    // be in place for it.
    window.addEventListener('pointerdown', run, { once: true });
    window.addEventListener('keydown', run, { once: true });

    // Backstop, so the container can never be starved indefinitely on a page
    // whose load event never arrives (a stalled subresource, a background tab).
    timers.push(window.setTimeout(run, 8000));

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      cleanupLoad?.();
      window.removeEventListener('pointerdown', run);
      window.removeEventListener('keydown', run);
    };
  }, []);

  return null;
};

export default Analytics;
