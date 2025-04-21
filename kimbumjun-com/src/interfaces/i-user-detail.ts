interface IUserDetail {
    id: string;
    fullName: string;
    email: string;
    roles: string[];
    emailConfirmed?: boolean;
    permissions?: string[];
}
