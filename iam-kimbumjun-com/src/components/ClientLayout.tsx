// src/components/ClientLayout.tsx
'use client';
import { useState } from 'react';
import { ICode } from '@/interfaces/i-code';
import { ICategory } from '@/interfaces/i-category';
import CategoryAccordion from '@/components/CategoryAccordion';
import Link from 'next/link';

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
  const [isCollapsed, setIsCollapsed] = useState(false); // 토글 상태

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev); // 토글
  };

  const hide = isCollapsed ? 'hidden' : '';
  const gridClass = isCollapsed
    ? 'grid grid-cols-1 min-h-screen p-2'
    : 'grid grid-cols-[300px_minmax(200px,1fr)] min-h-screen p-2';
  return (
    <div className={gridClass}>
      <nav
        className="col-span-2
        max-w-full
        flex justify-evenly
        text-xs
        text-slate-600
        border-b-1
        border-slate-200
        mb-2">
        {/*  */}
        <button
          type="button"
          className="cursor-pointer
          hover:text-red-600
          start-0 shrink"
          onClick={handleToggle}>
          <span className="material-symbols-outlined">
            {isCollapsed ? 'last_page' : 'first_page'}
          </span>
        </button>
        {/*  */}
        <Link
          href="/code"
          className="hover:text-red-600 shrink">
          <span className="material-symbols-outlined">in_home_mode</span>
        </Link>
        {/*  */}
        <Link
          href="/code/create"
          className="hover:text-red-600 shrink">
          <span className="material-symbols-outlined">edit_document</span>
        </Link>
      </nav>
      {/* Left Menu */}
      <aside className={`start-0 flex flex-col gap-1 mr-2 ${hide}`}>
        <span className={`max-h-[800px] overflow-y-scroll`}>
          <CategoryAccordion
            categories={categories}
            codes={codes}
          />
        </span>
      </aside>

      {/*  */}
      <main className="max-md:start-0 start-1 w-full h-screen overflow-x-scroll">
        {children}
      </main>
    </div>
  );
}
