import OddsAccordion from "@/app/(root)/odds/accordion/OddsAccordion";
import OddsCodeHtml from "@/app/(root)/odds/code-html/OddsCodeHtml";
import OddsCodeRunner from "@/app/(root)/odds/code-runner/OddsCodeRunner";
import OddsOrmPrisma from "@/app/(root)/odds/orm-prisma/OddsOrmPrisma";
import { IMenu } from "@/interfaces/i-menu";

export const getNavMenuItems = (): IMenu[] => {
    return [
        { id: 0, title: '코드조각', url: '/code' },
        { id: 1, title: '코드작성', url: '/code/create', tooltip: 'Viv Membership 만 이용가능' },
        { id: 2, title: '소통', url: '/chat' },
        { id: 3, title: '정보', url: '/ip-address' },
        { id: 4, title: '캠프', url: '/camp' },
        { id: 5, title: '잡동사니', url: '/odds' },
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

export const getOddsItems = (): IMenu[] => {
    return [
        { id: 0, title: '쉘 실행기', url: '/odds/code-runner', Component: OddsCodeRunner },
        { id: 1, title: '예쁜코드', url: '/odds/code-html', Component: OddsCodeHtml },
        { id: 2, title: '아코디언', url: '/odds/accordion', Component: OddsAccordion },
        { id: 3, title: 'Prisma', url: '/odds/orm-prisma', Component: OddsOrmPrisma },
    ]
}
