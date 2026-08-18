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
// `quality` zbite z domyslnych 90 na 60. Krzywa zmierzona na obrazku LCP
// (w=640, AVIF): q=90 43,2 KB / q=72 39,7 KB / q=65 36,9 KB / q=60 34,3 KB /
// q=50 28,0 KB. Przy AVIF-ie q=60 na kadrze 640 px na telefonie jest
// nieodroznialne od q=90, a to jedyny zasob, ktorego WLASNY czas pobierania
// jest metryka LCP (resourceLoadDuration to 2072 ms z 2853 ms calego LCP).
const imgixLoader = ({ src, width, quality }: any) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_IMGIX_URL}${src}`);
  const params = url.searchParams;
  // COFNIETE 2026-08-18: probowalem tu `auto=format,compress`. NIE DODAWAC.
  // Zmierzone na obrazku LCP (w=640, Accept: image/avif), rozmiar odpowiedzi:
  //   q=72  format 39 727 B   format,compress 40 862 B
  //   q=60  format 34 292 B   format,compress 35 314 B
  // `auto=format` i tak oddaje juz AVIF-a; `compress` doklada wlasny przebieg,
  // ktory na tym materiale konsekwentnie DODAJE ~1 KB zamiast oszczedzac.
  params.set('auto', params.getAll('auto').join(',') || 'format');
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
          quality={60}
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
          quality={60}
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
