'use client';
import { IMenu } from '@/interfaces/i-menu';
import VivListMenu from '@/menus/VivListMenu';
import VivNavigation from '@/menus/VivNavigation';
import { useEffect, useState } from 'react';
export default function AsideMenu({
  menus,
  title,
  hidden = false,
}: {
  menus: IMenu[];
  title?: string;
  hidden?: boolean;
}) {
  const [hide, setHide] = useState<string>('');

  useEffect(() => {
    setHide(hidden ? 'hidden' : '');
  }, [hidden]);

  return (
    <div className="flex flex-col">
      <div className={`${hide} md:hidden flex justify-center`}>
        <VivListMenu
          items={menus}
          text={title}
        />
      </div>
      <aside
        className={`flex
        flex-col
        h-screen
        max-md:hidden
        bg-slate-700
        text-slate-100
        text-base
        px-4
        py-4
        gap-4`}>
        {menus.map((menu, idx) => {
          return (
            <div key={idx}>
              <VivNavigation
                menu={menu}
                asLink={true}
                className="
                px-4
                py-2
                hover:border-b-2
                hover:border-b-rose-400
                hover:!text-rose-400">
                {menu.title}
              </VivNavigation>
            </div>
          );
        })}
      </aside>
    </div>
  );
}
