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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://s3.amazonaws.com" />
        {/* WPCC cookie consent - CSS + script */}
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.wpcc.io/lib/1.0.2/cookieconsent.min.css"
        />
        <script src="https://cdn.wpcc.io/lib/1.0.2/cookieconsent.min.js" defer></script>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://www.google.com/recaptcha/api.js" type="text/javascript"></script>
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
