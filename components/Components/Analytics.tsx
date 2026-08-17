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
// costing 976ms of render-blocking time. Consent therefore rides on this same
// deferred load, which is why the trigger fires promptly after paint rather
// than waiting for idle indefinitely: a consent banner that appears seconds
// late is a compliance problem, not just a UX one.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

// Hard ceiling on how long we will wait for an idle slot after first paint.
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
    let observer: PerformanceObserver | undefined;

    const run = () => {
      if (done) {
        return;
      }
      done = true;
      observer?.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener('pointerdown', run);
      window.removeEventListener('keydown', run);
      injectGtm();
    };

    // Once the paint has happened, hand the browser an idle slot to do the
    // injection in, so the container's own evaluation does not land in the
    // middle of hydration. requestIdleCallback is not in Safari, hence the
    // setTimeout fallback.
    const afterPaint = () => {
      if (typeof w.requestIdleCallback === 'function') {
        w.requestIdleCallback(run, { timeout: IDLE_TIMEOUT_MS });
      } else {
        timers.push(window.setTimeout(run, 200));
      }
    };

    // The actual "after first paint" trigger. A buffered PerformanceObserver
    // also replays a paint that already happened before this effect ran, which
    // is the common case - hydration usually starts after FCP.
    try {
      observer = new PerformanceObserver((list) => {
        if (
          list.getEntries().some((e) => e.name === 'first-contentful-paint')
        ) {
          afterPaint();
        }
      });
      observer.observe({ type: 'paint', buffered: true });
    } catch {
      // No PerformanceObserver / no paint timing: fall back to the load event.
      if (document.readyState === 'complete') {
        afterPaint();
      } else {
        window.addEventListener('load', afterPaint, { once: true });
      }
    }

    // If the user touches the page before any of the above has fired, load the
    // tags immediately - an interaction is worth measuring, and consent should
    // be in place for it.
    window.addEventListener('pointerdown', run, { once: true });
    window.addEventListener('keydown', run, { once: true });

    // Backstop, so the container can never be starved indefinitely on a page
    // that never reports a paint (e.g. opened in a background tab).
    timers.push(window.setTimeout(run, 5000));

    return () => {
      observer?.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener('pointerdown', run);
      window.removeEventListener('keydown', run);
    };
  }, []);

  return null;
};

export default Analytics;
