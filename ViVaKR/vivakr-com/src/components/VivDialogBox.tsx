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
import { CircularProgress, Tooltip } from '@mui/material';

export default function VivDailogBox() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [choice, setChoice] = useState<boolean>(true);
    const [disable, setDisable] = useState<boolean>(false);

    const handleClickOpen = () => {
        setOpen(true);
        setError(null); // 이전 오류 초기화
        setSuccess(null); // 이전 성공 메시지 초기화
        setEmail(''); // 이메일 초기화
    };

    //? 구독신청
    const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setDisable(true)

        // 이메일 유효성 검사
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('유효한 이메일을 입력해주세요.');
            setDisable(false);
            return;
        }

        const url = choice ? `${process.env.NEXT_PUBLIC_API_URL}/api/subscribe/new` : `${process.env.NEXT_PUBLIC_API_URL}/api/subscribe/remove-subscribe`;

        if (choice) {
            // 구독신청
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

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
            } finally {
                setDisable(false);
            }

        } else {
            // 구독취소
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();
                if (!response.ok) {
                    setError('구독 취소에 실패했습니다. 운영진에게 메일을 발송하여 주세요. --> ( viv.buddha@gmail.com )');
                    return;
                }

                setSuccess(data.message || '구독취소 완료 되었습니다!');
                setTimeout(() => handleClose(), 1500); // 1.5초 후 다이얼로그 닫기
            } catch (err: any) {
                setError('서버와의 연결에 문제가 발생했습니다.');
                setError(err.message);
            } finally {
                setDisable(false);
            }
        }

        setDisable(false);
    }

    const handleClose = () => {
        setOpen(false);
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
                    },
                }}
            >
                <DialogTitle>구독</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        이 웹사이트를 구독하려면 이메일 주소를 입력해주세요.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="email"
                        name="email"
                        label="구독 메일"
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
                <DialogActions className='flex !justify-evenly items-center'>
                    <Tooltip title="구독하신 이메일 주소를 넣으시고 취소버튼을 클릭하세요. 확인메일을 발송하여 드립니다." arrow placement='left'>
                        <Button disabled={disable} onClick={() => { setChoice(false) }} type='submit' id='cancel'>
                            {disable ? <CircularProgress size={24} color="inherit" /> : '구독취소'}
                        </Button>
                    </Tooltip>

                    <Button onClick={handleClose} disabled={disable} >닫기</Button>
                    <Tooltip title="구독하실 이메일 주소를 넣으시고 구독버튼을 클릭하세요" arrow placement='right'>
                        <Button disabled={disable} onClick={() => setChoice(true)} type="submit" id='ok'>
                            {disable ? <CircularProgress size={24} color="inherit" /> : '구독하기'}
                        </Button>
                    </Tooltip>
                </DialogActions>
            </Dialog>
        </>
    );
}
