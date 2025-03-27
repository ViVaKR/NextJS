import { IMenu } from "@/interfaces/i-menu";
export const getNavMenuItems = (): IMenu[] => {
    return [
        { id: 0, title: '코드조각', url: '/code', icon: 'swipe_right', param: null },

        { id: 1, title: '블러그', url: '/blog', icon: 'swipe_right', param: null },
        { id: 2, title: '잡동사니', url: '/etc', icon: 'swipe_right', param: null },
        { id: 3, title: '데모', url: '/demos', icon: 'swipe_right', param: null },

    ];
}

export const getMembershipItems = (): IMenu[] => {
    return [
        { id: 0, title: '나의정보', url: '/membership/profile', icon: 'manage_accounts', param: null, requiresAuth: true },
        { id: 1, title: ' 권한관리', url: '/membership/role', icon: 'manage_accounts', param: null, hasDivider: true, requiresAuth: true, requiredRoles: ['Admin'] },
        { id: 2, title: '회원관리', url: '/membership/account', icon: 'manage_accounts', param: null, requiresAuth: true, requiredRoles: ['Admin'] },
        { id: 3, title: '과목관리', url: '/membership/code-category', icon: 'manage_accounts', param: null, requiresAuth: true, requiredRoles: ['Admin'] },
        { id: 4, title: '코드작성', url: '/membership/my-code', icon: 'manage_accounts', param: null, hasDivider: true, requiresAuth: true },
        { id: 5, title: '코드백업', url: '/membership/code-backup', icon: 'manage_accounts', param: null, requiresAuth: true },
        { id: 6, title: '비밀번호 변경', url: '/membership/change-password', icon: 'manage_accounts', param: null, requiresAuth: true },
        { id: 7, title: '필명변경', url: '/membership/change-name', icon: 'manage_accounts', param: null, requiresAuth: true },
        { id: 8, title: '회원가입', url: '/membership/sign-up', icon: 'manage_accounts', param: null, hideWhenAuth: true },
        { id: 9, title: '메일인증', url: '/membership/confirm-email', icon: 'manage_accounts', param: null, requiresAuth: true },
        { id: 10, title: '메일인증 회신', url: '/membership/confirm-email-replay', icon: 'manage_accounts', param: null, hasDivider: true, requiresAuth: true },
        { id: 11, title: '로그인', url: '/membership/sign-in', icon: 'manage_accounts', param: null, hideWhenAuth: true },
        { id: 12, title: '비밀번호 찾기', url: '/membership/find-password', icon: 'manage_accounts', param: null, hideWhenAuth: true },
        { id: 13, title: '비밀번호 변경', url: '/membership/reset-password', icon: 'manage_accounts', param: null, requiresAuth: true },
        { id: 14, title: '로그아웃', url: '/membership/sign-out', icon: 'manage_accounts', param: null, requiresAuth: true },
        { id: 15, title: '회원탈퇴', url: '/membership/cancel-membership', icon: 'manage_accounts', param: null, requiresAuth: true },
    ];
};

export const getEtcItems = (): IMenu[] => {
    return [
        { id: 0, title: '잡동사니', url: '/etc', icon: 'event_list', param: null },
        { id: 1, title: '대화방', url: '/etc/chat', icon: 'swipe_right', param: null },
        { id: 2, title: '아이피정보', url: '/etc/ip-address', icon: 'swipe_right', param: null },
        { id: 3, title: '쉘실행기', url: '/etc/code-runner', icon: 'swipe_right', param: null },
        { id: 4, title: '대시보드', url: '/app-bar', icon: 'swipe_right', param: null },
        { id: 5, title: '그리드뷰', url: '/etc/grid-control', icon: 'swipe_right', param: null },
        { id: 6, title: '코드서식', url: '/etc/code-html', icon: 'swipe_right', param: null },
        { id: 7, title: '단계', url: '/etc/stepper-text', icon: 'swipe_right', param: null },
        { id: 8, title: '스넥바', url: '/etc/snack-bar', icon: 'swipe_right', param: null },
        { id: 9, title: '카드', url: '/etc/card', icon: 'swipe_right', param: null },
        { id: 10, title: '박스', url: '/etc/box', icon: 'swipe_right', param: null },
        { id: 11, title: '데모(ORM)', url: '/etc/orm-demo', icon: 'swipe_right', param: null },
        { id: 12, title: 'MUI Grid2', url: '/etc/mui-grid', icon: 'swipe_right', param: null },
        { id: 13, title: 'MUI Container', url: '/etc/mui-container', icon: 'swipe_right', param: null },
        { id: 14, title: 'CRUD', url: '/etc/crud', icon: 'swipe_right', param: null },
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
