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
//
// 2026-08-17 - WHICH FACES GET PRELOADED, AND WHY IT IS STILL ALL THREE.
// next/font preloads every face declared in one localFont() call (`preload`
// defaults to true, `display` to swap), so the question "preload only the
// critical ones" is really "which faces render above the fold".
// Measured on the live page, mobile 412x823x1.75, walking every text node
// intersecting the first viewport and reading its computed font-weight (the
// CookieYes overlay excluded, since it is moving into GTM):
//     400  x10  nav items - "Team", "Office Furniture Overview"
//     500  x8   nav + every .headline-* class (@apply font-medium)
//     700  x2   buttons - "Contact", "Book a consultation"
// All three are above the fold, so all three stay preloaded. Dropping one
// would trade ~18KB of same-origin woff2 (one HTTP/2 stream on a connection
// the document has already opened) for a visible FOUT on above-fold text,
// because `display: swap` would then paint that text in Trebuchet/Arial first.
// The faces that WERE waste are already gone: the four italics above, and the
// two Roboto Slab woff2 that fonts.gstatic.com served for a family this design
// never used (see _document.tsx). assets/fonts/ still holds SemiBold and the
// italics on disk - next/font only emits what is declared here, so they cost
// nothing. Do not declare a face without checking it renders somewhere.
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
});

export const App = ({
  Component,
  pageProps,
}: AppProps & { menus: MenusList }) => {
  useFullheightVieportCalculation();
  useAnimationOnScroll();
  useHashLinkScroll();

  // REMOVED 2026-08-17: a `while (performance.now() - started < 300) {}` busy
  // loop that ran on mount. It was a deliberate 300ms block of the main thread
  // during hydration - i.e. squarely inside the window that holds the first
  // paint and feeds Total Blocking Time. Nothing depended on `acc`; the
  // `if (acc < 0) console.log(acc)` guard existed only to stop the optimiser
  // eliminating the loop. It is a demo artefact, not application code.

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
