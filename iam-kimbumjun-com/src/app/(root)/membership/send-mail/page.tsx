'use client';

import VivTitle from '@/components/VivTitle';
import { ISendMailDTO } from '@/interfaces/i-sendmail-dto';
import { getToken } from '@/services/auth.service';
import { CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useState } from 'react';

export default function Page() {
    const token = getToken();
    const [loading, setLoading] = useState(false); // 전송 중 상태
    const [openDialog, setOpenDialog] = useState(false); // 결과 다이얼로그
    const [dialogMessage, setDialogMessage] = useState<string>(''); // 결과 메시지
    const [isSuccess, setIsSuccess] = useState<boolean>(true); // 성공 여부

    const handleSendMail = async () => {
        setLoading(true); // 전송 시작
        setOpenDialog(false); // 이전 다이얼로그 닫기

        const mail: ISendMailDTO = {

            subject: 'Hello, World',
            message: '<h3>Fine Thanks And You?</h3>',
        };

        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(mail),
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/send-mail`, request);
            const result = await response.json();

            if (!response.ok) {
                setDialogMessage(`메시지 전송 실패: ${result.message}`);
                setIsSuccess(false);
            } else {
                setDialogMessage(`메시지 전송 완료`);
                setIsSuccess(true);
            }
        } catch (error) {
            setDialogMessage(`오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
            setIsSuccess(false);
        } finally {
            setLoading(false); // 전송 완료
            setOpenDialog(true); // 결과 다이얼로그 열기
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <VivTitle title="메일 전송" />

            <Button
                onClick={handleSendMail}
                disabled={loading} // 전송 중 버튼 비활성화
                variant="contained"
                sx={{ px: 4, py: 2, bgcolor: 'slategray', '&:hover': { bgcolor: 'red' } }}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : '전송'}
            </Button>

            {/* 결과 다이얼로그 */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{isSuccess ? '전송 완료' : '전송 실패'}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: isSuccess ? 'green' : 'red' }}>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>확인</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
