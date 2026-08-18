import NextLink from 'next/link';
import { forwardRef } from 'react';
import type { ComponentProps } from 'react';

/**
 * next/link with viewport prefetching off by default.
 *
 * Next 13's <Link> defaults to `prefetch` = true, which means: as soon as a
 * link scrolls into the viewport, fetch the `_next/data/<build>/<route>.json`
 * payload for it. The homepage has dozens of links above and just below the
 * fold, so a cold load fired a burst of High-priority JSON requests while the
 * LCP hero was still downloading.
 *
 * `prefetch={false}` does NOT disable prefetching altogether: Next still
 * prefetches the route on hover/touchstart, which is where the latency budget
 * for a real navigation actually is. It only stops the speculative
 * on-scroll-into-view burst during initial load.
 *
 * MUST BE forwardRef. This is not stylistic - next/link forwards refs to the
 * underlying <a>, and callers rely on it. Button renders
 * `<Component ref={internalRef}>` with `component={Link}` and then reads
 * `internalRef.current.offsetWidth` in a mount effect. Written as a plain
 * function component, this wrapper silently swallowed the ref, `.current`
 * stayed undefined, and the effect threw
 *   TypeError: Cannot read properties of undefined (reading 'offsetWidth')
 * which React escalated into Next's "Application error: a client-side
 * exception has occurred" - a blank page. It reproduced only on a COLD load
 * (a warm tab rendered fine), so it survived a browser spot-check and was
 * caught by reading Lighthouse's final screenshot, which showed the error page
 * instead of the site, plus an 870KB /_next/image?url=/error.png at High
 * priority in the request list.
 */
const Link = forwardRef<HTMLAnchorElement, ComponentProps<typeof NextLink>>(
  function Link(props, ref) {
    return <NextLink prefetch={false} {...props} ref={ref} />;
  }
);

export default Link;
