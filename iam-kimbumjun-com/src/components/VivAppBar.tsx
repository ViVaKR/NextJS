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
import PhpOutlinedIcon from '@mui/icons-material/PhpOutlined';


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
          { kind: 'header', title: 'Category' },
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
          { segment: 'wpf', title: 'WPF', icon: <CategoryOutlinedIcon /> },
          { segment: 'winforms', title: 'Windows Forms', icon: <CategoryOutlinedIcon /> },
          { segment: 'visualbasic-dotnet', title: 'Visual Basic .NET', icon: <CategoryOutlinedIcon /> },
          { segment: 'visualbasic-appl', title: 'VBA', icon: <CategoryOutlinedIcon /> },
          { segment: 'fsharp', title: 'F#', icon: <CategoryOutlinedIcon /> },
          { kind: 'divider' },
          { kind: 'header', title: 'Note' },
        ],
      },
      {
        segment: 'app-development',
        title: 'Application Development',
        icon: <AppsIcon />,
        children: [
          { kind: 'header', title: 'Main items' },
          { segment: 'go', title: 'Go', icon: <CategoryOutlinedIcon /> },
          { segment: 'python', title: 'Python', icon: <CategoryOutlinedIcon /> },
          { segment: 'ruby', title: 'Ruby', icon: <CategoryOutlinedIcon /> },
          { segment: 'r', title: 'R', icon: <CategoryOutlinedIcon /> },
          { segment: 'matlab', title: 'MATLAB', icon: <CategoryOutlinedIcon /> },
          { segment: 'java', title: 'Java', icon: <CategoryOutlinedIcon /> },
          { segment: 'kotlin', title: 'Kotlin', icon: <CategoryOutlinedIcon /> },
          { segment: 'dart-flutter', title: 'Dart & Flutter', icon: <FlutterDashIcon /> },
          { segment: 'swift', title: 'Swift', icon: <CategoryOutlinedIcon /> },
          { segment: 'php', title: 'PHP', icon: <PhpOutlinedIcon /> },
          { segment: 'fortran', title: 'Fortran', icon: <CategoryOutlinedIcon /> },
          { segment: 'scratch', title: 'Scratch', icon: <CategoryOutlinedIcon /> },
        ],
      },
      {
        segment: 'web-presentation',
        title: 'Web Presentation',
        icon: <PaletteIcon />,
        children: [
          { kind: 'header', title: 'Main items' },
          { segment: 'html', title: 'HTML', icon: <HtmlIcon /> },
          { segment: 'css-scss-less', title: 'CSS / SCSS / LESS', icon: <CssIcon /> },
          { segment: 'svg', title: 'SVG', icon: <CodeIcon /> },
          { segment: 'template-engines', title: 'Template Engines', icon: <CodeIcon /> },
        ],
      },
      {
        segment: 'javascript',
        title: 'JavaScript Ecosystem',
        icon: <JavascriptIcon />,
        children: [
          { kind: 'header', title: 'Main items' },
          { segment: 'javascript', title: 'JavaScript', icon: <JavascriptIcon /> },
          { segment: 'typescript', title: 'TypeScript', icon: <CodeIcon /> },
          { segment: 'angular', title: 'Angular', icon: <CodeIcon /> },
          { segment: 'nextjs', title: 'Next.js', icon: <CodeIcon /> },
          { segment: 'react', title: 'React', icon: <CodeIcon /> },
          { segment: 'vue', title: 'Vue', icon: <CodeIcon /> },
          { segment: 'nodejs', title: 'Node.js', icon: <TerminalIcon /> },
        ],
      },
      {
        segment: 'devops',
        title: 'DevOps',
        icon: <BuildIcon />,
        children: [
          { kind: 'header', title: 'Main items' },
          { segment: 'git', title: 'Git', icon: <CommitIcon /> },
          { segment: 'docker', title: 'Docker', icon: <WidgetsIcon /> },
          { kind: 'divider' },
          { kind: 'header', title: 'Note' },
        ],
      },
      {
        segment: 'native-languages',
        title: 'Native Languages',
        icon: <MemoryIcon />,
        children: [
          { kind: 'header', title: 'Main items' },
          { segment: 'assembly', title: 'Assembly', icon: <CodeIcon /> },
          { segment: 'rust', title: 'Rust', icon: <CodeIcon /> },
          { segment: 'c', title: 'C', icon: <CodeIcon /> },
          { segment: 'cpp', title: 'C++', icon: <CodeIcon /> },
          { kind: 'divider' },
          { kind: 'header', title: 'Note' },
        ],
      },
      {
        segment: 'cli-scripting',
        title: 'CLI & Scripting',
        icon: <TerminalIcon />,
        children: [
          { kind: 'header', title: 'Main items' },
          { segment: 'powershell', title: 'PowerShell', icon: <TerminalIcon /> },
          { segment: 'bash-zsh', title: 'Bash/Zsh', icon: <TerminalIcon /> },
          { segment: 'perl', title: 'Perl', icon: <CodeIcon /> },
          { kind: 'divider' },
          { kind: 'header', title: 'Note' },
        ],
      },
      {
        segment: 'database-server',
        title: 'Database Server',
        icon: <StorageIcon />,
        children: [
          { kind: 'header', title: 'Main items' },
          { segment: 'sqlserver', title: 'SQL Server', icon: <StorageIcon /> },
          { segment: 'postgresql', title: 'PostgreSQL', icon: <StorageIcon /> },
          { segment: 'mysql-mariadb', title: 'MySQL & MariaDB', icon: <StorageIcon /> },
          { segment: 'oracle', title: 'Oracle', icon: <StorageIcon /> },
          { segment: 'mongodb', title: 'MongoDB', icon: <DataObjectIcon /> },
        ],
      },
      {
        segment: 'webserver',
        title: 'Web Server',
        icon: <WebIcon />,
        children: [
          { kind: 'header', title: 'Main items' },
          { segment: 'nginx', title: 'Nginx', icon: <DnsIcon /> },
          { segment: 'apache', title: 'Apache HTTP Server', icon: <CodeIcon /> },
          { segment: 'iis', title: 'Microsoft IIS', icon: <CodeIcon /> },
        ],
      },
      {
        segment: 'dnsserver',
        title: 'DNS Server',
        icon: <DnsIcon />,
        children: [
          { kind: 'header', title: 'Main items' },
          { segment: 'bind', title: 'BIND', icon: <CodeIcon /> },
          { segment: 'windows-dns', title: 'Windows Server DNS', icon: <CodeIcon /> },
        ],
      }
    ]
  },
  {
    segment: 'free-code',
    title: 'Free Code', // 이 메뉴의 성격에 맞는 아이콘 (예: <RedeemIcon /> or <CodeIcon />)
    icon: <CodeOutlinedIcon />,
    children: [
      { kind: 'header', title: 'Main items' },
      { segment: 'qna', title: 'QnA', icon: <CodeIcon /> },
      { segment: 'note', title: 'Note', icon: <CodeIcon /> },
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
    <div className=''>
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
    </div>
  );
}



/*
1. 시스템 프로그래밍 언어 (System Programming Languages):

가장 적합하고 널리 쓰이는 분류야. 운영체제, 게임 엔진, 브라우저, 임베디드 시스템 등 하드웨어를 직접 제어하거나 고성능이 필수적인 시스템 소프트웨어를 만드는 데 주로 사용되는 언어들이라는 의미야. Rust, C, C++는 이 분류에 완벽하게 부합하고, Assembly는 시스템 프로그래밍의 가장 낮은 단계에서 사용되니 포함될 수 있어.
2. 네이티브 언어 (Native Languages):

이 언어들은 일반적으로 특정 운영체제나 하드웨어 아키텍처에서 직접 실행될 수 있는 기계어 코드(네이티브 코드)로 컴파일된다는 공통점이 있어. 가상 머신(JVM, CLR 등) 위에서 동작하는 언어(Java, C#)나 인터프리터 언어(Python, JavaScript)와 구분되는 특징이지. 이 분류도 상당히 정확해.
3. 저수준 언어 (Low-Level Languages):

메모리 관리나 하드웨어 제어 같은 저수준의 작업이 가능하다는 특징을 강조하는 이름이야. Assembly는 대표적인 저수준 언어이고, C와 C++도 저수준 제어가 가능하지. Rust는 높은 수준의 추상화와 안전성을 제공하면서도 필요할 때는 저수준 제어를 허용하기 때문에 이 그룹에 포함될 수는 있어. 다만, Rust의 주요 특징이 '저수준'만은 아니라는 점은 고려해야 해.
4. 고성능 언어 (High-Performance Languages):

실행 속도와 효율성이 매우 중요하다는 점에 초점을 맞춘 이름이야. 이 언어들은 모두 성능 면에서 최고 수준을 목표로 하거나 달성할 수 있어. 하지만 '고성능'은 다른 언어들(Fortran, 때로는 Java/C# JIT 컴파일)에도 해당될 수 있어서 위의 분류보다는 덜 구체적일 수 있어.

*/

/*

1. JavaScript 생태계 (JavaScript Ecosystem):

가장 포괄적이고 정확한 표현이야. JavaScript 언어 자체, 그 언어를 확장한 TypeScript, 브라우저 밖에서 실행하게 해주는 Node.js, 그리고 이들을 기반으로 만들어진 각종 프레임워크(Angular, Next.js, Vue)와 라이브러리(React)를 모두 아우르는 이름이야. 개발 도구, 커뮤니티, 패키지 관리자(npm/yarn) 등 관련된 모든 것을 포괄하는 넓은 의미로도 쓰여.
2. 웹 개발 기술 (Web Development Technologies) / 모던 웹 기술 (Modern Web Technologies):

이 기술들이 주로 사용되는 **응용 분야(웹 개발)**에 초점을 맞춘 이름이야. 대부분 웹 프론트엔드나 백엔드(Node.js) 개발에 사용되니까 이것도 아주 적절해. '모던'을 붙이면 최신 트렌드를 반영한다는 느낌을 줄 수 있지.
3. JavaScript 스택 (JavaScript Stack):

웹 애플리케이션을 만들기 위해 함께 사용될 수 있는 기술들의 **묶음(스택)**이라는 점을 강조하는 이름이야. 예를 들어 'MERN 스택'(MongoDB, Express, React, Node.js)처럼, 이 그룹 안의 기술들을 조합해서 풀스택 개발을 한다는 뉘앙스를 줄 수 있어.
4. 프론트엔드 & Node.js (Frontend & Node.js):

조금 더 구체적으로 나누는 방식이야. Angular, Next.js, React, Vue는 주로 프론트엔드 UI를 만드는 데 쓰이고, Node.js는 백엔드 로직을 처리하는 데 쓰인다는 점을 명시적으로 보여줘. JavaScript와 TypeScript는 이 둘 모두에서 사용되는 기반 언어이고. 조금 길지만 명확성은 높아.
추천:

가장 일반적이고 포괄적인 이름을 원한다면 "JavaScript 생태계 (JavaScript Ecosystem)" 가 가장 좋아 보여. 이 기술들이 서로 어떻게 연결되어 있는지 가장 잘 나타내는 표현이야.
만약 이 기술들을 사용하는 **주요 목적(웹 개발)**을 강조하고 싶다면 "웹 개발 기술" 이나 "모던 웹 기술" 도 훌륭한 선택이야.

*/


/*

스크립팅 언어 (Scripting Languages):
이 표현은 Bash, Zsh, PowerShell, Perl 모두에게 해당돼. 네 가지 모두 스크립트를 작성하여 작업을 자동화하는 데 사용되니까. 어쩌면 이 그룹을 가장 정확하게 포괄하는 용어일 수 있어.
명령줄 인터페이스 & 스크립팅 (CLI & Scripting):
Bash, Zsh, PowerShell의 대화형 명령줄 인터페이스(CLI) 측면과 모든 언어의 스크립팅 측면을 함께 나타내는 이름이야. Perl도 명령줄 도구를 만드는 데 쓰이니 포함될 수 있어.
자동화 도구/언어 (Automation Tools/Languages):
이 도구들이 주로 사용되는 **목적(자동화)**에 초점을 맞춘 이름이야. 시스템 관리, 빌드 프로세스, 데이터 처리 자동화 등에 널리 쓰이지.
쉘 & 스크립팅 언어 (Shells & Scripting Languages):
가장 명확하게 구분하는 방식이지만 조금 길 수 있어. Bash, Zsh, PowerShell은 쉘이고, Perl은 스크립팅 언어라는 것을 명시적으로 보여줘.

*/

/*

1. JavaScript 생태계 (JavaScript Ecosystem):

가장 포괄적이고 정확한 표현이야. JavaScript 언어 자체, 그 언어를 확장한 TypeScript, 브라우저 밖에서 실행하게 해주는 Node.js, 그리고 이들을 기반으로 만들어진 각종 프레임워크(Angular, Next.js, Vue)와 라이브러리(React)를 모두 아우르는 이름이야. 개발 도구, 커뮤니티, 패키지 관리자(npm/yarn) 등 관련된 모든 것을 포괄하는 넓은 의미로도 쓰여.
2. 웹 개발 기술 (Web Development Technologies) / 모던 웹 기술 (Modern Web Technologies):

이 기술들이 주로 사용되는 **응용 분야(웹 개발)**에 초점을 맞춘 이름이야. 대부분 웹 프론트엔드나 백엔드(Node.js) 개발에 사용되니까 이것도 아주 적절해. '모던'을 붙이면 최신 트렌드를 반영한다는 느낌을 줄 수 있지.
3. JavaScript 스택 (JavaScript Stack):

웹 애플리케이션을 만들기 위해 함께 사용될 수 있는 기술들의 **묶음(스택)**이라는 점을 강조하는 이름이야. 예를 들어 'MERN 스택'(MongoDB, Express, React, Node.js)처럼, 이 그룹 안의 기술들을 조합해서 풀스택 개발을 한다는 뉘앙스를 줄 수 있어.
4. 프론트엔드 & Node.js (Frontend & Node.js):

조금 더 구체적으로 나누는 방식이야. Angular, Next.js, React, Vue는 주로 프론트엔드 UI를 만드는 데 쓰이고, Node.js는 백엔드 로직을 처리하는 데 쓰인다는 점을 명시적으로 보여줘. JavaScript와 TypeScript는 이 둘 모두에서 사용되는 기반 언어이고. 조금 길지만 명확성은 높아.
추천:

가장 일반적이고 포괄적인 이름을 원한다면 "JavaScript 생태계 (JavaScript Ecosystem)" 가 가장 좋아 보여. 이 기술들이 서로 어떻게 연결되어 있는지 가장 잘 나타내는 표현이야.
만약 이 기술들을 사용하는 **주요 목적(웹 개발)**을 강조하고 싶다면 "웹 개발 기술" 이나 "모던 웹 기술" 도 훌륭한 선택이야.

*/


/*

결론부터 말하면, 친구가 예시로 든 것처럼 기능별로 분리해서 그룹핑하는 것이 훨씬 더 명확하고 일반적인 방식이야.

왜 한 그룹으로 묶기에는 방대할까?

기능의 이질성: 각 서버 그룹은 제공하는 서비스의 목적과 기능이 완전히 달라.
DBMS: 데이터 저장 및 관리
웹 서버: 웹 콘텐츠 제공 및 HTTP 요청 처리
메일 서버: 이메일 송수신 및 관리
DNS 서버: 도메인 이름과 IP 주소 변환
관리 및 전문성: 각 서버는 설정, 관리, 보안, 문제 해결에 필요한 지식과 전문성이 상당히 달라. 한 그룹으로 묶으면 이런 전문 분야의 구분이 모호해질 수 있어.
일반적인 분류: IT 업계나 문서, 학습 자료 등 대부분의 경우 이들을 별도의 카테고리로 분류해서 다뤄.
어떻게 분리하여 그룹핑하는 것이 좋을까? (친구가 이미 잘 하고 있어!)

친구가 예시로 든 것처럼 제공하는 핵심 서비스(기능)를 기준으로 그룹명을 정하는 것이 가장 직관적이고 효과적이야.

데이터베이스 서버 (Database Servers) 또는 DBMS:
SQL Server, PostgreSQL, MySQL, Oracle, MariaDB, MongoDB (NoSQL이지만 넓게 보면 데이터 저장/관리) 등
그룹명: 데이터베이스 서버, DBMS
웹 서버 (Web Servers):
Nginx, Apache HTTP Server, Microsoft IIS, Caddy, LiteSpeed 등
그룹명: 웹 서버
메일 서버 (Mail Servers):
요즘엔 클라우드 기반 서비스(Google Workspace의 Gmail, Microsoft 365의 Exchange Online)를 사용하는 경우가 압도적으로 많아. 많은 기업이나 개인이 직접 메일 서버를 구축/운영하는 대신 구독형 서비스를 이용하지.
만약 **직접 구축(Self-hosted)**한다면 여전히 많이 쓰이는 것들은:
Postfix (가장 인기 있는 MTA - 메일 전송 에이전트)
Dovecot (IMAP/POP3 서버 - 메일 수신/접근)
Exim (또 다른 인기 MTA)
(과거에 많이 쓰였던 Sendmail은 설정 복잡성 등으로 인해 사용 빈도가 줄었어.)
MDaemon이나 Microsoft Exchange Server(온프레미스 버전)는 특정 환경에서는 여전히 사용될 수 있어.
그룹명: 메일 서버
DNS 서버 (DNS Servers):
BIND (가장 널리 쓰이는 오픈소스 DNS 서버)
Windows Server DNS
PowerDNS, CoreDNS (클라우드 네이티브 환경에서 주목받음)
클라우드 제공업체의 DNS 서비스 (AWS Route 53, Google Cloud DNS, Azure DNS) 등
그룹명: DNS 서버
만약 이 기능별 그룹들을 다시 하나의 상위 그룹으로 묶어야 한다면?

꼭 필요하다면, 다음과 같은 포괄적인 이름을 고려해 볼 수 있어:

인프라 서비스 (Infrastructure Services): IT 시스템의 기반이 되는 핵심 서비스들이라는 의미. 가장 적합해 보여.
네트워크 서비스 (Network Services): 네트워크를 통해 특정 기능을 제공하는 서버들이라는 점 강조.
핵심 서버 (Core Servers) / 핵심 서비스 (Core Services): 운영에 필수적인 서버들이라는 의미.
결론:

친구의 직관대로, 기능별로 그룹(데이터베이스 서버, 웹 서버, 메일 서버, DNS 서버)을 나누는 것이 가장 좋다! 이게 가장 명확하고, 관리하기 쉽고, 다른 사람들과 소통할 때도 오해의 소지가 적어. 👍

*/

/*
추천 그룹명:

웹 프레젠테이션 기술 (Web Presentation Technologies):
가장 깔끔하고 전문적인 느낌을 주는 이름이야. 웹 페이지가 사용자에게 어떻게 보여지고(Presentation) 구성되는지를 책임지는 기술들이라는 의미를 잘 전달해. HTML(구조), CSS/SCSS(스타일) 모두 이 범주에 완벽하게 들어맞아.
프론트엔드 마크업 & 스타일링 (Frontend Markup & Styling):
조금 더 구체적이고 설명적인 이름이야. HTML의 역할(마크업)과 CSS/SCSS의 역할(스타일링)을 명확하게 드러내면서, 이 기술들이 주로 사용되는 영역(프론트엔드)을 명시해줘. 매우 직관적이지.
UI 구조 & 스타일 (UI Structure & Style):
사용자 인터페이스(UI)를 만드는 데 있어서 이 기술들이 담당하는 **구조(Structure)**와 스타일(Style) 역할을 강조하는 이름이야.
어떤 이름이 좋을까?

**"웹 프레젠테이션 기술"**은 포괄적이면서도 전문적인 느낌을 줘서 좋아 보여.
**"프론트엔드 마크업 & 스타일링"**은 기술의 역할을 더 명확하게 설명해주고 싶을 때 좋은 선택이야.
이 그룹에 추가하면 좋은 카테고리(기술):

이 그룹의 핵심이 '웹 페이지의 구조와 외형 정의'라면, 다음과 같은 기술들도 함께 포함시키면 좋아.

다른 CSS 전처리기 (Other CSS Preprocessors):
LESS, Stylus: SCSS와 마찬가지로 CSS 작성을 더 효율적으로 도와주는 도구들이야. SCSS와 같은 목적을 가지므로 함께 묶는 것이 자연스러워.
CSS 프레임워크 (CSS Frameworks):
Tailwind CSS, Bootstrap, Material UI (스타일링 부분), Bulma 등: 미리 정의된 스타일과 컴포넌트(특히 CSS 관점)를 제공하여 빠르고 일관된 UI 개발을 도와줘. 웹 페이지의 '스타일'을 다루는 중요한 부분이지. (Material UI처럼 JS 로직이 강하게 결합된 경우는 프레임워크/라이브러리 그룹에 넣을 수도 있지만, 스타일링 관점에서는 여기에도 관련이 있어.)
SVG (Scalable Vector Graphics):
XML 기반의 벡터 이미지 형식이야. HTML 내에 직접 포함하거나 CSS로 스타일을 적용할 수 있어서 웹 프레젠테이션의 일부로 볼 수 있어. 아이콘, 로고, 간단한 그래픽 표시에 많이 쓰여.
(선택적) 템플릿 엔진 (Template Engines - 일부 관점):
Pug (Jade), EJS, Handlebars 등: 동적으로 HTML 구조를 생성하는 데 사용돼. 최종 결과물이 HTML이기 때문에 '구조'를 만드는 기술로 볼 수도 있지만, 종종 로직이 포함되고 백엔드나 JS 프레임워크와 더 밀접하게 연관되기도 해서 별도 그룹(예: '빌드 도구' 또는 '템플릿 엔진')으로 빼는 경우도 많아. 포함 여부는 그룹의 범위를 어떻게 정의하느냐에 따라 달라질 수 있어.
정리하면, "웹 프레젠테이션 기술" 이나 "프론트엔드 마크업 & 스타일링" 이라는 그룹명 아래에 HTML, CSS, CSS 전처리기(SCSS, LESS 등), CSS 프레임워크, SVG 등을 포함시키는 것이 아주 깔끔하고 논리적인 분류가 될 거야!

역시 우리 친구, 중요한 부분을 놓치지 않는 꼼꼼함이 대단해! 😀👍

*/
