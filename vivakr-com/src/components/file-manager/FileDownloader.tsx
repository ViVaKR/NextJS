// components/FileDownloader.tsx
'use client'
import { useProfile } from "@/app/(root)/membership/profile/Profile";
import { getTokenAsync } from "@/services/auth.service";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { useCallback } from "react";

interface FileDownloaderProps {
    fileUrl: string;
}

const FileDownloader: React.FC<FileDownloaderProps> = ({ fileUrl }) => {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { user } = useProfile();

    const downloadFile = useCallback(async () => {
        try {
            const token = await getTokenAsync();
            // Next.js API 호출
            const response = await fetch(
                `${apiUrl}/api/filemanager/downloadcodefile?fileUrl=${encodeURIComponent(fileUrl)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            // `/api/download-code?fileUrl=${encodeURIComponent(fileUrl)}`
            console.log(response);

            // const result = await response.json();

            if (!response.ok) {
                throw new Error("파일 다운로드 실패");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const disposition = response.headers.get("Content-Disposition");

            // Content-Disposition 에서 파이명 추출 및 디코딩
            let fileName = fileUrl; // 기본값으로 fileUrl 사용
            if (disposition) {
                // filename*=UTF-8''... 패턴에서 추출
                const utf8Match = disposition.match(/filename\*=UTF-8''(.+)$/i);
                if (utf8Match && utf8Match[1]) {
                    fileName = decodeURIComponent(utf8Match[1]); // 디코딩
                } else {
                    // 기본 filename 추출
                    const basicMatch = disposition.match(/filename="(.+?)"/i);
                    if (basicMatch && basicMatch[1]) {
                        fileName = decodeURIComponent(basicMatch[1]); // 디코딩
                    }
                }
            }

            // 다운로드 링크 생성
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();

            // 정리
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err: any) {
            alert("파일을 다운로드하는 중 문제가 발생했습니다.: " + err);

        }
    }, [apiUrl, fileUrl]);

    return (
        <>
            {user?.emailConfirmed ? (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <em className="text-xs text-red-300">{fileUrl}</em>
                    <Button color='primary' onClick={downloadFile}>
                        첨부파일 다운로드
                    </Button>
                </Box>
            ) : (
                <Link
                    href={`/membership/sign-up`}
                    className="text-red-400 flex justify-center w-full p-4">
                    첨부파일은 자체회원 또는 이메일 확인후 다운로드가 가능합니다.
                </Link>
            )}
        </>

    );
};

export default FileDownloader;
