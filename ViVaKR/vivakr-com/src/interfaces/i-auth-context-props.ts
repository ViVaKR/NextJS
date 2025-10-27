import { IUserDetailDTO } from "@/interfaces/i-userdetail-dto";
import { IAuthResponse } from "./i-auth-response";
import { ExtendedUser } from "./i-extended-user";

export interface IAuthContextProps {
    user: IAuthResponse | null;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    fetchUsers: () => Promise<IUserDetailDTO[]>;
    loading: boolean;
    updateUser: (updates: Partial<ExtendedUser>) => void;
}
