// src/components/ClientLayout.tsx
'use client';
import { useMemo, useState } from 'react';
import { ICode } from '@/interfaces/i-code';
import { ICategory } from '@/interfaces/i-category';
import CategoryAccordion from '@/components/CategoryAccordion';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Tooltip } from '@mui/material';

interface ClientLayoutProps {
  codes: ICode[];
  categories: ICategory[];
  children: React.ReactNode;
}

export default function ClientLayout({
  codes,
  categories,
  children,
}: ClientLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false); // 좌측 메뉴 토글
  const pathname = usePathname();

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev); // 토글
  };

  const hide = isCollapsed ? 'hidden' : '';

  const gridClass = useMemo(() =>
    isCollapsed
      ? 'grid grid-cols-1 min-h-screen p-2'
      : 'grid grid-cols-[300px_minmax(200px,1fr)] min-h-screen p-2',
    [isCollapsed]);

  // * Start Point
  return (
    <div className={gridClass}>

      {/* 상단 아이콘 메뉴 */}
      <div
        className='col-span-2 max-w-full flex justify-evenly text-base border-b-slate-200 border-b-2 mb-2'
      >

        {/* 메뉴 숨김/보기 */}
        <button
          type="button"
          className="cursor-pointer
          hover:text-red-400
          text-slate-400
          start-0 shrink"
          onClick={handleToggle}>
          <Tooltip title={isCollapsed ? '메뉴보기' : '메뉴숨김'} arrow>
            <span className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>
              {isCollapsed ? 'last_page' : 'first_page'}
            </span>
          </Tooltip>
        </button>
        {/* 전체목록 */}
        <Link
          href="/code"
          className="hover:text-red-400 text-slate-400 shrink">
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>in_home_mode</span>
        </Link>

        {/* 글쓰기 */}
        <Link
          href="/code/create"
          className="hover:text-red-400 shrink text-slate-400">
          <span className="material-symbols-outlined" style={{
            fontSize: '1.2rem',
          }}>edit_document</span>
        </Link>
      </div>

      {/* Left Menu */}
      <aside className={`start-0 flex flex-col gap-1 mr-2 ${hide}`}>
        <h5 className='h-12 w-full
                      bg-slate-100
                      rounded-full
                      shadow-cyan-500/50
                      shadow-xs
                      content-center text-center'>
          카테고리
        </h5>
        <span className={`max-h-[80vh] overflow-y-scroll`}>
          <CategoryAccordion
            categories={categories}
            codes={codes}
          />
        </span>
      </aside>

      {/* <main className="max-md:start-0 start-1 w-full h-screen overflow-x-scroll">
        {children}
      </main> */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          className="max-md:start-0 start-1 w-full h-screen overflow-x-scroll"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
