// src/components/FileUploader.tsx
'use client';
import { Button, CircularProgress, Typography } from '@mui/material';
import { useState, useRef } from 'react';
import { getTokenAsync } from '@/services/auth.service'; // 기존 토큰 가져오기 함수

interface FileUploaderProps {
    onUploadComplete: (filePath: string) => void;
    title?: string;
}

export default function FileUploader({ onUploadComplete, title = '파일 업로드 (최대 30MB)' }: FileUploaderProps) {
    const [progress, setProgress] = useState<number | null>(null);
    const [status, setStatus] = useState<string>('대기 중');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const token = await getTokenAsync();
        if (!token) {
            setStatus('로그인 후 다시 시도해주세요.');
            return;
        }

        setStatus('업로드 중');
        setProgress(0);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const xhr = new XMLHttpRequest();
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    setProgress(percent);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    setStatus('업로드 완료');
                    setProgress(100);
                    onUploadComplete(response.dbPath); // ASP.NET Core API에서 반환되는 fullPath 사용
                } else {
                    const error = JSON.parse(xhr.responseText);
                    setStatus(`업로드 실패: ${error.message || xhr.statusText}`);
                    setProgress(null);
                }
            };

            xhr.onerror = () => {
                setStatus('업로드 실패');
                setProgress(null);
            };

            const uri = `${process.env.NEXT_PUBLIC_API_URL}/api/fileManager/uploadFile`;
            xhr.open('POST', uri, true);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`); // 토큰 추가
            xhr.send(formData);
        } catch (err) {
            setStatus(`업로드 실패: ${(err as Error).message}`);
            setProgress(null);
        }
    };

    return (
        <div className="flex flex-col items-center gap-1">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            // accept=".zip,.rar,.7z,.tar,.pdf"
            />
            <Button
                variant="contained"
                color="info"
                onClick={() => fileInputRef.current?.click()}
            >
                {title}
            </Button>
            {progress !== null && (
                <div className="flex flex-col items-center gap-2">
                    <CircularProgress variant="determinate" value={progress} />
                    <Typography variant="caption">{status} ({progress}%)</Typography>
                </div>
            )}
        </div>
    );
}
