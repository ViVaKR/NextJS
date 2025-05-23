import { IUserDetailDTO } from "@/interfaces/i-userdetail-dto";
import { IAuthResponse } from "./i-auth-response";

// 확장된 User 타입 정의
export interface ExtendedUser extends IAuthResponse, IUserDetailDTO {
    id: string;
    fullName: string;
    email: string;
    emailConfirmed?: boolean;
    roles: string[],
    phoneNumber?: string;
    twoFactorEnabled?: boolean;
    token: string;
    refreshToken: string;
    isSuccess: boolean;
    message: string;
    phoneNumberConformed?: boolean;
    accessFailedCount: number;
    avata?: string;
    provider?: string; // <-- 로그인 제공자 정보 추가 (예: 'google', 'github'))
}
