import Script from 'next/script';

/**
 * ZMIANA 2026-08-18: jeden kontener GTM, ladowany po `load`.
 *
 * Stan przed zmiana - dwie NIEZALEZNE instalacje GTM na jednej stronie:
 *   1. `_document.tsx`: inline snippet z `j.async=false`, czyli skrypt
 *      wstrzykiwany SYNCHRONICZNIE - parser HTML stawal na czas pobrania
 *      i wykonania gtm.js z obcego originu.
 *   2. ten komponent: drugi kontener (GTM-K6G8DFP) ze `strategy="beforeInteractive"`,
 *      co w pages routerze oznacza tag w HTML-u przed hydracja.
 *
 * Koszt z WebPageTest (Moto G, 4G, 3 przebiegi, mediana):
 *   gtm.js?id=GTM-K6G8DFP   163 KB / 478 KB po dekompresji, 588 ms blokowania
 *   gtm.js?id=GTM-P5KBGQN9  116 KB / 325 KB po dekompresji, 277 ms blokowania
 * Do tego GTM byl wejsciem dla calej reszty third-party (HubSpot x4, Clarity,
 * LinkedIn Insight, Leadforensics) - one wszystkie ladowaly sie w oknie, w ktorym
 * liczy sie TBT. Zmierzone TBT calej strony: 4981 / 6331 / 5325 ms.
 *
 * Zostaje kontener z NEXT_PUBLIC_GTM_ID (ten skonfigurowany w deployu),
 * `strategy="lazyOnload"` odpala go po zdarzeniu `load`, wiec on i wszystkie
 * jego tagi wypadaja z okna pomiaru TBT. Zbieranie danych dziala dalej.
 */
const Analytics = () => {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  if (process.env.NEXT_PUBLIC_ENV !== 'production' || !gtmId) {
    return null;
  }

  return (
    <Script
      id="gtm-script"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `,
      }}
    />
  );
};

export default Analytics;
