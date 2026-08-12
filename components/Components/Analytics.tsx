import { useEffect } from 'react';

const GTM_ID = 'GTM-K6G8DFP';

// How long after `load` to fall back to loading GTM if the visitor has not
// interacted by then. Long enough to stay clear of the LCP/TBT window on a
// mid-range phone, short enough that a passive reader is still counted.
const IDLE_FALLBACK_MS = 3000;

const INTERACTION_EVENTS = [
  'pointerdown',
  'keydown',
  'touchstart',
  'scroll',
  'wheel',
] as const;

/**
 * Google Tag Manager, loaded off the critical path.
 *
 * CHANGED 2026-08-12. This used to be a next/script with
 * `strategy="beforeInteractive"`, which is the earliest strategy Next offers:
 * the snippet is inlined into the served HTML and runs before hydration. GTM
 * then synchronously pulled in the whole marketing stack - HubSpot (5 files),
 * Microsoft Clarity, LeadForensics, LinkedIn Insight (x2), Demandbase - all
 * competing with the app's own hydration for the main thread. Per WebPageTest
 * (mobile, 4x CPU), the container alone cost 162KB / 1196ms of CPU, and the
 * tags it injected added roughly another 1.5s on top.
 *
 * None of that has to happen while the page is still painting. GTM is now
 * loaded on whichever comes first:
 *   - the visitor's first real interaction (pointer, key, touch, scroll), or
 *   - `load` + IDLE_FALLBACK_MS, via requestIdleCallback.
 *
 * TRADEOFF, deliberately accepted: a visitor who leaves within ~3s of load
 * without touching the page is not recorded. Everyone who stays or interacts
 * is, and the pageview still fires with the correct URL and referrer because
 * GTM reads them at load time. If that bounce cohort turns out to matter, the
 * fix is a small first-party beacon fired early - not moving GTM back onto the
 * critical path.
 */
const Analytics = () => {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENV !== 'production') {
      return;
    }

    let loaded = false;
    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    const loadGtm = () => {
      if (loaded) {
        return;
      }
      loaded = true;
      teardown();

      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      document.head.appendChild(script);
    };

    // `passive` so the listeners can never delay a scroll or tap; `once` is not
    // enough on its own because we also need to clean up the siblings.
    const listenerOptions = { passive: true, capture: true } as const;

    function teardown() {
      INTERACTION_EVENTS.forEach((event) =>
        window.removeEventListener(event, loadGtm, listenerOptions)
      );
      window.removeEventListener('load', scheduleIdleFallback);
      if (idleHandle !== undefined && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle);
      }
    }

    function scheduleIdleFallback() {
      timeoutHandle = setTimeout(() => {
        if ('requestIdleCallback' in window) {
          // The timeout guarantees it still fires on a page that never goes
          // idle (long-running animation, chatty third party, ...).
          idleHandle = (window as any).requestIdleCallback(loadGtm, {
            timeout: 2000,
          });
        } else {
          loadGtm();
        }
      }, IDLE_FALLBACK_MS);
    }

    INTERACTION_EVENTS.forEach((event) =>
      window.addEventListener(event, loadGtm, listenerOptions)
    );

    if (document.readyState === 'complete') {
      scheduleIdleFallback();
    } else {
      window.addEventListener('load', scheduleIdleFallback);
    }

    return teardown;
  }, []);

  return null;
};

export default Analytics;
