export interface IMenu {
    id: number;
    title: string;
    url: string;
    icon?: string;
    param?: string | null | undefined;
    hasDivider?: boolean;
    requiresAuth?: boolean; // 로그인 필요 여부
    hideWhenAuth?: boolean; // 로그인 시 숨김 여부
    requiredRoles?: string[]; // 필요한 역할
    sessionMenu?: boolean; // 세션으로 로그인 여부
}
