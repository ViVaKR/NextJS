export interface ICode {
    id: number;
    title: string;
    subTitle: string;
    content: string;
    subContent?: string | null | undefined;
    markdown?: string | null | undefined;
    created: Date;
    modified: Date;
    note?: string;
    categoryId: number;
    userId: string;
    userName: string;
    myIp: string;
    attachFileName?: string | null | undefined;
    attachImageName?: string | null | undefined;
}
