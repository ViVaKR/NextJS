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
