// --> 로그인 응답용
export interface IAuthResponse { //API: AuthResponseDTO
    token: string;
    isSuccess: boolean;
    message: string;
    refreshToken: string;
}
