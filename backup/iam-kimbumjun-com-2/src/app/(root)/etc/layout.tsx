// src/app/etc/layout.tsx
'use client'
import React from 'react';
import { getEtcItems } from '@/data/menu-items';
import { IMenu } from '@/interfaces/i-menu';
import AsideMenu from '@/components/AsideMenu';
import { ScopedCssBaseline } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const menus: IMenu[] = getEtcItems();
  const pathname = usePathname();
  return (
    <div
      className="grid
                 grid-cols-[auto_minmax(250px,1fr)]
                 max-md:grid-cols-1 md:min-h-screen p-0 m-0">
      <aside className="bg-sky-700">
        <AsideMenu
          menus={menus}
          title={`잡동사니`}
          hidden={false}
        />
      </aside>
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          className="flex flex-col w-full h-screen gap-4 p-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <ScopedCssBaseline>
            {children}
          </ScopedCssBaseline>
        </motion.main>
      </AnimatePresence>
      {/* <main className="flex flex-col h-screen gap-4 p-0">
        <ScopedCssBaseline>
          {children}
        </ScopedCssBaseline>
      </main> */}
    </div >
  );
};

export default Layout;
