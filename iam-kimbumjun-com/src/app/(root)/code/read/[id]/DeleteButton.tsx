// src/app/code/read/DeleteButton.tsx
'use client';
import { useState, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCode } from '@/lib/fetchCodes';
import { useSnackbar } from '@/lib/SnackbarContext';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ICodeResponse } from '@/interfaces/i-code-response';
import { useAuthCheck } from '@/hooks/useAuthCheck';

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
            const response: ICodeResponse = await deleteCode(codeId);
            if (response.isSuccess) {
                snackbar.showSnackbar('코드가 삭제되었습니다.', 'success');
                router.push('/code'); // 삭제 후 이동
                router.refresh(); // 페이지 새로고침으로 데이터 갱신 트리거
            } else {
                snackbar.showSnackbar(response.message, 'warning');
            }
        } catch (err: any) {
            snackbar.showSnackbar(err.message || '삭제 실패', 'error');
        } finally {
            handleClose(); // 다이얼로그 닫기
        }
    };

    if (loading) <span>Loading...</span>
    if (!canDelete) return null;
    return (
        <div>
            <button
                onClick={handleOpen} // 클릭 시 다이얼로그 열기
                className="px-8 py-2
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
