import { useEffect, useState, ReactNode } from 'react';
import { MediaItemsContext } from '@/contexts/media-items';
import { MenuContext } from '@/contexts/menu';
import { CaseStudiesContext } from '@/contexts/case-studies';
import { KnowledgeContext } from '@/contexts/knowledge';
import { FormsContext } from '@/contexts/forms';
import { FaqContext } from '@/contexts/faq';
import { PartialsContext } from '@/contexts/partials';
import Loading from '@/components/Components/Loading';

interface CSRWrapperProps {
  children: ReactNode;
}

const CSRWrapper: React.FC<CSRWrapperProps> = ({ children }) => {
  const [globalData, setGlobalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const response = await fetch('/api/global-data');
        if (response.ok) {
          const data = await response.json();
          setGlobalData(data);
        }
      } catch (error) {
        console.error('Failed to fetch global data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  if (loading) {
    return <Loading active={true} />;
  }

  if (!globalData) {
    return <div>Error loading global data</div>;
  }

  return (
    <MenuContext.Provider value={globalData.menus}>
      <MediaItemsContext.Provider value={globalData.mediaItems}>
        <FormsContext.Provider value={globalData.forms}>
          <PartialsContext.Provider value={globalData.partials}>
            <CaseStudiesContext.Provider value={globalData.caseStudies}>
              <KnowledgeContext.Provider value={globalData.knowledgeArticles}>
                <FaqContext.Provider value={globalData.faqs}>
                  {children}
                </FaqContext.Provider>
              </KnowledgeContext.Provider>
            </CaseStudiesContext.Provider>
          </PartialsContext.Provider>
        </FormsContext.Provider>
      </MediaItemsContext.Provider>
    </MenuContext.Provider>
  );
};

export default CSRWrapper;