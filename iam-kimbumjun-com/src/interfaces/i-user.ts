// 사용자 정보용 (IUserDetailDTO + 추가 속성, phoneNumber, twoFactorEnabled 등))
export interface IUser {
    id: string;
    fullName: string;
    email: string;
    emailConfirmed: boolean;
    roles: string[];
    phoneNumber: string;
    twoFacotorEnabled: boolean;
    phoneNumberConfirmed: boolean;
    accessFailedCount: number;
    avata: string;
}
