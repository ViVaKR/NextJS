// src/interfaces/i-role.ts
export interface IRole {
    id: string;
    name: string;
    totalUsers: number;
    normalizedName: string;
    concurrencyStamp: string;
}
