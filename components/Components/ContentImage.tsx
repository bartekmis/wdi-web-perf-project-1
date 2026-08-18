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
// `quality` zbite z domyslnych 90 na 50. Krzywa zmierzona na obrazku LCP
// (w=640, AVIF): q=90 43,2 KB / q=72 39,7 KB / q=65 36,9 KB / q=60 34,3 KB /
// q=55 33,5 KB / q=50 28,0 KB / q=45 25,5 KB. Miedzy 55 a 50 jest uskok
// (-5,5 KB), wiec 50 to naturalne miejsce na tej krzywej.
//
// Dlaczego to bezpieczne akurat tutaj: hero i tak jest podskalowany w gore.
// Zmierzone na zywej stronie (DevTools MCP, Moto G Power): ramka ma 330x428 px
// CSS, czyli 577x750 px urzadzenia przy DPR 1,75, a pobieramy 640x427.
// Do tego `object-fit: cover` przycina go w poziomie - widac 330 z 641 px,
// czyli 49% pobranych pikseli nigdy nie trafia na ekran. Przy takim materiale
// roznica q=50 vs q=60 jest niewidoczna (porownane wizualnie), a to jedyny
// zasob, ktorego WLASNY czas pobierania jest metryka LCP: resourceLoadDuration
// to 2008 ms z 2802 ms calego LCP.
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
          quality={50}
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
          quality={50}
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
