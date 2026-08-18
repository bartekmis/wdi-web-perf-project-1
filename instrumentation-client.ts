// Sentry po stronie przegladarki - inicjalizowany PO zaladowaniu strony.
//
// Dlaczego: `@sentry/nextjs` wchodzil do chunku `pages/_app`, ktory w pomiarze
// Lighthouse wazyl 69,8 KB i startowal 782 ms - razem z obrazkiem LCP.
// W oknie LCP jest lacznie 365 KB, wiec sam Sentry to 19% wszystkich bajtow,
// o ktore konkuruje obrazek decydujacy o metryce. Element LCP nie czeka na
// serwer (TTFB 71 ms) tylko na pasmo: `resourceLoadDuration` to 1951 ms
// z 2733 ms calego LCP.
//
// Czego to NIE psuje: bledy z pierwszych sekund nie gina. Zanim Sentry sie
// zaladuje, zbieramy `error` i `unhandledrejection` do bufora i po inicjalizacji
// odtwarzamy je przez `captureException`, wiec raportowanie bledow jest ciagle
// od pierwszej milisekundy.
//
// Czego to KOSZTUJE: `browserTracingIntegration` startuje po zdarzeniu `load`,
// wiec Sentry nie zarejestruje juz transakcji `pageload` (nawigacje po stronie
// klienta - tak). Wydajnosc jest i tak zbierana przez DebugBear RUM.
// Jesli transakcje pageload w Sentry sa potrzebne, wystarczy cofnac ten plik do
// wersji z `Sentry.init(...)` wywolanym bezposrednio na gorze modulu.

type BufferedEvent = ErrorEvent | PromiseRejectionEvent;

const buffered: BufferedEvent[] = [];
const MAX_BUFFERED = 20;

const collect = (event: Event) => {
  if (buffered.length < MAX_BUFFERED) {
    buffered.push(event as BufferedEvent);
  }
};

const stopCollecting = () => {
  window.removeEventListener("error", collect);
  window.removeEventListener("unhandledrejection", collect);
};

if (typeof window !== "undefined") {
  window.addEventListener("error", collect);
  window.addEventListener("unhandledrejection", collect);

  const init = async () => {
    try {
      const Sentry = await import("@sentry/nextjs");

      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        integrations: [Sentry.browserTracingIntegration()],
        tracesSampleRate: 1,
        tracePropagationTargets: ["localhost", /^\//, /\/graphql/],
        debug: false,
      });

      stopCollecting();

      for (const event of buffered) {
        const error =
          (event as ErrorEvent).error ??
          (event as PromiseRejectionEvent).reason ??
          new Error(String((event as ErrorEvent).message || "Unknown error"));
        Sentry.captureException(error);
      }
      buffered.length = 0;
    } catch {
      // Gdyby chunk Sentry'ego nie dojechal, nie wywracamy strony przez monitoring.
      stopCollecting();
    }
  };

  // Po `load`, a w srodku jeszcze na bezczynnosci watku glownego, zeby nie
  // wejsc w pomiar TBT.
  const schedule = () => {
    const idle = (window as any).requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => void)
      | undefined;
    if (idle) {
      idle(init, { timeout: 5000 });
    } else {
      setTimeout(init, 1000);
    }
  };

  if (document.readyState === "complete") {
    schedule();
  } else {
    window.addEventListener("load", schedule, { once: true });
  }
}
