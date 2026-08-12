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
});

export const App = ({
  Component,
  pageProps,
}: AppProps & { menus: MenusList }) => {
  useFullheightVieportCalculation();
  useAnimationOnScroll();
  useHashLinkScroll();

  // REMOVED 2026-08-12: a useEffect that busy-looped for 300ms right after
  // hydration (added by 3f9eae0 as a course demo). It ran on the main thread
  // during the exact window Lighthouse measures TBT, so every ms of it landed
  // in the score. Nothing depended on it. DO NOT RE-ADD.

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
