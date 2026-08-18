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

const imgixLoader = ({ src, width, quality }: any) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_IMGIX_URL}${src}`);
  const params = url.searchParams;
  params.set('auto', params.getAll('auto').join(',') || 'format');
  params.set('fit', params.get('fit') || 'max');
  params.set('w', params.get('w') || width.toString());
  params.set('q', (quality && quality.toString()) || '90');
  return url.href;
};

/**
 * FIXED 2026-08-18: this component accepted a `priority` prop, and every caller
 * that renders an above-the-fold image passed it - HeaderImageSplit passes
 * `priority` on the hero - but BOTH return branches hardcoded
 * `priority={false}` and `loading="lazy"`, silently discarding it.
 *
 * The homepage's LCP element is that hero <img>. Lazy-loading it means the
 * browser will not even request it until layout has run, so it is discovered
 * late and downloaded at Low priority behind everything else.
 *
 * The evidence this was the single biggest defect on the page:
 *   lab   - Lighthouse lcp-discovery-insight reported eagerlyLoaded: false and
 *           priorityHinted: false on the LCP image.
 *   field - DebugBear RUM, mobile image-LCP views (n=59, 30 days):
 *           lcpLoadDelay p75 = 1577ms against lcpLoadTime p75 = 474ms. The
 *           browser spent three times longer deciding to start the request than
 *           it spent on the request.
 *
 * Passing `priority` through gives next/image `loading="eager"` +
 * `fetchpriority="high"` + a <link rel=preload> for exactly the images that
 * need it, while every image whose caller does NOT pass it stays lazy, which is
 * what the old hardcoding was presumably trying to achieve.
 */
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
