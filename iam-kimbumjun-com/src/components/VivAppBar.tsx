'use client';
import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';

import { AppProvider, Navigation, Router } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

const NAVIGATION: Navigation = [
  {
    segment: 'app-bar',
    title: 'ViV Dashboard',
    children: [
      { kind: 'header', title: 'Main items' },
      { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
      { segment: 'orders', title: 'Orders', icon: <ShoppingCartIcon /> },
      { kind: 'divider' },
      { kind: 'header', title: 'Analytics' },
      {
        segment: 'reports',
        title: 'Reports',
        icon: <BarChartIcon />,
        children: [
          { segment: 'sales', title: 'Sales', icon: <DescriptionIcon /> },
          { kind: 'divider' },
          { segment: 'traffic', title: 'Traffic', icon: <DescriptionIcon /> },
        ],
      },
      { segment: 'integrations', title: 'Integrations', icon: <LayersIcon /> },
    ],
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: { values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536, }, },
});


function useDemoRouter(): Router {
  const pathname = usePathname(); // 현재 경로를 Next.js에서 가져옴
  const router = useRouter();
  const [currentPath, setCurrentPath] = React.useState(pathname || '/app-bar');

  React.useEffect(() => {
    console.log(pathname);
    setCurrentPath(pathname || '/app-bar');
  }, [pathname]);

  const toolpadRouter = React.useMemo(() => {
    return {
      pathname: currentPath,
      searchParams: new URLSearchParams(),
      navigate: (path: string | URL) => {
        const newPath = String(path);
        setCurrentPath(newPath); // Toolpad UI 동기화
        router.push(newPath); // Next.js 라우팅으로 페이지 이동
      },
    };
  }, [currentPath, router]);

  return toolpadRouter;
}


const Skeleton = styled('div')<{ height: number }>(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

export default function VivAppBar(
  { children }: { children: React.ReactNode }
) {
  const router = useDemoRouter();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div>
        {/* 서버에서 렌더링될 기본 HTML */}
        <Skeleton height={200} />
      </div>
    );
  }

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: (
          <Image
            src="/images/viv.webp"
            width={30}
            height={0}
            sizes="100vw"
            style={{ borderRadius: '50%' }}
            alt="-"
          />
        ),
        title: 'ViV',
        homeUrl: '/app-bar',

      }}

      router={router}
      theme={demoTheme}
    >
      <DashboardLayout> {children} </DashboardLayout>
    </AppProvider >
  );
}
