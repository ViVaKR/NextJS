'use client'

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import { useState } from 'react';
import { Tooltip } from '@mui/material';

export default function VivDailogBox() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);



    const handleClickOpen = () => {
        setOpen(true);
        setError(null); // 이전 오류 초기화
        setSuccess(null); // 이전 성공 메시지 초기화
        setEmail(''); // 이메일 초기화
    };

    // 다이얼로그 닫기
    const handleClose = () => {
        setOpen(false);
    };

    // ? 구독요청 처리
    const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 이메일 유효성 검사 (클라이언트 측)
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('유효한 이메일을 입력해주세요.');
            return;
        }

        try {

            // * 직접호출
            // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscribe/new`, {
            const requestInit: RequestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            };

            const response = await fetch(`/api/subscribe/new`, requestInit);
            const data = await response.json();
            if (!response.ok) {
                setError(data.message || '구독에 실패했습니다.');
                return;
            }

            setSuccess(data.message || '구독이 완료되었습니다!');
            setTimeout(() => handleClose(), 1500); // 1.5초 후 다이얼로그 닫기
        } catch (err: any) {
            setError('서버와의 연결에 문제가 발생했습니다.');
            setError(err.message);
        }
    }

    return (
        <>
            <Tooltip title="구독" arrow placement='right'>
                <button className='px-4 py-2
                        bg-slate-400
                        text-slate-200
                        cursor-pointer
                        transition
                        delay-100
                        duration-300
                        ease-in-out
                        hover:-translate-y-1
                        hover:scale-150
                        hover:bg-rose-800
                        hover:text-white
                        rounded-2xl'
                    onClick={handleClickOpen}>
                    <Diversity3OutlinedIcon />
                </button>
            </Tooltip>

            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: handleSubscribe
                        // onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                        //     event.preventDefault();
                        //     const formData = new FormData(event.currentTarget);
                        //     const formJson = Object.fromEntries((formData as any).entries());
                        //     const email = formJson.email;

                        //     console.log(email)

                        //     handleClose();
                        // },
                    },
                }}
            >
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        이 웹사이트를 구독하려면 이메일 주소를 입력해주세요. 가끔씩 업데이트 소식을 보내드립니다.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="email"
                        name="email"
                        label="이메일 주소"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!error}
                        helperText={error || ''}

                    />
                    {success && (
                        <DialogContentText sx={{ color: 'green', mt: 2 }}>
                            {success}
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>취소</Button>
                    <Button type="submit">구독</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
