import { IMenu } from "@/interfaces/i-menu";
export const getNavMenuItems = (): IMenu[] => {
    return [
        { id: 0, title: '코드조각', url: '/code', icon: 'swipe_right', param: null },
        { id: 1, title: '능선따라', url: '/chat', icon: 'swipe_right', param: null },
        { id: 2, title: '부트캠프', url: '/bootcamp', icon: 'swipe_right', param: null },
        { id: 3, title: '잡동사니', url: '/etc', icon: 'swipe_right', param: null },
    ];
}

export const getMembershipItems = (): IMenu[] => {
    return [
        { id: 0, title: '나의정보', url: '/membership/profile', icon: 'home', param: null, requiresAuth: true },
        { id: 1, title: '회원목록', url: '/membership/all-account', icon: 'home', param: null, requiresAuth: true, requiredRoles: ['Admin'] },
        { id: 2, title: '카테고리', url: '/membership/code-category', icon: 'home', param: null, requiresAuth: true, requiredRoles: ['Admin'] },
        { id: 3, title: '회원가입', url: '/membership/sign-up', icon: 'home', param: null, hideWhenAuth: true },
        { id: 4, title: '로그인', url: '/membership/sign-in', icon: 'home', param: null, hideWhenAuth: true },
        { id: 5, title: '로그아웃', url: '/membership/sign-out', icon: 'home', param: null, requiresAuth: true },
    ];
};

export const getEtcItems = (): IMenu[] => {
    return [
        { id: 0, title: 'IP Address', url: '/etc/ip-address', icon: 'swipe_right', param: null },
        { id: 1, title: 'Shell Runner', url: '/etc/code-runner', icon: 'swipe_right', param: null },
        { id: 2, title: 'PlayGround', url: '/etc/playground', icon: 'swipe_right', param: null },
        { id: 3, title: 'Grid Control', url: '/etc/grid-control', icon: 'swipe_right', param: null },
        { id: 4, title: 'Code To HTML', url: '/etc/code-html', icon: 'swipe_right', param: null },
        { id: 5, title: 'Stepper', url: '/etc/stepper-text', icon: 'swipe_right', param: null },
        { id: 6, title: 'Blog', url: '/etc/blog', icon: 'swipe_right', param: null },
    ]
}

export const getCampItems = (): IMenu[] => {
    return [
        { id: 0, title: '닷넷', url: '/bootcamp/dotnet', icon: 'swipe_right', param: null },
        { id: 1, title: '웹앱', url: '/bootcamp/webapp', icon: 'swipe_right', param: null },
        { id: 2, title: '시스템', url: '/bootcamp/system', icon: 'swipe_right', param: null },
        { id: 3, title: '솔루션', url: '/bootcamp/solution', icon: 'swipe_right', param: null },
    ]
}
