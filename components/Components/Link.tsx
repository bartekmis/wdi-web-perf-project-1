import NextLink, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, forwardRef, ReactNode } from 'react';

/**
 * next/link with viewport prefetching turned off by default.
 *
 * WHY THIS WRAPPER EXISTS
 *
 * In the pages router, next/link prefetches every link as soon as it scrolls
 * into the viewport. The homepage has the whole nav plus several case-study
 * cards in the first screen, so that speculation was downloading, on a cold
 * load and at High priority, other routes' `_next/data/*.json` and their page
 * chunks - while the LCP image was still arriving.
 *
 * Measured (Lighthouse 13.4.1, mobile / Moto G Power + Fast 4G, simulate,
 * median of 5, same deploy, prefetch traffic blocked at the network layer):
 *
 *     page weight   995KB -> 887KB   (-108KB)
 *     Speed Index    2256 -> 1947
 *     score            74 -> 78
 *
 * WHAT THIS DOES NOT COST
 *
 * `prefetch={false}` does not mean "never prefetch". In the pages router it
 * disables the VIEWPORT-triggered prefetch only; Next still prefetches on
 * hover and on touchstart. So navigations that a user has actually signalled
 * intent for are still warmed - we only stop paying, on every cold page load,
 * for the dozen links nobody has looked at yet.
 *
 * Pass `prefetch` explicitly to override on a specific link if some route ever
 * genuinely needs eager warming.
 */

type LinkComponentProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children?: ReactNode;
  };

const Link = forwardRef<HTMLAnchorElement, LinkComponentProps>(function Link(
  { prefetch = false, ...props },
  ref
) {
  return <NextLink ref={ref} prefetch={prefetch} {...props} />;
});

export default Link;
