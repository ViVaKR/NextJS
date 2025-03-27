'use client';
import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider, Navigation, Router } from '@toolpad/core/AppProvider';
import { DashboardLayout, DashboardLayoutSlotProps } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import { usePathname, useRouter } from 'next/navigation'; // useRouter 추가
import Image from 'next/image';
import DashboardPage from '@/app/dashboard/page';
import VivSelect from './VivSelect';
import { VivButton } from './VivButton';
import VivDataGrid from './VivDataGrid';
import VivDrawer from './VivDrawer';
import VivBarChart from './VivBarChart';
import { Box, Typography } from '@mui/material';
import { AppTitle } from '@toolpad/core/DashboardLayout/AppTitle';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        kind: 'divider',
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});



function useDemoRouter(): Router {
  const pathname = usePathname(); // 현재 경로를 Next.js에서 가져옴
  const router = useRouter();
  const [currentPath, setCurrentPath] = React.useState(
    pathname || '/dashboard'
  );

  React.useEffect(() => {
    setCurrentPath(pathname || '/dashboard');
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

export default function VivAppBar() {
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

  const renderContent = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return (
          <div>
            <Typography variant="h5" gutterBottom>
              Dashboard
            </Typography>
            <VivBarChart />
          </div>
        );
      case '/orders':
        return <VivBarChart />
      case '/reports/sales':
        return <div>Sales Reports</div>;
      case '/reports/traffic':
        return <div>Traffic Reports</div>;
      case '/integrations':
        return <div>Integrations Content</div>;
      default:
        return (
          <>
            <Typography variant="h4" gutterBottom>
              Welcome
            </Typography>
            <VivBarChart />
          </>
        );
    }
  };

  // function DemoPageContent({ pathname }: { pathname: string }) {
  //   return (
  //     <Box
  //       sx={{
  //         py: 4,
  //         display: 'flex',
  //         flexDirection: 'column',
  //         alignItems: 'center',
  //         textAlign: 'center',
  //       }}
  //     >
  //       {renderContent(pathname)}
  //       {/* <Typography>Dashboard content for {pathname}</Typography>
  //       <VivBarChart /> */}
  //     </Box>
  //   );
  // }

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
      <DashboardLayout> {/* 기본 타이틀 비활성화 */}
        {renderContent(router.pathname)}
        {/* <DemoPageContent pathname={router.pathname} /> */}
        {/* <PageContainer>
          {renderContent()}
        </PageContainer> */}

      </DashboardLayout>
    </AppProvider >
  );
}
