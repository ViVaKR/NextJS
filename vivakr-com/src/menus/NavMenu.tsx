'use client';
import VivNavigation from '@/menus/VivNavigation';
import { getNavMenuItems } from '@/data/menu-items';
import { IMenu } from '@/interfaces/i-menu';
import VivListMenu from '@/menus/VivListMenu';
import AccountMenu from './AccountMenu';
import Link from 'next/link';
import styles from './NavMenu.module.css';
import { IIpInfo } from '@/interfaces/i-ip-info';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext'; // 경로는 실제 위치에 맞게 조정!


const api = process.env.NEXT_PUBLIC_IPINFO_URL2;

// IP 정보 가져오는 함수
async function getInfo(): Promise<IIpInfo | undefined> {
  try {
    const response = await fetch(`${api}/api/ip`);
    if (!response.ok) {
      throw new Error(`Failed to fetch IP: ${response.status}`);
    }
    const data: IIpInfo = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting IP info:", error);
    // 기본값 또는 에러 상황에 맞는 객체 반환 (예: 빈 IP)
    // return { ip: '', country: '', city: '' }; // 예시
    return undefined;
  }
}

export default function NavMenu() {
  const menusData: IMenu[] = getNavMenuItems();
  // AuthContext에서 필요한 상태 가져오기
  const { user, loading } = useAuth(); // user 객체와 loading 상태를 가져옴

  const [hideMembership, setHideMembership] = useState<boolean>(false);

  // IP 주소 확인 로직 (마운트 시 한 번 실행)
  useEffect(() => {
    const checkIp = async () => {
      const rs = await getInfo();
      // 환경 변수 값이 있는지 확인 (없으면 비교 불가)
      if (process.env.NEXT_PUBLIC_MYIP) {
        setHideMembership(rs?.ip === process.env.NEXT_PUBLIC_MYIP);
      } else {
        setHideMembership(false); // 환경 변수가 없으면 숨기지 않음 (기본값)
      }
    };

    checkIp();
  }, []);

  if (loading) {
    return (
      <nav className="w-full h-[72px] bg-sky-900 border-b-4 border-red-800 flex items-center justify-center text-white opacity-50">
      </nav>
    );
  }

  const isAuthenticated = !!user; // user 객체의 존재 여부로 로그인 상태 판단

  const filteredMenus = menusData.filter((menu) => {
    if (menu.id === 1) { // '코드작성' 메뉴 ID가 1이라고 가정
      return isAuthenticated;
    }
    return true;
  });
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
