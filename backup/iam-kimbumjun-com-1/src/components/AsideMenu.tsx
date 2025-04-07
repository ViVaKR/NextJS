import { IMenu } from '@/interfaces/i-menu';
import VivNavigation from '@/menus/VivNavigation';
export default function AsideMenu({
  menus,
  title,
}: {
  menus: IMenu[];
  title?: string;
}) {
  return (
    <>
      <aside
        className="flex
                flex-col
                max-md:flex-row
                max-md:justify-evenly
                max-md:text-sm
                bg-slate-700
                text-slate-100
                text-base
                px-4
                py-4
                gap-4">
        {menus.map((menu, idx) => {
          return (
            <div key={idx}>
              <VivNavigation
                menu={menu}
                asLink={true}
                className="
                px-4
                py-2
                hover:text-rose-400">
                {menu.title}
              </VivNavigation>
            </div>
          );
        })}
      </aside>
    </>
  );
}
