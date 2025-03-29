// src/lib/fileManagerService.ts
import { IFileInfo } from "@/interfaces/i-file-info";
import { getToken } from "@/services/auth.service";
import axios from "axios";


export const uploadFile = async (formData: FormData, choice: number): Promise<IFileInfo> => {

    const token = getToken();
    if (!token) {
        throw new Error("로그인이 필요합니다.")
    }
    const url =
        choice === 0
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/FileManager/Upload`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/FileManager/UploadAttachImage`;

    try {
        const response = await axios.post<IFileInfo>(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`, // 인증 토큰 추가
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
        }
        throw error; // 기타 에러는 그대로 던짐
    }
};
