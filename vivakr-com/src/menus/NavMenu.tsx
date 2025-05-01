'use client';
import VivNavigation from '@/menus/VivNavigation';
import { getNavMenuItems } from '@/data/menu-items';
import { IMenu } from '@/interfaces/i-menu';
import VivListMenu from '@/menus/VivListMenu';
import AccountMenu from './AccountMenu';
import Link from 'next/link';
import styles from './NavMenu.module.css';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { getIpInfomations } from '@/lib/fetchIpInfo';

export default function NavMenu() {
  const menusData: IMenu[] = getNavMenuItems();
  const { user, loading } = useAuth();
  const [hideMembership, setHideMembership] = useState<boolean>(false);

  useEffect(() => {
    const checkIp = async () => {
      const ipAddress = await getIpInfomations();
      if (process.env.NEXT_PUBLIC_MYIP) {
        setHideMembership(ipAddress?.ip === process.env.NEXT_PUBLIC_MYIP);
      } else {
        setHideMembership(false);
      }
    };

    checkIp();
  }, []);

  if (loading) {
    return (
      <nav className="w-full h-[72px] bg-sky-900 border-b-4 border-red-800 flex
                      items-center justify-center text-white opacity-50">
      </nav>
    );
  }

  const isAuthenticated = !!user;

  const filteredMenus = menusData.filter((menu) => {
    if (menu.id === 1 || menu.requiresAuth) {
      return isAuthenticated;
    }
    return true;
  });

  return (
    <nav className={`w-full text-lg h-[72px] bg-sky-900
              text-white flex border-b-4 border-red-800
                justify-center items-center`}>
      {/* 로고 (변경 없음) */}
      <div className="flex flex-shrink-0 items-center pl-10">
        <Link
          href={`/`}
          className={`${styles.viv}
          text-xl
          min-w-28
          py-2 my-2
          rounded-md
          font-bold text-white`}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          CODE
        </Link>
      </div>

      <div className="flex-none flex-grow"></div>

      {/* 데스크탑 메뉴 */}
      <div className="w-full bg-sky-900
                    text-white
                    flex text-base
                    max-md:hidden justify-center items-center">
        {filteredMenus.map((menu, index) => (
          <div key={index}>
            <VivNavigation menu={menu}
              className=" px-4 py-2 hover:border-b-2
                rounded-xl whitespace-nowrap text-nowrap
                hover:border-b-rose-500
                hover:text-rose-400">
              {menu.title}
            </VivNavigation>
          </div>
        ))}
      </div>

      {/* 모바일 햄버거 메뉴 */}
      <div className="md:hidden mr-2">
        <VivListMenu items={filteredMenus} text="" />
      </div>
      {hideMembership && (<AccountMenu />)}
    </nav>
  );
}
