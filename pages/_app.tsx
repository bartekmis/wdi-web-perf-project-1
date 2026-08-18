import type { AppProps } from 'next/app';
import Head from 'next/head';
import localFont from 'next/font/local';

import '@/styles/globals.scss';
import Layout from '@/components/Layout/Layout';
import { MenusList } from '@/types/menu';
import { MediaItemsContext } from '@/contexts/media-items';
import { MenuContext } from '@/contexts/menu';
import { CaseStudiesContext } from '@/contexts/case-studies';
import { KnowledgeContext } from '@/contexts/knowledge';
import { FormsContext } from '@/contexts/forms';
import { FaqContext } from '@/contexts/faq';
import { PartialsContext } from '@/contexts/partials';
import CursorContextProvider from '@/contexts/cursor';
import useFullheightVieportCalculation from '@/hooks/window-height';
import useAnimationOnScroll from '@/hooks/animation-on-scroll';
import useHashLinkScroll from '@/hooks/hash-links-scroll';
import Analytics from '@/components/Components/Analytics';
import CurtainsContextProvider from '@/contexts/curtains';

// REMOVED 2026-07-28: the three italic faces (Archivo-RegularItalic,
// -MediumItalic, -BoldItalic). DO NOT RE-ADD unless something actually renders
// italic text - next/font preloads EVERY declared face, so each unused entry
// becomes a <link rel=preload as=font> at High priority in <head>.
// Evidence they were dead weight: WebPageTest's font table reported
// status "unloaded" for all three italic faces in all 3 runs, and the repo
// contains no `font-style: italic` and no <em>/<i> in the rendered homepage
// (the only two hits are Tailwind's `not-italic`).
// Cost removed: 57,632 B of woff2 (19,756 + 18,488 + 19,388) fetched at
// ~882-894ms, competing with the critical CSS for the same connections.
// Cleanup, not a measured win - not isolated in the A/B.
const fontArchivo = localFont({
  src: [
    {
      path: '../assets/fonts/Archivo-Regular.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../assets/fonts/Archivo-Medium.woff2',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../assets/fonts/Archivo-Bold.woff2',
      style: 'normal',
      weight: '700',
    },
  ],
  variable: '--font-archivo',
  // ZMIANA 2026-08-18: `preload: false`.
  // Archivo nie renderuje sie NIGDZIE. Sprawdzone na zywej stronie przez
  // DevTools MCP: z 372 elementow z tekstem wszystkie 372 licza sie do
  // `__Roboto_Slab_*`, a `document.fonts` raportuje wszystkie trzy kroje
  // Archivo jako "unloaded" po pelnym zaladowaniu strony. Powod: `body`
  // ustawia Roboto Slab jako pierwszy krok w font-family, a nic nie uzywa
  // tailwindowej klasy `font-sans`.
  // Mimo to next/font preloadowal wszystkie trzy pliki woff2 (3 x ~18,5 KB
  // = 55,5 KB) z priorytetem High, prosto w <head> - czyli w tym samym oknie,
  // w ktorym sciaga sie blokujacy render CSS (18,9 KB) i obrazek LCP.
  // Przy przepustowosci, jaka Lighthouse symuluje dla 4G, te 55,5 KB to
  // ~280 ms zabrane pierwszemu malowaniu za font, ktorego nikt nie widzi.
  // Deklaracja zostaje (gdyby ktoras strona jednak uzyla `font-sans`) -
  // bez preloadu przegladarka pobierze plik tylko wtedy, gdy naprawde
  // bedzie potrzebny.
  preload: false,
});

// ZMIANA 2026-08-18: Roboto Slab zszedl z <link rel=stylesheet> do
// fonts.googleapis.com (patrz _document.tsx) na plik hostowany u nas.
// Powody, po kolei:
//  1. Tamten <link> byl arkuszem BLOKUJACYM RENDER na obcym originie - przed
//     pierwszym pikselem trzeba bylo zrobic DNS + TCP + TLS do googleapis.com,
//     pobrac CSS, a dopiero z niego wychodzil request po woff2 na gstatic.com
//     (lancuch krytyczny o dlugosci 2 na obcych hostach). DevTools MCP wycenil
//     blokery renderowania na 777 ms FCP.
//  2. Mial `display=block`, czyli do 3 s niewidocznego tekstu; DevTools MCP
//     osobno wycenil to na 475 ms FCP (insight FontDisplay).
//
// POPRAWKA po nieudanym deployu: najpierw bylo tu `next/font/google`, ktore
// pobiera woff2 W TRAKCIE BUILDU. Na runnerze GitHub Actions te requesty
// poszly w ETIMEDOUT do fonts.gstatic.com i build sie wywalil
// ("Failed to fetch `Roboto Slab` from Google Fonts"). Plik lezy wiec teraz
// w repo i `next/font/local` bierze go z dysku - build nie ma juz zadnej
// zaleznosci sieciowej, a wynik dla przegladarki jest identyczny.
//
// To jeden plik zmiennego kroju (os wagi 400-700), subset `latin` - dokladnie
// ten sam, ktory pobieral wczesniej next/font/google.
const fontRobotoSlab = localFont({
  src: '../assets/fonts/RobotoSlab-Variable-latin.woff2',
  weight: '400 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-roboto-slab',
  // Roboto Slab renderuje CALY tekst na stronie, ale nadal nie preloadujemy go
  // z <head>. Element LCP to zdjecie w headerze, nie tekst, a jego
  // `resourceLoadDuration` to 2419 ms z 3212 ms calego LCP - obrazek nie czeka
  // na serwer, tylko dzieli pasmo z wszystkim innym. Przy `display: swap`
  // i metrykach fallbacku tekst pojawia sie od razu krojem zastepczym
  // o dopasowanych metrykach (CLS = 0) i podmienia sie, gdy plik dojedzie.
  preload: false,
  adjustFontFallback: 'Times New Roman',
})

export const App = ({
  Component,
  pageProps,
}: AppProps & { menus: MenusList }) => {
  useFullheightVieportCalculation();
  useAnimationOnScroll();
  useHashLinkScroll();

  return (
    <>
      <CurtainsContextProvider>
        <CursorContextProvider>
          <MenuContext.Provider value={pageProps.menus}>
            <MediaItemsContext.Provider value={pageProps.mediaItems}>
              <FormsContext.Provider value={pageProps.forms}>
                <PartialsContext.Provider value={pageProps.partials}>
                  <CaseStudiesContext.Provider value={pageProps.caseStudies}>
                    <KnowledgeContext.Provider
                      value={pageProps.knowledgeArticles}
                    >
                      <FaqContext.Provider value={pageProps.faqs}>
                        <style jsx global>
                          {`
                            :root {
                              --font-archivo: ${fontArchivo.style.fontFamily};
                              --font-roboto-slab: ${fontRobotoSlab.style
                                .fontFamily};
                            }
                          `}
                        </style>

                        <Head>
                          <meta
                            name='viewport'
                            content='width=device-width, initial-scale=1'
                          />
                          <link rel='icon' href='/favicon.ico' />
                        </Head>
                        <Analytics />
                        <Layout>
                          <Component {...pageProps} />
                        </Layout>
                      </FaqContext.Provider>
                    </KnowledgeContext.Provider>
                  </CaseStudiesContext.Provider>
                </PartialsContext.Provider>
              </FormsContext.Provider>
            </MediaItemsContext.Provider>
          </MenuContext.Provider>
        </CursorContextProvider>
      </CurtainsContextProvider>
    </>
  );
};

export default App;
