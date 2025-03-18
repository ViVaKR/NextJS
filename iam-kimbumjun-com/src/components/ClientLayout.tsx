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

  // 그리드 클래스 동적 조정
  const gridClasses = isCollapsed
    ? 'grid grid-cols-[0_minmax(auto,1fr)] max-md:grid-cols-1 min-h-screen p-2'
    : 'grid grid-cols-[300px_minmax(300px,1fr)] max-md:grid-cols-1 min-h-screen p-2';

  const hidden = isCollapsed ? 'hidden' : 'max-md:hidden';

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev); // 토글
  };

  return (
    <div className={gridClasses}>

      <nav
        className="col-span-2
        start-0
        grid grid-cols-3
        max-md:grid-cols-2
        w-auto
        gap-2
        text-xs
        text-slate-600
        border-b-1
        border-slate-200
        place-items-stretch
        mb-2">
        <button
          type="button"
          className="cursor-pointer
          hover:text-red-600
          start-0
          max-md:hidden
          text-center"
          onClick={handleToggle} // 클릭 시 토글
        >
          <span className="material-symbols-outlined">
            {isCollapsed ? 'last_page' : 'first_page'}
          </span>
        </button>

        <Link
          href="/code"
          className="hover:text-red-600 max-md:start-0 text-center">
          <span className="material-symbols-outlined">in_home_mode</span>
        </Link>

        <Link
          href="/code/create"
          className="hover:text-red-600 max-md:start-1 text-center">
          <span className="material-symbols-outlined">edit_document</span>
        </Link>
      </nav>
      {/* Left Menu */}

      <aside className="start-0 flex flex-col gap-1 mr-4">

        <div className='bg-slate-200
        h-12 w-full content-center
        text-center text-slate-700
        rounded-xl'>
          space
        </div>

        <span className={`${hidden} max-h-[800px] overflow-y-scroll`} >
          <CategoryAccordion
            categories={categories}
            codes={codes}
          />
        </span>
      </aside>

      <main className="flex flex-col start-1 w-[100%] h-screen ">
        {children}
      </main>
    </div>
  );
}
