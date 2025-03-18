'use client';
import { IMenu } from '@/interfaces/i-menu';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { MouseEvent } from 'react';
interface NavigationProps {
  menu: IMenu;
  asLink?: boolean; //  Link 로 사용할지 버튼으로 사용할지 선택
  className?: string;
  children?: React.ReactNode; // 버튼 텍스트를 외부에서 주입받기 위해 추가
}

export default function VivNavigation({
  menu,
  asLink = true,
  className,
  children,
}: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 가저오기
  const isActive = pathname === menu.url;
  // const isActive =
  //   menu.url === '/'
  //     ? pathname === menu.url // 홈은 정확히 '/'일 때만
  //     : pathname?.includes(menu.url) || pathname?.startsWith(`${menu.url}/`);

  const baseClasses = isActive ? 'text-pink-400' : 'text-amber-50';

  const combinedClasses = className
    ? `${className} ${baseClasses}`
    : baseClasses;

  const handleNavigation = <T extends HTMLElement>(e: MouseEvent<T>) => {
    e.preventDefault(); // 기본 동작 방지
    try {
      router.push(menu.url);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  return asLink ? (
    <Link
      href={menu.url}
      className={combinedClasses}
      onClick={handleNavigation}>
      {children}
    </Link>
  ) : (
    <button
      type="button"
      className={combinedClasses}
      onClick={handleNavigation}>
      {children || 'Go to'}
    </button>
  );
}
