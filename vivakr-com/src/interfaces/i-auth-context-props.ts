import { IUserDetailDTO } from "@/interfaces/i-userdetail-dto";
import { IAuthResponse } from "./i-auth-response";
import { ExtendedUser } from "./i-extended-user"; // ExtendedUser 사용

export interface IAuthContextProps {
    user: IAuthResponse | null;
    // isAdmin: () => boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<boolean>; // * 실제 시그니처 반영
    logout: () => void;
    fetchUsers: () => Promise<IUserDetailDTO[]>;
    loading: boolean;
    updateUser: (updates: Partial<ExtendedUser>) => void; // * 추가됨.
}
