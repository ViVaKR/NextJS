import { IMenu } from "@/interfaces/i-menu";
export const getNavMenuItems = (): IMenu[] => {
    return [
        { id: 0, title: '코드조각', url: '/code', icon: 'swipe_right', param: null },
        { id: 1, title: '블러그', url: '/blog', icon: 'swipe_right', param: null },
        { id: 2, title: '잡동사니', url: '/etc', icon: 'swipe_right', param: null },
    ];
}

export const getMembershipItems = (): IMenu[] => {
    return [
        { id: 0, title: '\u269E 나의정보 \u269F', url: '/profile', icon: 'home', param: null, requiresAuth: true },
        { id: 1, title: '\u27A5 권한관리', url: '/role', icon: 'home', param: null, requiresAuth: true, requiredRoles: ['Admin'] },
        { id: 2, title: '\u27A5 회원관리', url: '/account', icon: 'home', param: null, requiresAuth: true, requiredRoles: ['Admin'] },
        { id: 3, title: '\u27A5 과목관리', url: '/code-category', icon: 'home', param: null, requiresAuth: true, requiredRoles: ['Admin'] },
        { id: 4, title: '\u27A5 코드작성', url: '/my-code', icon: 'home', param: null, requiresAuth: true },
        { id: 5, title: '\u27A5 코드백업', url: '/code-backup', icon: 'home', param: null, requiresAuth: true },
        { id: 6, title: '\u27A5 비밀번호 변경', url: '/change-password', icon: 'home', param: null, requiresAuth: true },
        { id: 7, title: '\u27A5 필명변경', url: '/change-name', icon: 'home', param: null, requiresAuth: true },
        { id: 8, title: '\u27A5 회원가입', url: '/sign-up', icon: 'home', param: null, hideWhenAuth: true },
        { id: 9, title: '\u27A5 메일인증', url: '/confirm-email', icon: 'home', param: null, requiresAuth: true },
        { id: 10, title: '\u27A5 메일인증 회신', url: '/confirm-email-replay', icon: 'home', param: null, requiresAuth: true },
        { id: 11, title: '\u27A5 로그인', url: '/sign-in', icon: 'home', param: null, hideWhenAuth: true },
        { id: 12, title: '\u27A5 비밀번호 찾기', url: '/find-password', icon: 'home', param: null, hideWhenAuth: true },
        { id: 13, title: '\u27A5 비밀번호 변경', url: '/reset-password', icon: 'home', param: null, requiresAuth: true },
        { id: 14, title: '\u27A5 로그아웃', url: '/sign-out', icon: 'home', param: null, requiresAuth: true },
        { id: 15, title: '\u27A5 회원탈퇴', url: '/code-category', icon: 'home', param: null, requiresAuth: true },
    ];
};

export const getEtcItems = (): IMenu[] => {
    return [
        { id: 0, title: '\u269E 잡동사니 \u269F', url: '/etc', icon: 'swipe_right', param: null },
        { id: 1, title: '\u27A5 대화방', url: '/etc/chat', icon: 'swipe_right', param: null },
        { id: 2, title: '\u27A5 아이피정보', url: '/etc/ip-address', icon: 'swipe_right', param: null },
        { id: 3, title: '\u27A5 쉘실행기', url: '/etc/code-runner', icon: 'swipe_right', param: null },
        { id: 4, title: '\u27A5 Grid Control', url: '/etc/grid-control', icon: 'swipe_right', param: null },
        { id: 5, title: '\u27A5 Code To HTML', url: '/etc/code-html', icon: 'swipe_right', param: null },
        { id: 6, title: '\u27A5 Stepper', url: '/etc/stepper-text', icon: 'swipe_right', param: null },
        { id: 7, title: '\u27A5 SnackBar', url: '/etc/snack-bar', icon: 'swipe_right', param: null },
    ]
}


export const getBlogItems = (): IMenu[] => {
    return [
        { id: 0, title: '\u269E 블러그 \u269F', url: '/blog', icon: 'swipe_right', param: null },
        { id: 1, title: '\u27A5 .NET', url: '/blog/csharp', icon: 'swipe_right', param: null },
        { id: 2, title: '\u27A5 JavaScript', url: '/blog/javascript', icon: 'swipe_right', param: null },
        { id: 3, title: '\u27A5 TypeScript', url: '/blog/typescript', icon: 'swipe_right', param: null },
        { id: 4, title: '\u27A5 Angular', url: '/blog/angular', icon: 'swipe_right', param: null },
        { id: 5, title: '\u27A5 Next.js', url: '/blog/nextjs', icon: 'swipe_right', param: null },
        { id: 6, title: '\u27A5 Node.js', url: '/blog/nodejs', icon: 'swipe_right', param: null },
        { id: 7, title: '\u27A5 Docker', url: '/blog/docker', icon: 'swipe_right', param: null },
        { id: 8, title: '\u27A5 NGINX', url: '/blog/nginx', icon: 'swipe_right', param: null },
        { id: 9, title: '\u27A5 DBMS', url: '/blog/dbms', icon: 'swipe_right', param: null },
        { id: 10, title: '\u27A5 Git', url: '/blog/git', icon: 'swipe_right', param: null },
        { id: 11, title: '\u27A5 Assembly', url: '/blog/assembly', icon: 'swipe_right', param: null },
        { id: 12, title: '\u27A5 HTML', url: '/blog/html', icon: 'swipe_right', param: null },
        { id: 13, title: '\u27A5 CSS/SCSS', url: '/blog/css', icon: 'swipe_right', param: null },
        { id: 14, title: '\u27A5 Shell/PowerShell', url: '/blog/shell', icon: 'swipe_right', param: null },
        { id: 15, title: '\u27A5 Dart', url: '/blog/dart', icon: 'swipe_right', param: null },
        { id: 16, title: '\u27A5 Go', url: '/blog/go', icon: 'swipe_right', param: null },

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
