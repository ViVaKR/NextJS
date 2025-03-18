import React from 'react';
import { getEtcItems } from '@/data/menu-items';
import { IMenu } from '@/interfaces/i-menu';
import AsideMenu from '@/components/AsideMenu';

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const menus: IMenu[] = getEtcItems();
  return (
    <div className="grid grid-cols-[auto_minmax(250px,1fr)] max-md:grid-cols-1 md:min-h-screen p-0 m-0">
      <AsideMenu
        menus={menus}
        title={`잡동사니`}
      />
      <main className="flex flex-col h-screen gap-4 p-4">
        <section>{children}</section>
      </main>
    </div>
  );
};

export default Layout;
