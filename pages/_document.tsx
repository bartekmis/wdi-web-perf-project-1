import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <Html lang="en">
      <Head>
        {/* REMOVED 2026-08-12 (same day it was added): preconnect to the imgix
            origin. Nothing contacts that host from the browser any more -
            content images are served same-origin through the `/_img/*` rewrite
            in next.config.js - so the hint would now buy a handshake nobody
            uses, which is exactly the waste the 2026-07-28 cleanup removed.
            The preconnect was the first attempt at this problem and it did not
            work: a preconnect can only overlap the handshake, it cannot remove
            it, and Lighthouse's simulator does not credit it on the LCP path.
            Removing the connection entirely is what actually fixed it. */}
        <link rel="preconnect" href="https://cdn-cookieyes.com" />
        {/* CookieYes consent management.
            CHANGED 2026-08-12: was a bare sync <script> - the parser stopped at
            this tag and could not reach <body> until the file had been fetched
            and executed from a cold third-party origin (DNS+TCP+TLS+8.3KB, then
            344ms of CPU per WebPageTest). `defer` keeps the two properties that
            actually matter for a consent manager - it still runs before
            DOMContentLoaded and still runs in document order relative to other
            deferred scripts - while letting the parser continue immediately.
            It also stays ahead of GTM, which now loads later still (see
            components/Components/Analytics.tsx), so consent is still resolved
            before any tag it gates. DO NOT drop `defer`. */}
        <script
          id="cookieyes"
          type="text/javascript"
          src="https://cdn-cookieyes.com/client_data/92a68bd2b7ccd68375efe4a3592b2d33/script.js"
          defer
        ></script>
        <meta name="robots" content="noindex, nofollow"></meta>
        {/* REMOVED 2026-08-12: preconnect to fonts.googleapis.com and
            fonts.gstatic.com, together with the Roboto Slab stylesheet they
            served. DO NOT RE-ADD.
            Roboto Slab was never part of this design - it existed only in the
            `body { font-family: ... }` rule that 3f9eae0 added to globals.scss
            (removed in the same change). The real design font is Archivo,
            self-hosted and preloaded through next/font in _app.tsx.
            Cost removed: one render-blocking stylesheet on a cold cross-origin
            host, two speculative handshakes out of the 6-connection mobile
            budget, and 54KB of woff2 from fonts.gstatic.com. The stylesheet was
            requested with `display=block`, i.e. FOIT - text stayed invisible
            for up to 3s while that chain resolved, which is exactly the window
            FCP measures. */}
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
        {/* DebugBear RUM. Self-deferring: the snippet only registers error
            listeners synchronously and appends an async <script>, so it costs
            no parser time. Kept early so it captures errors from the start. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var dbpr=100;if(Math.random()*100>100-dbpr){var d="dbbRum",w=window,o=document,a=addEventListener,scr=o.createElement("script");scr.async=!0;w[d]=w[d]||[];w[d].push(["presampling",dbpr]);["error","unhandledrejection"].forEach(function(t){a(t,function(e){w[d].push([t,e])});});scr.src="https://cdn.debugbear.com/OsowRdI4ZOnc.js";o.head.appendChild(scr);}})()`,
          }}
        />
        {/* REMOVED 2026-08-12: the second GTM container (NEXT_PUBLIC_GTM_ID,
            GTM-P5KBGQN9), injected here with `j.async=false`.
            Two problems, both fixed by deleting it:
            1. DUPLICATE. components/Components/Analytics.tsx already loads a GTM
               container (GTM-K6G8DFP). Both were live, so every page load pulled
               two containers (162KB + 115KB, 1196ms + 179ms CPU per WPT) and
               fired overlapping tag stacks.
            2. `j.async=false` on a dynamically-inserted script does NOT mean
               "defer" - it makes the script parser-blocking-equivalent: it must
               execute in order before the parser continues past the insertion
               point. That is the single worst way to load a tag manager.
            GTM is now loaded once, lazily, from Analytics.tsx.
            DO NOT re-add a container here. */}
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
