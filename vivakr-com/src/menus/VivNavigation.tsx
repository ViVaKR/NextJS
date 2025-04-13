'use client';
import { IMenu } from '@/interfaces/i-menu';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { MouseEvent } from 'react';

interface NavigationProps {
  menu: IMenu;
  className?: string;
  children?: React.ReactNode; // 버튼 텍스트를 외부에서 주입받기 위해 추가
}

export default function VivNavigation({
  menu,
  className,
  children,
}: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 가저오기
  const isActive = pathname === menu.url;
  const isDisabled = menu.disabled || false; // disabled 속성 기본값 false

  // 기본 클래스 설정
  const baseClasses = isActive ? 'text-pink-400' : 'text-amber-50';
  const disabledClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : baseClasses;
  const combinedClasses = className
    ? `${className} ${baseClasses} ${disabledClasses}`
    : `${baseClasses}  ${disabledClasses}`;

  const handleNavigation = <T extends HTMLElement>(e: MouseEvent<T>) => {
    e.preventDefault(); // 기본 동작 방지
    if (isDisabled) return; // 비활성화 상태면 동작 중지
    try {
      router.push(menu.url);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  return (!isDisabled &&
    <Link
      href={menu.url}
      className={combinedClasses}
      onClick={handleNavigation}>
      {children}
    </Link>
  )
}
