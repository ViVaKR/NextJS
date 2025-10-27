'use client';
import { IMenu } from '@/interfaces/i-menu';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { MouseEvent } from 'react';

interface NavigationProps {
  menu: IMenu;
  className?: string;
  children?: React.ReactNode;
}

export default function VivNavigation({
  menu,
  className,
  children,
}: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === menu.url;
  const isDisabled = menu.disabled || false;
  const baseClasses = isActive ? 'text-pink-400' : 'text-amber-50';
  const disabledClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : baseClasses;
  const combinedClasses = className
    ? `${className} ${baseClasses} ${disabledClasses}`
    : `${baseClasses}  ${disabledClasses}`;

  const handleNavigation = <T extends HTMLElement>(e: MouseEvent<T>) => {
    e.preventDefault();
    if (isDisabled) return;
    router.push(menu.url);
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
