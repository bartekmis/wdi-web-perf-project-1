if (!process.env.WORDPRESS_API_URL) {
  throw new Error(`
    Please provide a valid WordPress instance URL.
    Add to your environment variables WORDPRESS_API_URL.
  `)
}

// Origin of the imgix source, e.g. https://k2space-staging.imgix.net.
// NEXT_PUBLIC_IMGIX_URL also carries a path prefix (/app/uploads/), which the
// loader keeps in the request path, so only the origin belongs here.
const IMGIX_ORIGIN = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_IMGIX_URL || '').origin
  } catch {
    return null
  }
})()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Same-origin passthrough to imgix, added 2026-08-12.
  //
  // WHY: the hero is the LCP element on nearly every page and it was served
  // straight from k2space-staging.imgix.net - a SECOND origin. The browser had
  // to spend a full DNS + TCP + TLS handshake before its first byte, even
  // though next/image already emits a <link rel=preload> for it. Lighthouse's
  // simulated mobile profile charges ~562ms of latency per request, and the
  // LCP breakdown showed ~1700ms of "load delay" for a 42.5KB image that the
  // observed timeline finishes in 153ms. A <link rel=preconnect> did not
  // recover it (Lighthouse's simulator does not credit preconnect on the LCP
  // path, and it only ever overlaps the handshake - it cannot remove it).
  //
  // Routing images through our own origin means they reuse the HTTP/2
  // connection the document already opened: no second handshake at all, and
  // the browser's own priorities apply across all of them on one connection.
  // imgix still does the actual work - format negotiation (auto=format),
  // fitting and resizing all still happen there, and the Accept header that
  // drives AVIF/WebP selection is forwarded by the rewrite. Nothing is
  // resized on our server, so this needs no `sharp` and costs no CPU here.
  // Cloudflare caches the responses at the edge under our hostname.
  //
  // If this ever needs reverting, revert the loader in
  // components/Components/ContentImage.tsx at the same time - the two halves
  // only work together.
  async rewrites() {
    if (!IMGIX_ORIGIN) {
      return []
    }

    return [
      {
        source: '/_img/:path*',
        destination: `${IMGIX_ORIGIN}/:path*`,
      },
    ]
  },
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
    // 320 and 384 added 2026-08-12. The list jumped straight from 240 to
    // deviceSizes[0]=640, so anything needing between those two resolved to
    // 640. On a 412px viewport at DPR 2.625 that hit every small image: the
    // case-study logos in the ticker render ~105px wide (needing ~276px) and
    // were each fetched at w=640. Ten of them were downloading on the same
    // imgix HTTP/2 connection as the LCP hero, competing for its bandwidth.
    imageSizes: [20, 33, 40, 50, 60, 80, 90, 100, 120, 240, 320, 384],
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
