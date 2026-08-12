import Image from 'next/image';
import { forwardRef, useContext } from 'react';

import { MediaItemsContext } from '@/contexts/media-items';

type MediaDetails = {
  file: string;
  width: number;
  height: number;
  sizes: string;
};

type MediaItem = {
  mediaDetails: MediaDetails;
  altText: string;
  databaseId: number;
  sourceUrl: string;
};

// Returns a SAME-ORIGIN url. `/_img/*` is rewritten to the imgix origin in
// next.config.js, so imgix still resizes and negotiates the format - the only
// thing that changes is which connection the browser fetches over.
//
// This exists because the LCP image was costing a whole extra DNS+TCP+TLS
// handshake on a second origin. See the long comment on `rewrites()` in
// next.config.js; the two halves only work together, so revert them together.
const imgixLoader = ({ src, width, quality }: any) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_IMGIX_URL}${src}`);
  const params = url.searchParams;
  params.set('fit', params.get('fit') || 'max');
  params.set('w', params.get('w') || width.toString());
  params.set('q', (quality && quality.toString()) || '90');

  // `fm=webp` instead of `auto=format`. This is a CORRECTNESS requirement of
  // serving images through our own hostname, not a preference.
  //
  // `auto=format` makes imgix pick AVIF/WebP/JPEG from the request's Accept
  // header, and it marks the response `Vary: Accept`. imgix's own CDN honours
  // that. Cloudflare does NOT - it ignores Vary for everything except
  // Accept-Encoding unless you are on a plan with "Vary for Images" enabled.
  // Verified against production after the /_img rewrite went live: priming the
  // cache with an AVIF-capable client and then requesting the same URL with
  // `Accept: image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5` returned
  // `cf-cache-status: HIT` with `content-type: image/avif` - a browser that
  // cannot decode AVIF would have shown a broken hero.
  //
  // Pinning one format removes the Vary entirely (imgix stops sending it), so
  // there is only ever one variant to cache and every client gets something it
  // can render. WebP rather than AVIF because AVIF is ~94.5% supported (Edge
  // only shipped it in 121) against WebP's ~97.6%, which covers every browser
  // capable of running this app. It costs ~25KB on the hero: 68,738B vs
  // 43,182B at w=640.
  //
  // If Cloudflare's "Vary for Images" is ever enabled, revert to
  // `params.set('auto', 'format')` and delete this block to get AVIF back.
  //
  // SVGs are left alone: forcing a raster format would rasterise the logos,
  // and they are already small and format-invariant.
  if (!url.pathname.toLowerCase().endsWith('.svg')) {
    params.set('fm', 'webp');
  }

  // Keep imgix's path (it includes the /app/uploads prefix) and its query,
  // drop only the origin - `/_img/*` is rewritten back to imgix in
  // next.config.js.
  return `/_img${url.pathname}${url.search}`;
};

const ContentImage = forwardRef(function ContentImage(
  {
    id,
    className,
    width,
    height,
    priority,
    elementId,
    dataSampler,
    onLoadingComplete,
    sizes,
    isLocal,
  }: {
    id: string;
    className?: string;
    width?: number;
    height?: number;
    priority?: boolean;
    elementId?: string,
    dataSampler?: string,
    onLoadingComplete?: any,
    sizes?: string
    isLocal?: boolean,
  },
  ref: any
) {
  const mediaItems = useContext(MediaItemsContext) as MediaItem[];
  const item = mediaItems?.find((item) => item.databaseId.toString() === id);

  if (!item) {
    return <></>;
  }

  // handle empty filepath, width and height of SVG files
  if (
    !item.mediaDetails.file &&
    item.sourceUrl &&
    process.env.NEXT_PUBLIC_MEDIA_URL
  ) {
    item.mediaDetails.file = item.sourceUrl.replace(
      process.env.NEXT_PUBLIC_MEDIA_URL,
      ''
    );
  }

  if (width) {
    item.mediaDetails.width = width;
  }

  if (height) {
    item.mediaDetails.height = height;
  }

  if (sizes) {
    item.mediaDetails.sizes = sizes;
  }

  if (
    item.mediaDetails.file &&
    item.mediaDetails.width &&
    item.mediaDetails.height
  ) {
    if (process.env.NEXT_PUBLIC_IMGIX_URL && !isLocal) {
      return (
        <Image
          ref={ref}
          className={className}
          src={`${item.mediaDetails.file}`}
          loader={imgixLoader}
          alt={item.altText}
          width={item.mediaDetails.width}
          height={item.mediaDetails.height}
          // Honour the caller's `priority`. next/image derives both
          // loading="eager" and fetchpriority="high" from it, so do NOT also
          // pass `loading` here - setting both throws at runtime.
          priority={!!priority}
          id={elementId || ''}
          data-sampler={dataSampler || ''}
          sizes={sizes || ''}
          onLoadingComplete={onLoadingComplete}
        ></Image>
      );
    } else {
      return (
        <Image
          ref={ref}
          className={className}
          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.mediaDetails.file}`}
          alt={item.altText}
          width={item.mediaDetails.width}
          height={item.mediaDetails.height}
          priority={!!priority}
          id={elementId || ''}
          data-sampler={elementId || ''}
          sizes={sizes || ''}
          onLoadingComplete={onLoadingComplete}
        ></Image>
      );
    }
  } else {
    return <></>;
  }
});

export default ContentImage;
