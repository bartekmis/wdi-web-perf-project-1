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
    // ZMIANA 2026-08-18: wbudowywanie krytycznego CSS-a (critters).
    // FCP siedzi dokladnie na arkuszu: 5 blokujacych renderowanie plikow CSS
    // (razem 23,2 KB) startuje o ~740 ms, najwiekszy konczy sie o 2342 ms,
    // a FCP wypada o 2411 ms. Same pliki nie sa duze - one po prostu dziela
    // pasmo z obrazkiem LCP, fontem i ~180 KB JS-a, ktore rusza w tej samej
    // milisekundzie.
    // `optimizeCss` wstrzykuje reguly potrzebne dla pierwszego ekranu prosto
    // w HTML, a reszte arkuszy przelacza na ladowanie nieblokujace - dzieki
    // czemu pierwsze malowanie przestaje czekac na osobny request.
    optimizeCss: true,
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
