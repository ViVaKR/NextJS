import OddsAccordion from "@/app/(root)/odds/accordion/OddsAccordion";
import OddsCodeHtml from "@/app/(root)/odds/code-html/OddsCodeHtml";
import OddsCodeRunner from "@/app/(root)/odds/code-runner/OddsCodeRunner";
import MarbleGame from "@/app/(root)/odds/marble/page";
import MazeGame from "@/app/(root)/odds/maze/MazeGame";
import { IMenu } from "@/interfaces/i-menu";

export const getNavMenuItems = (): IMenu[] => {
    return [
        { id: 0, title: '코드조각', url: '/code' },
        { id: 1, title: '코드작성', url: '/code/create' },
        { id: 2, title: '소통', url: '/chat' },
        { id: 3, title: '정보', url: '/ip-address' },
        { id: 4, title: '캠프', url: '/camp' },
        { id: 5, title: '잡동사니', url: '/odds' },
        { id: 6, title: '지도', url: '/google-map' },

    ];
}

export const getMembershipItems = (): IMenu[] => {
    return [
        { id: 0, title: '나의정보', url: '/membership/profile', requiresAuth: true, sessionMenu: false },
        { id: 1, title: '권한관리', url: '/membership/role', hasDivider: true, requiresAuth: true, requiredRoles: ['Admin'], sessionMenu: false },
        { id: 2, title: '회원관리', url: '/membership/account', requiresAuth: true, requiredRoles: ['Admin'], sessionMenu: false },
        { id: 3, title: '과목관리', url: '/membership/code-category', requiresAuth: true, requiredRoles: ['Admin'], sessionMenu: false },
        { id: 4, title: '회원가입', url: '/membership/sign-up', hideWhenAuth: true, sessionMenu: false },
        { id: 5, title: '로그인', url: '/membership/sign-in', hideWhenAuth: true, sessionMenu: false },
        { id: 6, title: '로그아웃', url: '/membership/sign-out', requiresAuth: true, sessionMenu: true },
    ];
};

export const getOddsItems = (): IMenu[] => {
    return [
        { id: 0, title: '쉘 실행기', url: '/odds/code-runner', Component: OddsCodeRunner },
        { id: 1, title: '예쁜코드', url: '/odds/code-html', Component: OddsCodeHtml },
        { id: 2, title: '아코디언', url: '/odds/accordion', Component: OddsAccordion },
        { id: 3, title: '미로게임', url: '/odds/maze', Component: MazeGame },
        { id: 4, title: '블루마블', url: '/odds/marble', Component: MarbleGame }
    ]
}
