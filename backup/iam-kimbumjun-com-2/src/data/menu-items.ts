import { IMenu } from "@/interfaces/i-menu";

export const getNavMenuItems = (): IMenu[] => {
    return [
        { id: 0, title: '코드조각', url: '/code' },
        { id: 1, title: '능선따라', url: '/etc/chat' },
        { id: 2, title: '아이피정보', url: '/etc/ip-address' },
        { id: 3, title: '블러그', url: '/blog' },
        { id: 4, title: '잡동사니', url: '/etc' },
        { id: 5, title: '데모', url: '/demos' },
    ];
}

export const getMembershipItems = (): IMenu[] => {
    return [
        { id: 0, title: '나의정보', url: '/membership/profile', requiresAuth: true, sessionMenu: false },
        { id: 1, title: '권한관리', url: '/membership/role', hasDivider: true, requiresAuth: true, requiredRoles: ['Admin'], sessionMenu: false },
        { id: 2, title: '회원관리', url: '/membership/account', requiresAuth: true, requiredRoles: ['Admin'], sessionMenu: false },
        { id: 3, title: '과목관리', url: '/membership/code-category', requiresAuth: true, requiredRoles: ['Admin'], sessionMenu: false },
        { id: 4, title: '코드작성', url: '/code/create', hasDivider: true, requiresAuth: true, sessionMenu: false },
        { id: 5, title: '코드백업', url: '/membership/code-backup', requiresAuth: true, sessionMenu: false },
        { id: 6, title: '회원가입', url: '/membership/sign-up', hideWhenAuth: true, sessionMenu: false },
        { id: 7, title: '로그인', url: '/membership/sign-in', hideWhenAuth: true, sessionMenu: false },
        { id: 8, title: '로그아웃', url: '/membership/sign-out', requiresAuth: true, sessionMenu: true },
    ];
};

export const getEtcItems = (): IMenu[] => {
    return [
        { id: 0, title: '잡동사니', url: '/etc' },
        { id: 1, title: '능선따라', url: '/etc/chat' },
        { id: 2, title: '아이피정보', url: '/etc/ip-address' },
        { id: 3, title: '쉘실행기', url: '/etc/code-runner' },
        { id: 4, title: '대시보드', url: '/app-bar' },
        { id: 5, title: '그리드뷰', url: '/etc/grid-control' },
        { id: 6, title: '코드서식', url: '/etc/code-html' },
        { id: 7, title: '단계', url: '/etc/stepper-text' },
        { id: 8, title: '스넥바', url: '/etc/snack-bar' },
        { id: 9, title: '카드', url: '/etc/card' },
        { id: 10, title: '박스', url: '/etc/box' },
        { id: 11, title: '데모(ORM)', url: '/etc/orm-demo' },
        { id: 12, title: 'MUI Grid', url: '/etc/mui-grid' },
        { id: 13, title: 'MUI Container', url: '/etc/mui-container' },
        { id: 14, title: 'CRUD', url: '/etc/crud' },
    ]
}

export const getBlogItems = (): IMenu[] => {
    return [
        { id: 0, title: '블러그', url: '/blog', icon: 'event_list', param: null },
        { id: 1, title: '.NET', url: '/blog/csharp', icon: 'swipe_right', param: null },
        { id: 2, title: 'JavaScript', url: '/blog/javascript', icon: 'swipe_right', param: null },
        { id: 3, title: 'TypeScript', url: '/blog/typescript', icon: 'swipe_right', param: null },
        { id: 4, title: 'Angular', url: '/blog/angular', icon: 'swipe_right', param: null },
        { id: 5, title: 'Next.js', url: '/blog/nextjs', icon: 'swipe_right', param: null },
        { id: 6, title: 'Node.js', url: '/blog/nodejs', icon: 'swipe_right', param: null },
        { id: 7, title: 'Docker', url: '/blog/docker', icon: 'swipe_right', param: null, hasDivider: true },
        { id: 8, title: 'NGINX', url: '/blog/nginx', icon: 'swipe_right', param: null },
        { id: 9, title: 'DBMS', url: '/blog/dbms', icon: 'swipe_right', param: null },
        { id: 10, title: 'Git', url: '/blog/git', icon: 'swipe_right', param: null },
        { id: 11, title: 'Assembly', url: '/blog/assembly', icon: 'swipe_right', param: null },
        { id: 12, title: 'HTML', url: '/blog/html', icon: 'swipe_right', param: null },
        { id: 13, title: 'CSS/SCSS', url: '/blog/css', icon: 'swipe_right', param: null },
        { id: 14, title: 'Shell/PowerShell', url: '/blog/shell', icon: 'swipe_right', param: null },
        { id: 15, title: 'Dart', url: '/blog/dart', icon: 'swipe_right', param: null },
        { id: 16, title: 'Go', url: '/blog/go', icon: 'swipe_right', param: null },
    ]
}

export const getDemoItems = (): IMenu[] => {
    return [
        { id: 0, title: 'Accordion', url: '/demos/accordion', icon: 'swipe_right', param: null },
        { id: 1, title: 'Tooltip', url: '/demos/tooltip', icon: 'swipe_right', param: null },
        { id: 2, title: 'TextField', url: '/demos/text-field', icon: 'swipe_right', param: null },
        { id: 3, title: 'Button', url: '/demos/button', icon: 'swipe_right', param: null },
        { id: 4, title: 'Checkbox', url: '/demos/checkbox', icon: 'swipe_right', param: null },
        { id: 5, title: 'DataGrid A', url: '/demos/data-grid', icon: 'swipe_right', param: null },
        { id: 6, title: 'DataGrid B', url: '/demos/data-grid-2', icon: 'swipe_right', param: null },
        { id: 7, title: 'Badge', url: '/demos/badge', icon: 'swipe_right', param: null },
        { id: 8, title: 'Avata', url: '/demos/avata', icon: 'swipe_right', param: null },
        { id: 9, title: 'Backdrop', url: '/demos/backdrop', icon: 'swipe_right', param: null },
        { id: 10, title: 'Screen Dialog', url: '/demos/screen-dialog', icon: 'swipe_right', param: null },
        { id: 11, title: 'Scroll Dialog', url: '/demos/scroll-dialog', icon: 'swipe_right', param: null },
        { id: 12, title: 'Progress', url: '/demos/progress', icon: 'swipe_right', param: null },
        { id: 13, title: 'Snackbar', url: '/demos/snackbar', icon: 'swipe_right', param: null },
        { id: 14, title: 'Dashboard', url: '/demos/dashboard', icon: 'swipe_right', param: null },
    ]
}

export const getDotNetItems = (): IMenu[] => {
    return [
        { id: 0, title: 'C#', url: '/camp/csharp', icon: 'swipe_right', param: null },
        { id: 1, title: 'ASP.NET Core', url: '/camp/csharp', icon: 'swipe_right', param: null },
        { id: 2, title: 'ASP.NET Core API', url: '/camp/csharp', icon: 'swipe_right', param: null },
        { id: 3, title: 'SignalR', url: '/camp/csharp', icon: 'swipe_right', param: null },
        { id: 4, title: 'Blazor', url: '/camp/csharp', icon: 'swipe_right', param: null },
        { id: 5, title: 'MAUI', url: '/camp/csharp', icon: 'swipe_right', param: null },
        { id: 6, title: 'Winforms/Wpf', url: '/camp/csharp', icon: 'swipe_right', param: null },
        { id: 7, title: 'Unity', url: '/camp/csharp', icon: 'swipe_right', param: null },
    ]
}
