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

// Content images are requested from OUR origin at /_img/*, which next.config.js
// rewrites to imgix. imgix still does every transformation; we only change
// which hostname the browser talks to, so the image reuses the connection the
// document already opened and can be prioritised against the page's own
// resources instead of racing them from a separate origin.
//
// FORMAT IS PINNED TO WEBP ON PURPOSE - DO NOT REPLACE `fm` WITH `auto=format`.
// `auto=format` picks AVIF/WebP/JPEG from the request's Accept header and sets
// `Vary: Accept`. imgix's own CDN honours that; Cloudflare, which is now in
// front of these responses because they are served from our hostname, ignores
// Vary except Accept-Encoding unless "Vary for Images" (Pro+) is enabled.
// Reproduced against production previously: prime the cache from an
// AVIF-capable client, then request the same URL with an Accept header that
// does not include AVIF, and Cloudflare replies HIT with content-type
// image/avif - a broken hero for any browser without AVIF support.
// WebP rather than AVIF because it is ~97.6% supported vs ~94.5% (Edge only
// shipped AVIF in 121). Cost is ~25KB on the hero. Pinning one format also
// makes imgix drop Vary entirely, so there is a single cacheable variant.
// TO GET AVIF BACK: enable Cloudflare "Vary for Images", then swap the `fm`
// block for `params.set('auto', 'format')`.
const imgixLoader = ({ src, width, quality }: any) => {
  // Parsed against a dummy base purely so URLSearchParams can do the work;
  // only the path + query are used in the returned same-origin URL.
  const url = new URL(`https://imgix.invalid${src.startsWith('/') ? '' : '/'}${src}`);
  const params = url.searchParams;
  params.set('fit', params.get('fit') || 'max');
  params.set('w', params.get('w') || width.toString());
  params.set('q', (quality && quality.toString()) || '90');

  // SVGs are excluded: `fm` would rasterise them. They carry only
  // `Vary: Accept-Encoding`, which Cloudflare does honour.
  if (!/\.svg$/i.test(url.pathname)) {
    params.set('fm', params.get('fm') || 'webp');
  }

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
    // Honour the caller's `priority`. Until 2026-08-17 both branches below
    // hardcoded `priority={false}` + `loading="lazy"`, which silently discarded
    // the `priority` every caller passed - including HeaderImageSplit, whose
    // image IS the LCP element on the homepage.
    //
    // Measured cost of that (Lighthouse 13, mobile/simulate, Moto G Power +
    // Fast 4G), `lcp-discovery-insight` on the hero <img>:
    //     eagerlyLoaded   false   <- "LCP resources should not use loading=lazy"
    //     priorityHinted  false   <- "fetchpriority=high should be applied"
    // A lazy LCP image is not discoverable by the preload scanner, so it was not
    // even requested until layout had run and the element was near the viewport.
    //
    // next/image turns `priority` into loading="eager" + fetchpriority="high"
    // and, for a non-lazy image, emits a <link rel=preload> in <head> - which is
    // what puts the hero on the wire during the document parse instead of after
    // hydration. Passing `loading` alongside `priority` is a runtime warning in
    // next/image, so let `priority` drive it and only set `loading` when the
    // image is NOT priority.
    const priorityProps = priority
      ? ({ priority: true } as const)
      : ({ priority: false, loading: 'lazy' } as const);

    // Omit `sizes` entirely when the caller did not give one. This used to pass
    // `sizes=""`, which is not the same thing: any `sizes` attribute puts
    // next/image on its responsive path, where the srcset is built from the
    // full deviceSizes list, and an empty value makes the browser fall back to
    // assuming the image is 100vw - so it picks a candidate sized for the whole
    // viewport. That is how the case-study logos, which render at ~105px inside
    // a `max-w-[144px]` box, were each being fetched at w=640:
    //     roald-dahl 20.8KB, toyota 20.0KB, criteo 15.0KB, Netflix-Logo 13.0KB,
    //     adobe 8.9KB, cadbury 4.7KB   (~78KB, all at w=640)
    // With no `sizes`, next/image uses the fixed-size path instead and builds
    // the srcset as [width, width*2] against imageSizes, which is what an image
    // with known width/height actually wants.
    // These now share the document's connection (they are same-origin via
    // /_img/*), so oversizing them costs the LCP image directly.
    const sizesProp = sizes ? { sizes } : {};

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
          {...priorityProps}
          id={elementId || ''}
          data-sampler={dataSampler || ''}
          {...sizesProp}
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
          {...priorityProps}
          id={elementId || ''}
          data-sampler={elementId || ''}
          {...sizesProp}
          onLoadingComplete={onLoadingComplete}
        ></Image>
      );
    }
  } else {
    return <></>;
  }
});

export default ContentImage;
