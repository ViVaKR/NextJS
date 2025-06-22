// src/lib/fileManagerService.ts
import { IFileInfo } from "@/interfaces/i-file-info";
import { getTokenAsync } from "@/services/auth.service";
import axios from "axios";

export const uploadFile = async (formData: FormData, choice: number): Promise<IFileInfo> => {

    const token = await getTokenAsync();
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

export const downloadFile = async (
    fileUrl: string, defaultFileName: string = 'dowonloaded-file'
): Promise<void> => {
    const token = await getTokenAsync();
    if (!token) {
        console.error("Authentication token is missing.");
        throw new Error("로그인이 필요합니다.") // 또는 로그인 페이지로 리다이렉션
    }

    const encodedFileUrl = encodeURIComponent(fileUrl);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/FileManager/DownloadCodeFile?fileUrl=${encodedFileUrl}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })

        if (!response.ok) {
            //
            let errorMsg = `파일 다운로드 실패: ${response.status} ${response.statusText}`;
            try {
                // 오류 응답이 JSON 형태일 수 있음.
                const errorData = await response.json();
                errorMsg = errorData.message || errorMsg;
            } catch (e: any) {
                // JSON 파싱 실패 시 텍스트로 시도
                try {
                    const errorText = await response.text();
                    if (errorText) errorMsg = errorText;
                } catch (e2: any) { }
            }
            throw new Error(errorMsg);
        }

        // 1. Blob 데이터 가져오기
        const blob = await response.blob();

        // 2. 파일 이름 결정 (Content-Diposition 헤더 우선)
        const contentDisposition = response.headers.get('content-disposition');
        let filename = defaultFileName;
    } catch (err: any) {
        console.error("파일 다운로드 중 오류 발생:", err);
        // 여기서 사용자에게 에러 알림 (Snackbar 등)
        // 에러를 다시 throw 하여 호출한 컴포넌트에서도 처리 가능하게 함.
        throw new Error(err.message || '파일 다운로드 중 알 수 없는 오류가 발생하였습니다.')

    }
}
