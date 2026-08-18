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

// ZMIANA 2026-08-18: komponent przyjmowal `priority`, ale go IGNOROWAL -
// na sztywno szlo `priority={false}` i `loading="lazy"`. Efekt: obrazek LCP
// (hero w HeaderImageSplit, wolany z `priority`) byl lazy-loadowany, wiec
// przegladarka w ogole nie widziala go w preload scannerze - dowiadywala sie
// o nim dopiero po zbudowaniu layoutu przez React.
// Pomiar cold-cache (DevTools MCP, Moto G Power 412x823x1.75, Fast 4G, CPU 4x):
// LCP 1251 ms, z czego 450 ms to samo "load delay", czyli czekanie na
// odkrycie zasobu. `priority` daje <link rel=preload> w <head> i fetchpriority=high.
//
// `quality` zbite z domyslnych 90 na 72: imgix przy q=90 oddawal 42 KB AVIF-a
// na kadr 640 px. Roznica 72 vs 90 jest niewidoczna na ekranie telefonu,
// a wazy ok. 40% pliku.
const imgixLoader = ({ src, width, quality }: any) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_IMGIX_URL}${src}`);
  const params = url.searchParams;
  // `compress` obok `format`: imgix dobiera stopien kompresji do zawartosci
  // kadru, zamiast trzymac staly q dla kazdego zdjecia. Na tej stronie liczy sie
  // to podwojnie - obrazek LCP mial `resourceLoadDuration` 2811 ms z 3575 ms
  // calego LCP, czyli caly problem to bajty w locie, a nie czas serwera.
  params.set('auto', params.getAll('auto').join(',') || 'format,compress');
  params.set('fit', params.get('fit') || 'max');
  params.set('w', params.get('w') || width.toString());
  params.set('q', (quality && quality.toString()) || '90');
  return url.href;
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
          priority={!!priority}
          loading={priority ? 'eager' : 'lazy'}
          quality={72}
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
          loading={priority ? 'eager' : 'lazy'}
          quality={72}
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
