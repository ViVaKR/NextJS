
export interface IUserDetailDTO {
    id: string;
    fullName: string;
    email: string;
    emailConfirmed: boolean;
    roles: string[];
    phoneNumber?: string;
    twoFactorEnabled: boolean;
    phoneNumberConformed: boolean;
    accessFailedCount: number;
    avata: string;
}
