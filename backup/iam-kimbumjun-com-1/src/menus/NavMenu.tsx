import VivNavigation from '@/menus/VivNavigation';
import { getEtcItems, getNavMenuItems } from '@/data/menu-items';
import { IMenu } from '@/interfaces/i-menu';
import VivListMenu from '@/menus/VivListMenu';
import AccountMenu from './AccountMenu';
import Link from 'next/link';
import styles from './NavMenu.module.css';
export default function NavMenu() {
  const menus: IMenu[] = getNavMenuItems();
  const etc: IMenu[] = getEtcItems();

  return (
    <nav
      className={`w-full
                text-xl
                h-full
              bg-sky-900
              text-white
                flex
                border-b-4
              border-red-800
                justify-evenly
                items-center`}>
      {/* 로고 */}
      <div className="flex flex-shrink-0 items-center pl-10">
        <Link
          href={`/`}
          className={`${styles.viv}
          text-xl min-w-28
          py-2 my-2 rounded-md
          font-bold text-white`}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          CODE
        </Link>
      </div>

      <div className="flex-none flex-grow"></div>

      <div
        className="w-full
                bg-sky-900
                text-white
                  flex
                  max-md:hidden
                  justify-evenly
                  items-center">
        {menus.map((menu) => (
          <div key={menu.id}>
            {menu.id === 3 ? (
              <VivListMenu
                items={etc}
                text="잡동사니"
                className=" border-2
                border-transparent
                hover:text-rose-400"
              />
            ) : (
              <VivNavigation
                menu={menu}
                asLink={true}
                className="
                px-4
                py-2
                hover:text-rose-400">
                {menu.title}
              </VivNavigation>
            )}
          </div>
        ))}
      </div>

      <div className="flex-none flex-grow"></div>

      {/* 햄버거 메뉴에 items 전달 */}
      <div className="md:hidden mr-4">
        <VivListMenu
          items={menus}
          text=""
        />
      </div>
      {/* 회원 메뉴 */}
      <AccountMenu />
    </nav>
  );
}
