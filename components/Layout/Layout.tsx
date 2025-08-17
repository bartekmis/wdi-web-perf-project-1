import { ReactNode, useContext } from 'react';

import { MenuContext } from '@/contexts/menu';
import { MenusList } from '@/types/menu';
import Footer from './Footer';
import Navigation from './Navigation';
import CustomCursor from '../Components/CustomCursor';
import Device from '@/components/Components/Device';

const Layout = ({ children }: { children: ReactNode }) => {
  const menus = useContext(MenuContext) as MenusList;

  return (
    <>
      <Device>
        {({ isMobile }) => {
          if (!isMobile) {
            return <CustomCursor />
          }
        }}
      </Device>
      {menus?.primary && <Navigation menu={menus.primary} />}
      {children}
      {menus?.footer && (
        <Footer menu={menus.footer} menuSecondary={menus.footer_secondary} />
      )}
    </>
  );
};

export default Layout;
