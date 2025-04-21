// src/app/code/read/DeleteButton.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from '@/lib/SnackbarContext';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { getTokenAsync } from '@/services/auth.service';
import { IAuthResponse } from '@/interfaces/i-auth-response';
import { useProfile } from '../profile/Profile';

interface DeleteButtonProps {
    userEmail?: string;
    userPassword?: string;
}

export default function DeleteAccount({ userPassword }: DeleteButtonProps) {

    const [email, setEmail] = useState('');
    const { user } = useProfile();

    useEffect(() => {

        if (user?.email)
            setEmail(user?.email);
    }, [user?.email])

    const [open, setOpen] = useState(false); // 다이얼로그 상태
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const handleOpen = () => setOpen(true); // 다이얼로그 열기
    const handleClose = () => setOpen(false); // 다이얼로그 닫기
    const handleDelete = async () => {
        try {
            const token = await getTokenAsync();
            const deleteData: DeleteButtonProps = {
                userEmail: email,
                userPassword: userPassword,
            }
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api/account/cancel-account`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // 인증 헤더 추가
                },
                body: JSON.stringify(deleteData)
            })

            const result: IAuthResponse = await response.json();

            if (response.ok && result.isSuccess) {
                showSnackbar("호원탈퇴 완료! 로그아웃 하시면 완료됩니다.");
                router.push('/membership/sign-out');
            } else {
                showSnackbar(result.message || "비밀번호 변경 실패");
            }

        } catch (err: any) {
            showSnackbar(`서버측 오류가 발생하였습니다. : ${err.message}`)
        }

        finally {
            handleClose(); // 다이얼로그 닫기
        }
    };

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
                        회원탈퇴를 진행 하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
