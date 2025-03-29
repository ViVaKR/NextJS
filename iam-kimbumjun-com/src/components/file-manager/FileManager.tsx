// src/components/file-manager/FileManager.tsx
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, IconButton, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSnackbar } from "@/lib/SnackbarContext";
import { uploadFile } from "@/lib/fileManagerService";
import { useRouter } from "next/navigation";
import Image from 'next/image'
import { IFileInfo } from "@/interfaces/i-file-info";

// 전역 이벤트 버스 (간단한 상태 공유용)
export const avatarUpdatedEvent = new EventTarget();

interface FileManagerProps {
    title?: string;
    choice?: number; // 0: 아바타 업로드, 1: 코드조각용 첨부 이미지 업로드
    onLoadFinished?: (fileInfo: IFileInfo) => void;
    onAttachImageFinished?: (dbPath: string) => void;
}

export default function FileManager({
    title = "프로필 사진 (drag & drop)",
    choice,
    onLoadFinished,
    onAttachImageFinished,
}: FileManagerProps) {
    const [fileName, setFileName] = useState<string>("");
    const [fileSize, setFileSize] = useState<number>(0);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<boolean>(false);
    const snackbar = useSnackbar();
    const router = useRouter();

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            if (!file.type.startsWith("image/")) {
                setUploadError(true);
                setUploadSuccess(false);
                snackbar.showSnackbar("이미지 파일만 가능합니다.", "error");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);

            setFileName(file.name);
            setFileSize(Math.round(file.size / 1024));
            setUploadSuccess(true);
            setUploadError(false);

            const formData = new FormData();
            formData.append("file", file);

            try {
                if (choice === undefined) {

                    snackbar.showSnackbar('업로드 형식을 선택하세요.')
                    return;
                }
                const response = await uploadFile(formData, choice);

                // if (choice === 0) {
                //     onLoadFinished?.(response);
                //     // 아바타 업로드 완료 시 이벤트 발생
                //     avatarUpdatedEvent.dispatchEvent(new Event("avatarUpdated"));
                //     snackbar.showSnackbar("아바타 업로드 성공!", "success");
                // } else {
                //     onAttachImageFinished?.(response.dbPath);
                //     snackbar.showSnackbar("첨부 이미지 업로드 성공!", "success");
                // }

                switch (choice) {
                    case 0: {
                        onLoadFinished?.(response);
                        // 아바타 업로드 완료 시 이벤트 발생
                        avatarUpdatedEvent.dispatchEvent(new Event("avatarUpdated"));
                        snackbar.showSnackbar("아바타 업로드 성공!", "success");
                    } break;
                    case 1: {
                        onAttachImageFinished?.(response.dbPath);
                        snackbar.showSnackbar("첨부 이미지 업로드 성공!", "success");
                    } break;
                    case 2: break;
                    default: break;
                }
            } catch (err: any) {
                setUploadError(true);
                setUploadSuccess(false);
                snackbar.showSnackbar(err.message || "파일 업로드 실패", "error");
                if (err.message.includes("로그인")) {
                    router.push("/membership/sign-in");
                }
            }
        },
        [choice, onLoadFinished, onAttachImageFinished, snackbar, router]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
    });

    return (
        <Box
            sx={{
                border: "2px dashed #ccc",
                borderRadius: "10px",
                padding: "1rem",
                textAlign: "center",
                backgroundColor: isDragActive ? "#f0f0f0" : "inherit",
                borderColor: uploadSuccess ? "green" : uploadError ? "red" : "#ccc",
            }}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            <IconButton>
                <CloudUploadIcon />
            </IconButton>
            <Typography>{title}</Typography>
            {fileName && (
                <Box>
                    {imagePreview && (
                        <Image
                            src={imagePreview}
                            width={500}
                            height={500}
                            style={{ width: "100%", borderRadius: "1rem", marginBottom: "0.5rem" }}
                            alt="Picture of the author"
                        />
                    )}
                    <Typography>
                        <span style={{ color: "#0288d1", fontWeight: "bold" }}>{fileName}</span> ({fileSize} KB)
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
