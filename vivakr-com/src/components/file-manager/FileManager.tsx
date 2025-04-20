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
import { CodeData } from "@/types/code-form-data";
import { Control } from "react-hook-form";
import { useProfile } from '@/app/(root)/membership/profile/Profile' // useProfile 가져오기

// 전역 이벤트 버스 (간단한 상태 공유용)
export const avatarUpdatedEvent = new EventTarget();

interface FileManagerProps {
    title?: string;
    choice?: number; // 0: 아바타 업로드, 1: 코드조각용 첨부 이미지 업로드
    control?: Control<CodeData>;
    onLoadFinished?: (fileInfo: IFileInfo) => void;
    onAttachImageFinished?: (dbPath: string) => void;
}
function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
export default function FileManager({
    title = "프로필 사진 (drag & drop)",
    choice,
    control,
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
    const { user, updateUser } = useProfile(); // updateUser 가져오기, user.id 추가로 가져옴

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
                    // snackbar.showSnackbar('업로드 형식을 선택하세요.')
                    alert('업로드 형식을 선택하세요.');
                    return;
                }
                const response: IFileInfo = await uploadFile(formData, choice);

                switch (choice) {
                    case 0: { // * 아바타 업로드

                        // 부모 컴포넌트에서 전달받은 콜백함수
                        // 서버에서 받은 response IFileInfo 를 전달해
                        // 부모가 추가 작업을 할 수 있게 함
                        // 현재 Page.tsx에서는 이 prop 을 전달하지 않았으므로 실제로는 실행되지 않음.
                        onLoadFinished?.(response);
                        const userIdPrefix = `${user?.id}_`
                        const newAvata = response.dbPath.startsWith(userIdPrefix)
                            ? response.dbPath.slice(userIdPrefix.length)
                            : response.dbPath; // 안전장치로 userId 없으면 그대로 사용

                        // 서버 응답에 따라 조정
                        updateUser({ avata: newAvata }); // 상태 갱신

                        // * 전역 이벤트 버스
                        // 이 이벤트는 다른 컵포넌트가 "아바타가 업데이트 됐다" 는 신호를 받아 추가 작업을 할 수 이께 해줌.
                        // 현재 코드에서는 Page 나 AccountMenu 이 이벤트를 직접 (listen) 하지 않아
                        // 실질 적인 효과는 없음.
                        // avatarUpdatedEvent.dispatchEvent(new Event("avatarUpdated")); // 위 로직에서는 불필요함..
                        // snackbar.showSnackbar("아바타 업로드 성공!", "success");
                    } break;
                    case 1: { // 코드 첨부 이미지
                        onAttachImageFinished?.(response.dbPath);
                        // snackbar.showSnackbar("첨부 이미지 업로드 성공!", "success");
                    } break;
                    case 2: break;
                    default: break;
                }
            } catch (err: any) {
                setUploadError(true);
                setUploadSuccess(false);
                console.error(err.message || "파일업로드 실패", "error")
                // snackbar.showSnackbar(err.message || "파일 업로드 실패", "error");
                if (err.message.includes("로그인")) {
                    router.push("/membership/sign-in");
                }
            }
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [choice, onLoadFinished, user?.id, updateUser, onAttachImageFinished, router]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
        onDragEnter: undefined,
        onDragOver: undefined,
        onDragLeave: undefined
    });

    return (
        <Box
            sx={{
                border: "2px dashed #ccc",
                borderRadius: "10px",
                padding: "1rem",
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: 'auto',
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
                            style={{
                                width: "100%",
                                borderRadius: "1rem",
                                marginBottom: "0.5rem"
                            }}
                            alt="Picture of the author"
                        />
                    )}
                    <Typography sx={{ textAlign: 'center' }}>
                        <span style={{ color: "#0288d1", fontWeight: "bold" }}>{fileName}</span>
                        ({numberWithCommas(fileSize)} KB)
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
