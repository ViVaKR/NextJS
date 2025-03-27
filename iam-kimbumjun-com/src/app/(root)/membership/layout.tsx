'use client';
import VivNavigation from '@/menus/VivNavigation';
import { getMembershipItems } from '@/data/menu-items';
import React from 'react';
import { useProfile } from '@/app/(root)/membership/profile/Profile';
import VivListMenu from '@/menus/VivListMenu';

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { user, isLoading: profileLoading, error: profileError } = useProfile();
  // 메뉴 필터링
  const filteredMenus = getMembershipItems().filter((menu) => {
    const isAuthenticated = !!user;
    const userRoles = user?.roles || [];

    // 로그인 필요 조건
    if (menu.requiresAuth && !isAuthenticated) return false;
    // 로그인 시 숨김 조건
    if (menu.hideWhenAuth && isAuthenticated) return false;
    // 역할 기반 필터링
    if (
      menu.requiredRoles &&
      !menu.requiredRoles.some((role) => userRoles.includes(role))
    )
      return false;

    return true;
  });

  return (
    <div className="grid grid-cols-[auto_minmax(250px,1fr)] max-md:grid-cols-1 md:min-h-screen p-0 m-0">
      <div className="md:hidden mr-2 flex justify-center">
        <VivListMenu
          items={filteredMenus}
          text="Membership"
        />
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
        {filteredMenus.map((menu, idx) => {
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
      <div
        className="flex
                      flex-col
                      h-screen
                      bg-slate-50
                      w-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;
