'use client';
import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { AppProvider, Navigation, Router } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import AirlineStopsOutlinedIcon from '@mui/icons-material/AirlineStopsOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import WebIcon from '@mui/icons-material/Web';
import DataObjectIcon from '@mui/icons-material/DataObject';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import DnsIcon from '@mui/icons-material/Dns';
import TerminalIcon from '@mui/icons-material/Terminal';
import BuildIcon from '@mui/icons-material/Build';
import MemoryIcon from '@mui/icons-material/Memory';
import JavascriptIcon from '@mui/icons-material/Javascript';
import PaletteIcon from '@mui/icons-material/Palette';
import AppsIcon from '@mui/icons-material/Apps';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import CommitIcon from '@mui/icons-material/Commit';
import WidgetsIcon from '@mui/icons-material/Widgets';
import HtmlIcon from '@mui/icons-material/Html';
import CssIcon from '@mui/icons-material/Css';
import FlutterDashIcon from '@mui/icons-material/FlutterDash'; // 예시 아이콘 import
import FestivalOutlinedIcon from '@mui/icons-material/FestivalOutlined';
import { AnimatePresence, motion } from 'framer-motion';

const NAVIGATION: Navigation = [
  {
    segment: 'camp',
    title: 'Camp',
    icon: <ClassOutlinedIcon />,
    children: [
      {
        segment: 'dotnet',
        title: '.NET',
        icon: <DeveloperBoardIcon />,
        children: [
          { kind: 'page', segment: 'home-dotnet', title: 'Home', icon: <FestivalOutlinedIcon /> },
          { kind: 'header', title: '카테고리' },
          {
            segment: 'csharp', title: 'C#', icon: <CategoryOutlinedIcon />,
            children: [
              { segment: 'beginner', title: 'Beginner', icon: < AirlineStopsOutlinedIcon /> },
              { segment: 'intermediate', title: 'Intermediate', icon: < AirlineStopsOutlinedIcon /> },
              { segment: 'advanced', title: 'Advanced', icon: < AirlineStopsOutlinedIcon /> },
            ]
          },
          { segment: 'aspnetcore', title: 'ASP.NET Core', icon: <CategoryOutlinedIcon /> },
          { segment: 'blazor', title: 'Blazor', icon: <CategoryOutlinedIcon /> },
          { segment: 'maui', title: '.NET MAUI', icon: <CategoryOutlinedIcon /> },
          { segment: 'winui', title: 'WinUI', icon: <CategoryOutlinedIcon /> },
          { segment: 'wpf', title: 'WPF', icon: <CategoryOutlinedIcon /> },
          { segment: 'winforms', title: 'Windows Forms', icon: <CategoryOutlinedIcon /> },
          { segment: 'visualbasic', title: 'Visual Basic .NET', icon: <CategoryOutlinedIcon /> },
          { segment: 'vba', title: 'VBA', icon: <CategoryOutlinedIcon /> },
          { segment: 'fsharp', title: 'F#', icon: <CategoryOutlinedIcon /> },
          { segment: 'unity', title: 'Unity', icon: <CategoryOutlinedIcon /> },
          { kind: 'divider' },
        ],
      },
      {
        segment: 'appdev',
        title: 'Application Development',
        icon: <AppsIcon />,
        children: [
          { kind: 'page', segment: 'home-appdev', title: 'Home', icon: <FestivalOutlinedIcon /> },
          { kind: 'header', title: '카테고리' },
          { segment: 'python', title: 'Python', icon: <CategoryOutlinedIcon /> },
          { segment: 'ruby', title: 'Ruby', icon: <CategoryOutlinedIcon /> },
          { segment: 'r', title: 'R', icon: <CategoryOutlinedIcon /> },
          { segment: 'matlab', title: 'MATLAB', icon: <CategoryOutlinedIcon /> },
          { segment: 'scratch', title: 'Scratch', icon: <CategoryOutlinedIcon /> },
          { segment: 'go', title: 'Go', icon: <CategoryOutlinedIcon /> },
          { segment: 'java', title: 'Java', icon: <CategoryOutlinedIcon /> },
          { segment: 'kotlin', title: 'Kotlin', icon: <CategoryOutlinedIcon /> },
          { segment: 'dart', title: 'Dart', icon: <FlutterDashIcon /> },
          { segment: 'php', title: 'PHP', icon: <CategoryOutlinedIcon /> },
          { segment: 'fortran', title: 'Fortran', icon: <CategoryOutlinedIcon /> },
          { segment: 'cobol', title: 'COBOL', icon: <CategoryOutlinedIcon /> },
          { segment: 'swift', title: 'Swift', icon: <CategoryOutlinedIcon /> },
          { kind: 'divider' },

        ],
      },
      {
        segment: 'web-presentation',
        title: 'Web Presentation',
        icon: <PaletteIcon />,
        children: [
          { kind: 'page', segment: 'home-webpresentation', title: 'Home', icon: <FestivalOutlinedIcon /> },
          { kind: 'header', title: '카테고리' },
          { segment: 'html', title: 'HTML', icon: <HtmlIcon /> },
          { segment: 'css-scss-less', title: 'CSS / SCSS / LESS', icon: <CssIcon /> },
          { segment: 'tailwindcss', title: 'TailwindCSS', icon: <CssIcon /> },
          { segment: 'svg', title: 'SVG', icon: <CodeIcon /> },
          { kind: 'divider' },
        ],
      },
      {
        segment: 'javascript-eco',
        title: 'JavaScript Ecosystem',
        icon: <JavascriptIcon />,
        children: [
          { kind: 'page', segment: 'home-jaavascritpeco', title: 'Home', icon: <FestivalOutlinedIcon /> },
          { kind: 'header', title: '카테고리' },
          { segment: 'javascript', title: 'JavaScript', icon: <JavascriptIcon /> },
          { segment: 'typescript', title: 'TypeScript', icon: <CodeIcon /> },
          { segment: 'angular', title: 'Angular', icon: <CodeIcon /> },
          { segment: 'nextjs', title: 'Next.js', icon: <CodeIcon /> },
          { segment: 'react', title: 'React', icon: <CodeIcon /> },
          { segment: 'vite', title: 'Vite', icon: <CodeIcon /> },
          { segment: 'vue', title: 'Vue', icon: <CodeIcon /> },
          { segment: 'nodejs', title: 'Node.js', icon: <TerminalIcon /> },
          { kind: 'divider' },
        ],
      },
      {
        segment: 'devops',
        title: 'DevOps',
        icon: <BuildIcon />,
        children: [
          { kind: 'page', segment: 'home-devops', title: 'Home', icon: <FestivalOutlinedIcon /> },
          { kind: 'header', title: '카테고리' },
          { segment: 'git', title: 'Git', icon: <CommitIcon /> },
          { segment: 'docker', title: 'Docker', icon: <WidgetsIcon /> },
          { kind: 'divider' },
        ],
      },
      {
        segment: 'native',
        title: 'Native Languages',
        icon: <MemoryIcon />,
        children: [
          { kind: 'page', segment: 'home-native', title: 'Home', icon: <FestivalOutlinedIcon /> },
          { kind: 'header', title: '카테고리' },
          { segment: 'assembly', title: 'Assembly', icon: <CodeIcon /> },
          { segment: 'rust', title: 'Rust', icon: <CodeIcon /> },
          { segment: 'c', title: 'C', icon: <CodeIcon /> },
          { segment: 'cpp', title: 'C++', icon: <CodeIcon /> },
          { kind: 'divider' },
        ],
      },
      {
        segment: 'cli',
        title: 'CLI Scripting',
        icon: <TerminalIcon />,
        children: [
          { kind: 'page', segment: 'home-cli', title: 'Home', icon: <FestivalOutlinedIcon /> },
          { kind: 'header', title: '카테고리' },
          { segment: 'powershell', title: 'PowerShell', icon: <TerminalIcon /> },
          { segment: 'bash', title: 'Bash/Zsh', icon: <TerminalIcon /> },
          { segment: 'perl', title: 'Perl', icon: <CodeIcon /> },
          { kind: 'divider' },
        ],
      },
      {
        segment: 'server',
        title: 'Server',
        icon: <StorageIcon />,
        children: [
          //
          {
            segment: 'database',
            title: 'Database Server',
            icon: <StorageIcon />,
            children: [
              { kind: 'page', segment: 'home-databaseserver', title: 'Home', icon: <FestivalOutlinedIcon /> },
              { kind: 'header', title: '카테고리' },
              { segment: 'sqlserver', title: 'SQL Server', icon: <StorageIcon /> },
              { segment: 'postgresql', title: 'PostgreSQL', icon: <StorageIcon /> },
              { segment: 'mysql-mariadb', title: 'MySQL & MariaDB', icon: <StorageIcon /> },
              { segment: 'oracle', title: 'Oracle', icon: <StorageIcon /> },
              { segment: 'mongodb', title: 'MongoDB', icon: <DataObjectIcon /> },
              { kind: 'divider' },
            ],
          },
          {
            segment: 'http-web-server',
            title: 'Web Server',
            icon: <WebIcon />,
            children: [
              { kind: 'page', segment: 'webserver-home', title: 'Home', icon: <FestivalOutlinedIcon /> },
              { kind: 'header', title: '카테고리' },
              { segment: 'nginx', title: 'Nginx', icon: <DnsIcon /> },
              { segment: 'apache', title: 'Apache Server', icon: <CodeIcon /> },
              { segment: 'iis', title: 'Microsoft IIS', icon: <CodeIcon /> },
              { kind: 'divider' },
            ],
          },
          {
            segment: 'dns',
            title: 'DNS Server',
            icon: <DnsIcon />,
            children: [
              { kind: 'page', segment: 'home-dnsserver', title: 'Home', icon: <FestivalOutlinedIcon /> },
              { kind: 'header', title: 'Main items' },
              { segment: 'bind', title: 'BIND', icon: <CodeIcon /> },
              { segment: 'windows-dns', title: 'Windows DNS', icon: <CodeIcon /> },
              { kind: 'divider' },
            ],
          }
        ]
      },
    ]
  },
  {
    segment: 'free-code',
    title: 'Free Code', // 이 메뉴의 성격에 맞는 아이콘 (예: <RedeemIcon /> or <CodeIcon />)
    icon: <CodeOutlinedIcon />,
    children: [
      { kind: 'page', segment: 'home-freecode', title: 'Home', icon: <FestivalOutlinedIcon /> },
      { kind: 'header', title: '카테고리' },
      { segment: 'qna', title: 'QnA', icon: <CodeIcon /> },
      { segment: 'note', title: 'Note', icon: <CodeIcon /> },
      { segment: 'math', title: 'Math', icon: <CodeIcon /> },
      { kind: 'divider' },
    ]
  }
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
  const pathname = usePathname();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div>
        <Skeleton height={200} />
      </div>
    );
  }

  return (
    <div>
      <AppProvider
        navigation={NAVIGATION}
        branding={{
          logo: (
            <Image
              src="/images/viv.webp"
              width={30}
              height={30}
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
        <DashboardLayout>
          <AnimatePresence mode="wait">
            <motion.div key={pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }} >
              {children}
            </motion.div>
          </AnimatePresence>
        </DashboardLayout>
      </AppProvider >

    </div >
  );
}

