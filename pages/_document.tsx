import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="noindex, nofollow"></meta>

        {/* REMOVED 2026-08-17: the sync <script src="cdn-cookieyes.com/.../script.js">
            that used to sit at the top of <head>. It was the single most expensive
            render blocker on the page: a classic, parser-blocking script, so the
            parser could not reach <body> until a COLD third-party origin had been
            resolved, connected, TLS-negotiated and 8,977 B downloaded.
            Measured (Lighthouse 13, mobile/simulate, Moto G Power + Fast 4G):
              render-blocking-insight  ->  976ms wasted, the largest single entry.
            CookieYes is now deployed as a tag INSIDE the GTM container, so consent
            still loads - just off the critical path, after first paint.
            DO NOT re-add it here as a <script>. If it ever has to come back into
            the document, it must be `defer` at minimum. */}

        {/* REMOVED 2026-08-17: <link rel=stylesheet href=fonts.googleapis.com/css2
            ?family=Roboto+Slab:wght@400;500;700&display=block> plus its two
            preconnects (fonts.googleapis.com, fonts.gstatic.com).
            It was render-blocking for 866ms and pulled two woff2 from gstatic, all
            to serve a face this design never uses - the only thing referencing it
            was `body { font-family: 'Roboto Slab', ... }` in globals.scss, added by
            3f9eae0. `display=block` made it worse: FOIT, so text stayed invisible
            while it loaded. Archivo (self-hosted, next/font, preloaded) is the
            actual type on this site and now applies unopposed. */}

        {/* Consent (CookieYes) and the tag stack are both delivered by the GTM
            container, which we deliberately do not load until after first paint
            (components/Components/Analytics.tsx). These two hints let the DNS +
            TCP + TLS for those origins happen during idle time instead of being
            paid serially at the moment the container is finally injected. A
            preconnect cannot remove a handshake - it can only move it earlier -
            which is exactly what a deferred third party wants. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://cdn-cookieyes.com" />

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

        {/* DebugBear RUM - stays in <head> and stays early. It is the field-data
            source this whole audit is measured against, it injects itself with
            `async`, and it must be present before first paint to attribute the
            paint metrics it reports. It is not render-blocking. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var dbpr=100;if(Math.random()*100>100-dbpr){var d="dbbRum",w=window,o=document,a=addEventListener,scr=o.createElement("script");scr.async=!0;w[d]=w[d]||[];w[d].push(["presampling",dbpr]);["error","unhandledrejection"].forEach(function(t){a(t,function(e){w[d].push([t,e])});});scr.src="https://cdn.debugbear.com/OsowRdI4ZOnc.js";o.head.appendChild(scr);}})()`,
          }}
        />

        {/* REMOVED 2026-08-17: the second GTM container that used to be injected
            from here with `j.async=false`.
            Two separate containers were loading on every page - this one (from
            NEXT_PUBLIC_GTM_ID) and a hardcoded one in Analytics.tsx - each
            pulling its own copy of the tag stack (HubSpot x5, Clarity,
            LeadForensics, LinkedIn Insight, Demandbase).
            `j.async=false` is the detail worth remembering: on a script inserted
            by script, async=false does not mean "sync", it means EXECUTION-ORDERED
            - the browser still blocks the parser-driven load on it. So the more
            expensive of the two containers was also the one loaded the worst way.
            There is now exactly one container, and it is loaded after first paint
            by components/Components/Analytics.tsx. */}
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
