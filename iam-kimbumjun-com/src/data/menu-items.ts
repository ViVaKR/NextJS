import { IMenu } from "@/interfaces/i-menu";

export const getNavMenuItems = (): IMenu[] => {
    return [
        { id: 0, title: '코드조각', url: '/code' },
        { id: 1, title: '소통', url: '/chat' },
        { id: 2, title: '캠프', url: '/camp' },
        { id: 3, title: '잡동사니', url: '/odds' },
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

export const getCampItems = (): IMenu[] => {
    return [
        { id: 0, title: '캠프', url: '/camp', icon: 'event_list' },
        { id: 1, title: '.NET', url: '/camp/csharp' },
        { id: 2, title: 'JavaScript', url: '/camp/javascript' },
        { id: 3, title: 'TypeScript', url: '/camp/typescript' },
        { id: 4, title: 'Angular', url: '/camp/angular' },
        { id: 5, title: 'Next.js', url: '/camp/nextjs' },
        { id: 6, title: 'Node.js', url: '/camp/nodejs' },
        { id: 7, title: 'Docker', url: '/camp/docker', hasDivider: true },
        { id: 8, title: 'NGINX', url: '/camp/nginx' },
        { id: 9, title: 'DBMS', url: '/camp/dbms' },
        { id: 10, title: 'Git', url: '/camp/git' },
        { id: 11, title: 'Assembly', url: '/camp/assembly' },
        { id: 12, title: 'HTML', url: '/camp/html' },
        { id: 13, title: 'CSS/SCSS', url: '/camp/css' },
        { id: 14, title: 'Shell/PowerShell', url: '/camp/shell' },
        { id: 15, title: 'Dart', url: '/camp/dart' },
        { id: 16, title: 'Go', url: '/camp/go' },
    ]
}

export const getOddsItems = (): IMenu[] => {
    return [
        { id: 0, title: '잡동사니', url: '/odds' },
        { id: 1, title: '능선따라', url: '/odds/chat' },
        { id: 2, title: '아이피 정보', url: '/odds/ip-address' },
        { id: 3, title: '쉘실행기', url: '/odds/code-runner' },
        { id: 4, title: '그리드뷰', url: '/odds/grid-control' },
        { id: 5, title: '코드서식', url: '/odds/code-html' },
        { id: 6, title: '단계', url: '/odds/stepper-text' },
        { id: 7, title: '스넥바', url: '/odds/snack-bar' },
        { id: 8, title: '카드', url: '/odds/card' },
        { id: 9, title: '박스', url: '/odds/box' },
        { id: 10, title: '데모(ORM)', url: '/odds/orm-demo' },
        { id: 11, title: 'MUI Grid', url: '/odds/mui-grid' },
        { id: 12, title: 'MUI Container', url: '/odds/mui-container' },
        { id: 13, title: 'CRUD', url: '/odds/crud' },
        { id: 14, title: 'Accordion', url: '/odds/accordion' },
        { id: 15, title: 'Tooltip', url: '/odds/tooltip' },
        { id: 16, title: 'TextField', url: '/odds/text-field' },
        { id: 17, title: 'Button', url: '/odds/button' },
        { id: 18, title: 'Checkbox', url: '/odds/checkbox' },
        { id: 19, title: 'DataGrid A', url: '/odds/data-grid' },
        { id: 20, title: 'DataGrid B', url: '/odds/data-grid-2' },
        { id: 21, title: 'Badge', url: '/odds/badge' },
        { id: 22, title: 'Avata', url: '/odds/avata' },
        { id: 23, title: 'Backdrop', url: '/odds/backdrop' },
        { id: 23, title: 'Screen Dialog', url: '/odds/screen-dialog' },
        { id: 24, title: 'Scroll Dialog', url: '/odds/scroll-dialog' },
        { id: 25, title: 'Progress', url: '/odds/progress' },
        { id: 26, title: 'Snackbar', url: '/odds/snackbar' },
    ]
}

// export const getDotNetItems = (): IMenu[] => {
//     return [
//         { id: 0, title: 'C#', url: '/camp/csharp' },
//         { id: 1, title: 'ASP.NET Core', url: '/camp/csharp' },
//         { id: 2, title: 'ASP.NET Core API', url: '/camp/csharp' },
//         { id: 3, title: 'SignalR', url: '/camp/csharp' },
//         { id: 4, title: 'Blazor', url: '/camp/csharp' },
//         { id: 5, title: 'MAUI', url: '/camp/csharp' },
//         { id: 6, title: 'Winforms/Wpf', url: '/camp/csharp' },
//         { id: 7, title: 'Unity', url: '/camp/csharp' },
//     ]
// }
