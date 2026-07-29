import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  const staticCookieBannerHtml = `
      <div id="cookie-consent-banner" style="
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #2B373B;
        color: #f0df44;
        padding: 15px;
        text-align: center;
        z-index: 9999;
        font-family: Arial, sans-serif;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
      ">
        Ta strona używa cookies w celu poprawy komfortu użytkowania.
        <span style="font-size: 10px;"> Więcej informacji znajdziesz w naszej <a href="/#" style="color: lightblue;">polityce prywatności</a>.</span>
        <button id="accept-cookies" style="
          margin-left: 20px;
          padding: 8px 15px;
          background: #f0df44;
          color: #4e503b;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        ">Akceptuję cookies</button>
        <button id="decline-cookies" style="
          margin-left: 10px;
          padding: 8px 15px;
          background: #2B373B;
          color: #f0df44;
          border: 1px solid #f0df44;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        ">Odrzuć</button>
      </div>
    `;

  const cookieBannerScript = `
      (function() {
        const COOKIE_NAME = 'cookie_consent_accepted';
        const banner = document.getElementById('cookie-consent-banner');
        const acceptButton = document.getElementById('accept-cookies');
        const declineButton = document.getElementById('decline-cookies');

        if (localStorage.getItem(COOKIE_NAME) === 'true') {
          if (banner) {
            banner.style.display = 'none';
          }
          return;
        }

        if (banner) {
          banner.style.display = 'block';
        }

        if (acceptButton) {
          acceptButton.addEventListener('click', function() {
            localStorage.setItem(COOKIE_NAME, 'true');
            if (banner) {
              banner.style.display = 'none';
            }
            console.log('Cookies accepted!');
          });
        }

        if (declineButton) {
          declineButton.addEventListener('click', function() {
            localStorage.setItem(COOKIE_NAME, 'true');
            if (banner) {
              banner.style.display = 'none';
            }
            console.log('Cookies declined!');
          });
        }
      })();
    `;

  return (
    <Html lang="en">
      <Head>
        {/* CookieYes consent management - load first (sync by design) */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          id="cookieyes"
          type="text/javascript"
          src="https://cdn-cookieyes.com/client_data/92a68bd2b7ccd68375efe4a3592b2d33/script.js"
        ></script>
        <meta name="robots" content="noindex, nofollow"></meta>
        {/* Only preconnect to origins we actually request. Both of these are
            used by the Roboto Slab stylesheet below (googleapis serves the CSS,
            gstatic serves the woff2). If that font is ever self-hosted, delete
            these two as well. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* REMOVED 2026-07-28: preconnect to connect.facebook.net,
            www.google-analytics.com, cdn.jsdelivr.net, s3.amazonaws.com.
            DO NOT RE-ADD without checking the waterfall first.
            None of these four hosts appears in ANY request across 3 WebPageTest
            runs - nothing on the site ever contacts them. Each hint still spends
            a speculative DNS + TCP + TLS handshake out of a 6-connection mobile
            budget, at ~870-905ms, exactly while the fonts and critical CSS are
            in flight. Cleanup, not a measured win: contention effects are not
            resolvable in a 5-run A/B. */}
        {/* WPCC cookie consent - CSS + script.
            RE-ADDED 2026-07-29 ON PURPOSE as a course demo case. This is the
            known-bad state, not a regression to fix silently:
            the wpcc.io zone is dead (no NS records, DNS returns SERVFAIL), so the
            stylesheet neither loads nor fails for seconds. A classic <script> may
            not execute until every stylesheet inserted before it has loaded OR
            failed, so the parser can be held in <head> and nothing paints.
            Measured when this block was removed (mobile 412x765x2.6, Fast 4G,
            CPU 4x, n=5, medians): FCP 592ms -> 460ms (-132ms, spread +/-64ms)
            on a local resolver. The real cost is set by the RESOLVER:
              local resolver  wpcc failed  543ms -> FCP  592ms
              WPT agent       wpcc failed ~8450ms -> FCP 8610ms
            A controlled variant holding the same tag for a known 6.2s moved the
            blocker +5904ms and FCP +5892ms - a 1:1 transfer (ratio 0.998). */}
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.wpcc.io/lib/1.0.2/cookieconsent.min.css"
        />
        <script src="https://cdn.wpcc.io/lib/1.0.2/cookieconsent.min.js" defer></script>
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;500;700&display=block"
        />
        {/* DebugBear RUM - load early so it captures errors from the start */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var dbpr=100;if(Math.random()*100>100-dbpr){var d="dbbRum",w=window,o=document,a=addEventListener,scr=o.createElement("script");scr.async=!0;w[d]=w[d]||[];w[d].push(["presampling",dbpr]);["error","unhandledrejection"].forEach(function(t){a(t,function(e){w[d].push([t,e])});});scr.src="https://cdn.debugbear.com/OsowRdI4ZOnc.js";o.head.appendChild(scr);}})()`,
          }}
        />
        {gtmId && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=false;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${gtmId}');
                  `,
              }}
            />
          </>
        )}
        <div dangerouslySetInnerHTML={{ __html: staticCookieBannerHtml }} />
        <script dangerouslySetInnerHTML={{ __html: cookieBannerScript }} />
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
