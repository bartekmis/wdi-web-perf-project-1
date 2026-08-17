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
  // Serve imgix through our own hostname so content images reuse the
  // connection the document has already opened.
  //
  // WHY: the LCP hero lives on k2space-staging.imgix.net, a second origin. Even
  // with `priority` (preload + fetchpriority=high) that costs a fresh
  // DNS + TCP + TLS, and - more importantly - the browser cannot prioritise
  // across origins, so the hero ends up sharing a separate connection with the
  // eight case-study logos instead of being prioritised ahead of them.
  // Measured on the deployed page: 781KB of other bytes were in flight during
  // the hero's 67ms->276ms download window, and DebugBear's real-throttling lab
  // put `loadDuration` at 2758ms for a 42.5KB image.
  //
  // imgix still does all the resizing - this is a pass-through, nothing is
  // processed on our server, so no `sharp` and no image CPU on the droplet.
  async rewrites() {
    // Guarded so the two stay consistent: ContentImage only emits /_img/* URLs
    // when NEXT_PUBLIC_IMGIX_URL is set (otherwise it falls back to
    // NEXT_PUBLIC_MEDIA_URL), so without it there is nothing to rewrite - and
    // an empty destination would be a build error rather than a no-op.
    if (!process.env.NEXT_PUBLIC_IMGIX_URL) {
      return [];
    }

    return [
      {
        source: '/_img/:path*',
        destination: `${process.env.NEXT_PUBLIC_IMGIX_URL}:path*`,
      },
    ];
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
