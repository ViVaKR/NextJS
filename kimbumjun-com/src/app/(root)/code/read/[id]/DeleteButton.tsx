// src/app/code/read/DeleteButton.tsx
'use client';
import { startTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from '@/lib/SnackbarContext';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { ICodeResponse } from '@/interfaces/i-code-response';
import { useAuthCheck } from '@/hooks/useAuthCheck';
// import { deleteCode } from '@/lib/server-action';
import { deleteCodeAsync } from '@/lib/fetchCodes';

interface DeleteButtonProps {
    codeId: number;
    userId: string;
}

export default function DeleteButton({ codeId, userId }: DeleteButtonProps) {

    const [open, setOpen] = useState(false); // 다이얼로그 상태
    const router = useRouter();
    const snackbar = useSnackbar();
    const [canDelete, loading] = useAuthCheck(userId);

    const handleOpen = () => setOpen(true); // 다이얼로그 열기
    const handleClose = () => setOpen(false); // 다이얼로그 닫기
    const handleDelete = async () => {
        try {
            const response: ICodeResponse = await deleteCodeAsync(codeId);

            if (response.isSuccess) {
                snackbar.showSnackbar('코드가 삭제되었습니다.', 'success');
                router.push('/code');
                router.refresh();
            } else {
                snackbar.showSnackbar(response.message, 'warning');
            }

        } catch (err: any) {
            snackbar.showSnackbar(err.message || '삭제 실패', 'error');
        } finally {
            handleClose();
        }
    };

    // const handleDelete = async () => {
    //     setIsDeleting(true);
    //     startTransition(async () => {
    //         try {
    //             const response: ICodeResponse | null = await deleteCode(codeId);
    //             if (response) {
    //                 snackbar.showSnackbar(`${response.message}`, `${response.isSuccess ? 'success' : 'warning'}`);
    //                 if (response.isSuccess) {
    //                     router.refresh(); // 페이지 새로고침
    //                     snackbar.showSnackbar('코드 삭제 성공', 'success');
    //                     handleClose(); // 다이얼로그 닫기
    //                 } else {
    //                     snackbar.showSnackbar(response.message || '코드업데이트 실패', 'warning')
    //                 }
    //             }
    //         } catch (err: any) {
    //             snackbar.showSnackbar(err.message, 'error');
    //         }
    //         finally {
    //             setIsDeleting(false); // 삭제 상태 초기화
    //             handleClose(); // 성공/실패 여부 관계없이 다이얼로그 닫기
    //         }
    //     });
    // };

    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography>삭제권한 확인 중...</Typography>
            </Box>
        );
    }
    if (!canDelete) return null;
    return (
        <div>
            <button
                onClick={handleOpen}
                className="px-8 py-2
                cursor-pointer
                bg-red-500 text-white
                rounded-full hover:bg-red-600"
            >
                삭제
            </button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">삭제 확인</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        ID: {codeId}번 코드를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        No
                    </Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
