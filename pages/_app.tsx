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

const fontArchivo = localFont({
  src: [
    {
      path: '../assets/fonts/Archivo-Regular.woff2',
      style: 'normal',
      weight: '400',
    },
    {
      path: '../assets/fonts/Archivo-RegularItalic.woff2',
      style: 'italic',
      weight: '400',
    },
    {
      path: '../assets/fonts/Archivo-Medium.woff2',
      style: 'normal',
      weight: '500',
    },
    {
      path: '../assets/fonts/Archivo-MediumItalic.woff2',
      style: 'italic',
      weight: '500',
    },
    {
      path: '../assets/fonts/Archivo-Bold.woff2',
      style: 'normal',
      weight: '700',
    },
    {
      path: '../assets/fonts/Archivo-BoldItalic.woff2',
      style: 'italic',
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
