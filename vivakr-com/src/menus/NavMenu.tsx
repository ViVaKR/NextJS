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
  }, []); // 빈 의존성 배열: 마운트 시 1회 실행

  // --- 로딩 상태 처리 ---
  // AuthProvider가 사용자 정보를 로드하는 동안(loading === true)에는
  // 메뉴를 제대로 표시하기 어려우므로 로딩 표시 또는 null 반환
  if (loading) {
    // 로딩 중 표시할 내용 (예: 스켈레톤 UI 또는 간단한 메시지)
    // 여기서는 간단히 null을 반환하여 아무것도 렌더링하지 않음
    // 필요하다면 로딩 스피너나 플레이스홀더를 넣을 수 있음
    // return <div>Loading Navigation...</div>;
    return (
      <nav className="w-full h-[72px] bg-sky-900 border-b-4 border-red-800 flex items-center justify-center text-white opacity-50">
        {/* 로딩 상태 표시 (선택적) */}
        {/* <div>Loading...</div> */}
      </nav>
    );
  }

  // --- 로그인 상태 결정 ---
  // 로딩이 끝난 후, user 객체가 null이 아니면 로그인된 상태로 간주
  const isAuthenticated = !!user; // user 객체의 존재 여부로 로그인 상태 판단

  // --- 메뉴 필터링 ---
  // 로그인 상태(isAuthenticated)에 따라 메뉴 항목의 disabled 속성 설정
  // const filteredMenus = menusData.map((menu) => {
  //   if (menu.id === 1) { // '코드작성' 메뉴 ID가 5라고 가정
  //     return { ...menu, disabled: !isAuthenticated }; // 로그인 안했으면 disabled=true
  //   }
  //   return menu; // 다른 메뉴는 그대로 반환
  // });

  // 로그인했고 + 자체 회원('credentials' provider)일 때만 '코드작성' 메뉴를 포함시킴
  const filteredMenus = menusData.filter((menu) => {
    if (menu.id === 1) { // '코드작성' 메뉴 ID가 1이라고 가정
      // user가 존재하고, user.provider가 'credentials'일 때만 true 반환 (메뉴 포함)
      // 만약 자체 로그인 provider 이름이 다르다면 해당 이름으로 변경해야 함
      return isAuthenticated && user?.provider === 'credentials';
    }
    // 다른 메뉴는 항상 포함
    return true;
  });


  // --- 컴포넌트 렌더링 ---
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
          // 각 메뉴 항목 렌더링
          <div key={index}>
            {/* VivNavigation은 내부적으로 menu.disabled 상태를 사용함 */}
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
        {/* VivListMenu에도 업데이트된 filteredMenus 전달 */}
        <VivListMenu items={filteredMenus} text="" />

      </div>

      {/* 회원 메뉴 (AccountMenu) */}
      {/* hideMembership는 IP 기반이므로 그대로 유지 */}
      {/* AccountMenu는 내부적으로 useAuth()를 사용하여 user 정보를 표시할 수 있음 */}
      {hideMembership && (<AccountMenu />)}

    </nav>
  );
}
