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
        <meta name="robots" content="noindex, nofollow"></meta>
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
