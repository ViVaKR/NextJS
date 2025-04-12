// --> 로그인 응답용
export interface IAuthResponse { //API: AuthResponseDTO
    token?: string;
    isSuccess: boolean;
    message?: string;
    refreshToken?: string;
    provider?: string;
}

// src/interfaces/i-auth-response.ts
export interface IAuthResponseDTO {
    token?: string | null; // 선택적 필드
    isSuccess: boolean;
    message: string;
    refreshToken?: string; // 선택적 필드
    provider?: string;

}

// src/interfaces/i-delete-account-dto.ts
export interface IDeleteAccountDTO {
    email: string;
    password: string;
}
