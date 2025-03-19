import React from 'react';
import { IMenu } from '@/interfaces/i-menu';
import AsideMenu from '@/components/AsideMenu';
import { getEtcItems } from '@/data/menu-items';
const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const menus: IMenu[] = getEtcItems();
  return (
    <div className="grid grid-cols-[auto_minmax(250px,1fr)] max-md:grid-cols-1 min-h-screen p-0 m-0">
      <AsideMenu
        menus={menus}
        title={`제목`}
      />
      <main className="flex flex-col h-screen gap-4 p-4">
        <section>{children}</section>
      </main>
    </div>
  );
};

export default Layout;
