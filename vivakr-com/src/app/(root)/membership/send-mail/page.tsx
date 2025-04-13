'use client';

import VivDataGrid from '@/components/VivDataGrid';
import VivTitle from '@/components/VivTitle';
import { ISendMailDTO } from '@/interfaces/i-sendmail-dto';
import { ISubscribe } from '@/interfaces/i-subscribe';
import { getToken } from '@/services/auth.service';
import { CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function Page() {

    const [data, setData] = useState<ISubscribe[]>([]);
    const token = getToken();
    const [openDialog, setOpenDialog] = useState(false); // 결과 다이얼로그
    const [dialogMessage, setDialogMessage] = useState<string>(''); // 결과 메시지
    const [isSuccess, setIsSuccess] = useState<boolean>(true); // 성공 여부

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/subscribe/list`;
    useEffect(() => {
        const getSubscriber = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    cache: 'no-store',
                });

                const result: ISubscribe[] = await response.json();
                if (!response.ok) {
                    return;
                }
                setData(result);
            } catch (err: any) {
                console.log(err.message);
            }
        }
        getSubscriber();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<ISendMailDTO>({
        defaultValues: {
            subject: '',
            message: '',
        },
        mode: 'onTouched'
    },);

    const onSubmit = async (data: ISendMailDTO) => {

        setOpenDialog(false); // 이전 다이얼로그 닫기

        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/send-mail`, request);
            const result = await response.json();

            if (!response.ok) {
                setDialogMessage(`메시지 전송 실패: ${result.message} `);
                setIsSuccess(false);
            } else {
                setDialogMessage(`메시지 전송 완료`);
                setIsSuccess(true);
            }

            reset();
        } catch (error) {
            setDialogMessage(`오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'} `);
            setIsSuccess(false);
        } finally {
            setOpenDialog(true); // 결과 다이얼로그 열기
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: '번호',
            width: 70,
            filterable: true,
            type: 'number',
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'email',
            headerName: '이메일',
            width: 150,
            flex: 1,
            filterable: true,
            type: 'string',
            headerAlign: 'center'
        },
        {
            field: 'created',
            headerName: '가입일자',
            width: 100,
            filterable: true,
            type: 'string',
            headerAlign: 'center'
        },
    ];



    return (
        <>
            <VivTitle title="메일 전송" />

            <form
                autoComplete='off'
                className='flex flex-col gap-5 w-full px-8'
                onSubmit={handleSubmit(onSubmit)}
            >

                <Grid container sx={{ width: '100%' }} spacing={2}>
                    <Grid size={12}>

                        {/* 제목 */}
                        <Controller
                            name="subject"
                            control={control}
                            rules={{ required: '제목을 입력해주세요.' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="제목"
                                    variant="filled"
                                    error={!!errors.subject}
                                    sx={{ my: '0px' }}
                                    color='success'
                                    helperText={errors.subject?.message}
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={12}>
                        {/* 본문 */}
                        <Controller
                            name="message"
                            control={control}
                            rules={{ required: '제목을 입력해주세요.' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="내용"
                                    variant="filled"
                                    error={!!errors.message}
                                    sx={{ my: '0px' }}
                                    color='success'
                                    multiline
                                    rows={20}
                                    helperText={errors.message?.message}
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                <div className='w-full flex justify-center'>



                    <Button
                        disabled={isSubmitting} // 전송 중 버튼 비활성화
                        className='!px-4
                        !py-2
                        !cursor-pointer !rounded-lg !bg-slate-400 !text-white
                        hover:!bg-red-400
                        !my-8
                        !border'
                        type='submit'
                    >
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : '전송'}
                    </Button>
                </div>
            </form>

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

            {/* <VivDataGrid /> */}
            <VivDataGrid<ISubscribe>
                columns={columns}
                initialData={data}
            />
        </>
    );
}
/*
VivDataGrid<T>({
  title,
  columns,
  initialData = [],
  onRowClick,
}: VivDataGridProps<T>)

*/
