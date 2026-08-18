import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <Html lang="en">
      <Head>
        {/* CookieYes consent management.
            CHANGED 2026-08-18: was a SYNC <script> at the top of <head>, i.e.
            parser-blocking. Lighthouse's render-blocking-insight measured it at
            976ms - the single largest render-blocking entry on the page, ahead
            of the Google Fonts stylesheet. It now loads `async`, so it still
            starts at the top of <head> (earliest possible discovery, the thing
            a CMP actually needs) but no longer holds the parser, and nothing
            below it in <head> waits on a third-party round trip.
            DO NOT drop the tag itself: an earlier pass removed it on the
            assumption GTM would serve it, container GTM-P5KBGQN9 does not
            contain it, and the site then showed no consent banner at all. */}
        <link rel="preconnect" href="https://cdn-cookieyes.com" crossOrigin="anonymous" />
        <script
          id="cookieyes"
          async
          type="text/javascript"
          src="https://cdn-cookieyes.com/client_data/92a68bd2b7ccd68375efe4a3592b2d33/script.js"
        ></script>
        <meta name="robots" content="noindex, nofollow"></meta>
        {/* REMOVED 2026-08-18: the Google Fonts stylesheet for Roboto Slab, and
            the two preconnects (fonts.googleapis.com, fonts.gstatic.com) that
            existed only to serve it. DO NOT RE-ADD.
            It was a render-blocking stylesheet costing 866ms, requested with
            `display=block` (so a guaranteed FOIT on top), for a family this
            design never renders. Its ONLY referent was the `font-family` on
            `body` in globals.scss, where it sat in front of the real typeface -
            var(--font-archivo), self-hosted via next/font/local and preloaded.
            Roboto Slab was dropped from that stack in the same commit.
            Removing it also frees two of the six mobile connections during the
            exact window the critical CSS and the LCP image are competing. */}
        {/* REMOVED 2026-07-28: preconnect to connect.facebook.net,
            www.google-analytics.com, cdn.jsdelivr.net, s3.amazonaws.com.
            DO NOT RE-ADD without checking the waterfall first.
            None of these four hosts appears in ANY request across 3 WebPageTest
            runs - nothing on the site ever contacts them. Each hint still spends
            a speculative DNS + TCP + TLS handshake out of a 6-connection mobile
            budget, at ~870-905ms, exactly while the fonts and critical CSS are
            in flight. Cleanup, not a measured win: contention effects are not
            resolvable in a 5-run A/B. */}
        {/* REMOVED 2026-07-28: cdn.wpcc.io stylesheet + script. DO NOT RE-ADD.
            The wpcc.io zone is dead (no NS records, DNS returns SERVFAIL), so the
            stylesheet neither loaded nor failed for seconds. Because a classic
            <script> may not execute until every stylesheet inserted before it has
            loaded OR failed, the sync recaptcha tag below it could not run, the
            parser could not leave <head>, and nothing painted.
            Measured (mobile 412x765x2.6, Fast 4G, CPU 4x, n=5, medians):
              FCP 592ms -> 460ms (-132ms, run spread +/-64ms)  [local resolver]
            The local number understates it: cost is set by the RESOLVER, not by us.
              local resolver  wpcc failed  543ms -> FCP  592ms
              WPT agent       wpcc failed ~8450ms -> FCP 8610ms
            Controlled variant holding the same tag for a known 6.2s moved the
            blocker +5904ms and FCP +5892ms - a 1:1 transfer (ratio 0.998).
            Every first-time visitor pays a different, unbounded price. */}
        {/* REMOVED 2026-07-28: sync <script src="google.com/recaptcha/api.js">.
            CORRECTNESS FIX, not a performance fix - the A/B was INCONCLUSIVE
            (FCP +12ms against a +/-40ms bar; adding `defer` bought nothing,
            because the local loop reuses a warm TLS session to www.google.com
            and never pays the tag's cold cost).
            It is removed because nothing uses it: no <form> and no g-recaptcha
            element in the rendered homepage, and no `grecaptcha` reference
            anywhere in the repo. It rendered no widget and gated nothing, while
            pulling recaptcha__en.js (382,189 B / 513ms CPU, per WPT) and one
            extra cold origin (www.gstatic.com).
            If a page ever needs reCAPTCHA, load it on that page, on demand. */}
        {/* DebugBear RUM - load early so it captures errors from the start.
            Self-injecting and async; it is not on the critical path. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var dbpr=100;if(Math.random()*100>100-dbpr){var d="dbbRum",w=window,o=document,a=addEventListener,scr=o.createElement("script");scr.async=!0;w[d]=w[d]||[];w[d].push(["presampling",dbpr]);["error","unhandledrejection"].forEach(function(t){a(t,function(e){w[d].push([t,e])});});scr.src="https://cdn.debugbear.com/OsowRdI4ZOnc.js";o.head.appendChild(scr);}})()`,
          }}
        />
        {/* REMOVED 2026-08-18: the inline GTM loader that used to live here.
            Two problems, both measured:
            1. It injected the tag with `j.async=false`. An injected script with
               async=false is execution-ORDERED, which still blocks the parser -
               the "async GTM snippet" only looks async.
            2. It loaded a SECOND container. This document requested
               GTM-P5KBGQN9 while components/Components/Analytics.tsx requested
               GTM-K6G8DFP at strategy="beforeInteractive" - two full container
               downloads and two evaluations on every page view.
            GTM now loads once, from Analytics.tsx, after the load event. The
            <noscript> iframe below stays: it costs nothing to a JS-enabled
            client and is the documented GTM fallback. */}
      </Head>
      <body>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
