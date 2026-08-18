if (!process.env.WORDPRESS_API_URL) {
  throw new Error(`
    Please provide a valid WordPress instance URL.
    Add to your environment variables WORDPRESS_API_URL.
  `)
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a self-contained .next/standalone bundle (server.js + traced
  // node_modules) so the CI runner can rsync a minimal artifact to the server.
  output: 'standalone',
  experimental: {
    largePageDataBytes: 2048 * 1000,
    // COFNIETE 2026-08-18: `optimizeCss: true` (critters). NIE WLACZAC PONOWNIE
    // bez sprawdzenia CLS na szybkim laczu.
    //
    // Wbudowywanie krytycznego CSS-a faktycznie robilo to, co obiecuje: przy
    // symulowanym Slow 4G FCP spadlo z 2411 ms do 865 ms, a Speed Index
    // z 3037 ms do 1790 ms. Problem w tym, ze critters wybiera "krytyczne"
    // reguly, dopasowujac selektory do wyrenderowanego HTML-a, i czesc regul
    // gubi - reszta arkusza doladowuje sie potem nieblokujaco
    // (media="print" onload="this.media='all'"), a wtedy layout skacze.
    //
    // Zmierzone na zywej stronie (PerformanceObserver, layout-shift, cold cache,
    // Moto G Power / Fast 4G): przesuniecie 0,0687 w 211 ms, zrodlo to przycisk
    // "Book a consultation" rosnacy z 24 px na 64 px - czyli padding
    // z button.module.scss dojechal dopiero z asynchronicznym arkuszem.
    // Lighthouse przy Fast 4G raportowal z tego CLS 0,305 (przy Slow 4G 0,
    // bo tam arkusz zdazy przed pierwszym malowaniem i skok sie nie ujawnia).
    //
    // CLS wazy 25% wyniku, FCP i SI po 10%, a na szybkim laczu FCP i tak jest
    // niskie bez tej sztuczki - wiec bilans wychodzi wyraznie na minus.
  },
  // ZMIANA 2026-08-18: `no-transform` na trasach HTML.
  //
  // Cloudflare doklejal do kazdej odpowiedzi HTML snippet `window.__CF$cv$params`,
  // ktory laduje /cdn-cgi/challenge-platform/scripts/jsd/main.js (JS Detections
  // z Bot Management). Ten jeden skrypt wykonywal sie jako pojedyncze dlugie
  // zadanie ~420 ms i odpowiadal za CALA roznice w wyniku Lighthouse przy
  // Moto G Power / Fast 4G: 85 punktow z nim, 100 bez niego (TBT 568 ms vs 10 ms).
  // Z poziomu aplikacji nie da sie go odroczyc - wstrzykiwany jest na brzegu,
  // juz po naszej odpowiedzi.
  //
  // `Cache-Control: no-transform` to udokumentowany przez Cloudflare wylacznik
  // modyfikacji odpowiedzi. Czy obejmuje takze to wstrzykniecie - sprawdzone
  // eksperymentalnie na /theme, zanim ruszylem strone glowna:
  //   /theme z no-transform:  snippet NIE wystepuje, odpowiedz nadal skompresowana
  //                           (2 752 B na lączu vs 16 893 B surowo)
  //   / bez no-transform:     snippet obecny, cf-cache-status: MISS (czyli prosto
  //                           z originu, a nie ze starego cache'u)
  // Kompresja na brzegu dziala dalej - to byla glowna obawa przy tym naglowku.
  //
  // Wartosc jest DOKLADNIE ta, ktora Next ustawia sam dla ISR, plus `no-transform`.
  // `s-maxage=60` odpowiada `revalidate: 60` z getStaticProps, wiec Cloudflare
  // nadal cache'uje strone na brzegu (cf-cache-status: HIT, TTFB ~60 ms).
  // Gdyby to zgubic, kazde wejscie szloby do originu, ktory ma TTFB ~500 ms.
  //
  // Zakres celowo omija /_next/ i /api/ - pliki statyczne maja wlasny,
  // niezmienny Cache-Control (max-age=31536000, immutable) i nie ma powodu
  // go nadpisywac.
  async headers() {
    return [
      {
        source: '/((?!_next/|api/).*)',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'max-age=31536000, s-maxage=60, stale-while-revalidate, no-transform',
          },
        ],
      },
    ];
  },
  staticPageGenerationTimeout: 7200,
  reactStrictMode: true,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 5000],
    // 120 and 240 added 2026-07-28. For a fixed-size <Image>, Next builds the
    // srcset from [width, width*2] resolved against imageSizes+deviceSizes.
    // The header logo is width={120}; with the old list topping out at 100,
    // both 120 and 240 fell through to deviceSizes[0] and the page requested
    // _next/image?w=640 for a 120x60 slot.
    imageSizes: [20, 33, 40, 50, 60, 80, 90, 100, 120, 240],
    domains: ['k2space-backend.bigpic.dev', 'k2space.local', 'k2space-staging.imgix.net', 'k2space.imgix.net', 'cms.k2space.co.uk'],
  },
  env: {
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV || 'development'
  }
}

module.exports = nextConfig


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "web-dev-insider",
    project: "wdi-web-perf-city-project-1",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
