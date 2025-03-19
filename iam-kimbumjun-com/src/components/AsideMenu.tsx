import { IMenu } from '@/interfaces/i-menu';
import VivListMenu from '@/menus/VivListMenu';
import VivNavigation from '@/menus/VivNavigation';
import { Tooltip } from '@mui/material';
export default function AsideMenu({
  menus,
  title,
}: {
  menus: IMenu[];
  title?: string;
}) {
  return (
    <>
      <div className="md:hidden mr-2 flex justify-center">
        <Tooltip title={title}>
          <VivListMenu
            items={menus}
            text={title}
          />
        </Tooltip>
      </div>
      <aside
        className="flex
                flex-col
                max-md:hidden
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
                hover:border-b-2
                hover:border-b-rose-400
                hover:!text-rose-400">
                {menu.title}
              </VivNavigation>
            </div>
          );
        })}
      </aside>
    </>
  );
}
