import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <Html lang="en">
      <Head>
        {/* CookieYes (consent management).
            ZMIANA 2026-08-18: dodane `defer`. Byl to zwykly, synchroniczny
            <script> jako PIERWSZY element <head> - parser HTML zatrzymywal sie
            na nim, zanim w ogole zobaczyl arkusze stylow i obrazek LCP.
            `defer` zachowuje kolejnosc wykonania (CookieYes nadal startuje
            przed czymkolwiek innym), ale nie blokuje juz parsera ani preload
            scannera. GTM idzie teraz na `lazyOnload` (patrz Analytics.tsx),
            wiec consent i tak jest gotowy przed pierwszym tagiem. */}
        <script
          id="cookieyes"
          type="text/javascript"
          defer
          src="https://cdn-cookieyes.com/client_data/92a68bd2b7ccd68375efe4a3592b2d33/script.js"
        ></script>
        <meta name="robots" content="noindex, nofollow"></meta>

        {/* ZMIANA 2026-08-18: preconnect do fonts.googleapis.com i
            fonts.gstatic.com USUNIETE razem z arkuszem Roboto Slab - font jest
            teraz self-hostowany przez next/font/google (patrz _app.tsx), wiec
            zaden z tych originow nie jest juz dotykany.
            W ich miejsce preconnect do imgix - stamtad leci obrazek LCP,
            a byl to jedyny obcy origin na sciezce krytycznej renderu. */}
        <link rel="preconnect" href="https://k2space-staging.imgix.net" crossOrigin="anonymous" />

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
            parser could not leave <head>, and nothing painted. */}
        {/* REMOVED 2026-07-28: sync <script src="google.com/recaptcha/api.js">.
            Nothing on the rendered homepage uses it: no <form>, no g-recaptcha
            element, no `grecaptcha` reference anywhere in the repo. It rendered
            no widget and gated nothing, while pulling recaptcha__en.js
            (382,189 B / 513ms CPU, per WPT) and one extra cold origin.
            If a page ever needs reCAPTCHA, load it on that page, on demand. */}

        {/* REMOVED 2026-08-18: <link rel="stylesheet"> do
            fonts.googleapis.com/css2?family=Roboto+Slab...&display=block.
            NIE PRZYWRACAC - font jest self-hostowany przez next/font/google
            w _app.tsx. Arkusz byl blokujacy render, na obcym originie i tworzyl
            lancuch krytyczny googleapis -> gstatic. DevTools MCP (cold cache,
            Moto G Power, Fast 4G, CPU 4x) wycenil blokery renderowania na
            777 ms FCP, a osobno `display=block` na 475 ms FCP. */}

        {/* REMOVED 2026-08-18: inline snippet GTM z `j.async=false`.
            NIE PRZYWRACAC. Byla to DRUGA instalacja GTM na stronie (obok
            Analytics.tsx) i do tego synchroniczna. Jeden kontener, ladowany
            przez next/script `lazyOnload`, siedzi teraz w Analytics.tsx. */}

        {/* DebugBear RUM - load early so it captures errors from the start */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var dbpr=100;if(Math.random()*100>100-dbpr){var d="dbbRum",w=window,o=document,a=addEventListener,scr=o.createElement("script");scr.async=!0;w[d]=w[d]||[];w[d].push(["presampling",dbpr]);["error","unhandledrejection"].forEach(function(t){a(t,function(e){w[d].push([t,e])});});scr.src="https://cdn.debugbear.com/OsowRdI4ZOnc.js";o.head.appendChild(scr);}})()`,
          }}
        />
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
