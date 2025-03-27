'use client'
import React from 'react';
import { IMenu } from '@/interfaces/i-menu';
import AsideMenu from '@/components/AsideMenu';
import { getBlogItems } from '@/data/menu-items';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const menus: IMenu[] = getBlogItems();
  const pathname = usePathname(); // 현재 경로 가져오기

  return (
    <div className="grid grid-cols-[auto_minmax(250px,1fr)] max-md:grid-cols-1 min-h-screen p-0 m-0">
      <AsideMenu
        menus={menus}
        title={`Blog`}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="flex flex-col gap-4 p-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Layout;
