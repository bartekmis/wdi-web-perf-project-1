import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Jedyny powod istnienia tego pliku: doklejenie `no-transform` do Cache-Control
 * na trasach HTML.
 *
 * Cloudflare doklejal do kazdej odpowiedzi HTML snippet `window.__CF$cv$params`,
 * ktory laduje /cdn-cgi/challenge-platform/scripts/jsd/main.js (JS Detections).
 * Skrypt wykonuje sie jako jedno dlugie zadanie ~420 ms i to CALA roznica
 * w wyniku Lighthouse przy Moto G Power / Fast 4G: 85 punktow z nim,
 * 100 bez niego (TBT 568 ms vs 10 ms).
 *
 * `Cache-Control: no-transform` to wylacznik modyfikacji odpowiedzi po stronie
 * Cloudflare. Zmierzone na zywej stronie, na piaciu trasach naraz - korelacja
 * jest jednoznaczna:
 *   /theme      no-transform obecny  -> snippetu NIE ma
 *   /, /contact, /knowledge, /case-studies  bez niego -> snippet jest
 * Kompresja na brzegu dziala dalej (19,7 KB na lączu vs 93,6 KB surowo).
 *
 * Dlaczego middleware, a nie `headers()` w next.config.js: probowalem tak
 * najpierw i zadzialalo TYLKO na /theme. Ta strona nie ma getStaticProps, wiec
 * jest czysto statyczna. Wszystkie pozostale to ISR (`revalidate: 60`) i Next
 * ustawia im Cache-Control sam, przy odpowiedzi, nadpisujac to z konfiguracji.
 *
 * Wartosc jest DOKLADNIE ta, ktora Next ustawia dla tych stron, plus
 * `no-transform`. `s-maxage=60` odpowiada `revalidate: 60`, wiec Cloudflare
 * nadal cache'uje HTML na brzegu (cf-cache-status: HIT, TTFB ~65 ms). Gdyby to
 * zgubic, kazde wejscie szloby do originu, ktory ma TTFB ~500 ms - kosztowaloby
 * to wielokrotnie wiecej, niz daje ta zmiana.
 */
export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set(
    "Cache-Control",
    "max-age=31536000, s-maxage=60, stale-while-revalidate, no-transform"
  );

  // DIAGNOSTYKA 2026-08-18: naglowek-znacznik, zeby rozstrzygnac, czy middleware
  // w ogole sie wykonuje na tych trasach. Jesli `x-mw` jest w odpowiedzi, a
  // `no-transform` nie - to Next nadpisuje Cache-Control dla stron ISR i tedy
  // droga nie prowadzi. Jesli nie ma zadnego z nich - nie zgadza sie matcher.
  response.headers.set("x-mw", "1");

  return response;
}

export const config = {
  // Tylko trasy stron. Pliki z /_next/ maja wlasny, niezmienny Cache-Control
  // (max-age=31536000, immutable) i nie ma powodu go ruszac; /api/ oraz
  // pliki z kropka (favicon.ico, logo.png, robots.txt...) tez zostawiamy.
  matcher: ["/((?!_next/|api/|.*\\.).*)"],
};
