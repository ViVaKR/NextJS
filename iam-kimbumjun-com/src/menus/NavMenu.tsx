'use client'
import VivNavigation from '@/menus/VivNavigation';
import { getNavMenuItems } from '@/data/menu-items';
import { IMenu } from '@/interfaces/i-menu';
import VivListMenu from '@/menus/VivListMenu';
import AccountMenu from './AccountMenu';
import Link from 'next/link';
import styles from './NavMenu.module.css';
import { IIpInfo } from '@/interfaces/i-ip-info';
import { useEffect, useState } from 'react';

const api = process.env.NEXT_PUBLIC_IPINFO_URL2;
async function getInfo(): Promise<IIpInfo> {
  const response = await fetch(`${api}/api/ip`);
  const data: IIpInfo = await response.json();
  return data;
}

export default function NavMenu() {
  const menus: IMenu[] = getNavMenuItems();
  const [hideMembership, setHideMembership] = useState<boolean>(false);

  useEffect(() => {
    const checkIp = async () => {
      const rs = await getInfo();
      setHideMembership(rs.ip === process.env.NEXT_PUBLIC_MYIP);
    }
    checkIp();

  }, []);

  return (
    <nav
      className={`w-full
                text-lg
                h-[72px]
              bg-sky-900
              text-white
                flex
                border-b-4
              border-red-800
                justify-center
                items-center`}>
      {/* 로고 */}
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

      <div className="w-full bg-sky-900 text-white flex text-base max-md:hidden justify-center items-center">
        {menus.map((menu) => (
          <div key={menu.id}>
            <VivNavigation menu={menu} asLink={true}
              className=" px-4 py-2 hover:border-b-2
                rounded-xl hover:border-b-rose-500 hover:text-rose-400">
              {menu.title}
            </VivNavigation>
          </div>
        ))}
      </div>

      {/* 햄버거 메뉴에 items 전달 */}
      <div className="md:hidden mr-2">
        <VivListMenu items={menus} text="" />
      </div>

      {/* 회원 메뉴, 아바타, fullName, roles */}
      {hideMembership && (< AccountMenu />)}

    </nav>
  );
}
