import { IAuthResponse } from "./i-auth-response";

export interface IAuthContextProps {
    user: IAuthResponse | null;
    isAdmin: () => boolean;
    login: (email: string, password: string) => Promise<boolean>; // 실제 시그니처 반영
    logout: () => void;
    loading: boolean;
}
