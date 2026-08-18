import NextLink from 'next/link';
import type { ComponentProps } from 'react';

/**
 * next/link with viewport prefetching off by default.
 *
 * Next 13's <Link> defaults to `prefetch` = true, which means: as soon as a
 * link scrolls into the viewport, fetch the `_next/data/<build>/<route>.json`
 * payload for it. The homepage has dozens of links above and just below the
 * fold, so a cold load fired a burst of High-priority JSON requests while the
 * LCP hero was still downloading - roughly 74KB of speculative data competing
 * for a 6-connection mobile budget at exactly the wrong moment.
 *
 * `prefetch={false}` does NOT disable prefetching altogether: Next still
 * prefetches the route on hover/touchstart, which is where the latency budget
 * actually is for a real navigation. It only stops the speculative
 * on-scroll-into-view burst during initial load.
 *
 * Callers can still pass `prefetch` explicitly to opt a specific link back in.
 */
const Link = (props: ComponentProps<typeof NextLink>) => (
  <NextLink prefetch={false} {...props} />
);

export default Link;
