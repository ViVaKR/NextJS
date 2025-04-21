export interface IRegisterRequest {
    email: string;
    fullName: string;
    password: string;
    roles?: string[];
}
