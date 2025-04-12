// src/app/(root)/subscriber/cancel
'use client'
import VivTitle from '@/components/VivTitle';
import { IUnSubscribeDTO } from '@/interfaces/i-un-subscribe-dto';
import { useSnackbar } from '@/lib/SnackbarContext';
import { CircularProgress } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CancelPage() {

    const [data, setData] = useState<IUnSubscribeDTO | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [run, setRun] = useState<boolean>(false);
    const { showSnackbar } = useSnackbar();
    const router = useRouter();

    const searchParams = useSearchParams();

    useEffect(() => {
        setError(null);
        const tokenFormUrl = searchParams.get('token');
        const emailFromUrl = searchParams.get('email');
        const idFromUrl = searchParams.get('id');
        if (tokenFormUrl) {
            try {

                if (emailFromUrl && tokenFormUrl) {
                    const decodedEmail = decodeURIComponent(emailFromUrl);
                    const decodedToke = decodeURIComponent(tokenFormUrl);
                    const dto: IUnSubscribeDTO = {
                        email: decodedEmail,
                        token: decodedToke,
                        subscribeId: Number(idFromUrl)
                    }
                    setData(dto);
                }
            } catch (err: any) {
                setError(err.message);
            }
        }
    }, [searchParams]);


    const handleUnSubscribe = async () => {
        setRun(true);
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/subscribe/cancel`;

        if (!data) {
            setError('잘못된 요청입니다. 관리자에게 메일 (hello.viva.bm@gmail.com) 로 요청하여 주세요.')
            return;
        }
        const deleteData: IUnSubscribeDTO = {
            email: data?.email,
            token: data?.token,
            subscribeId: data?.subscribeId
        }

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data?.email}`
                },
                body: JSON.stringify(deleteData),
                cache: 'no-cache'
            })

            const result = await response.json();
            if (!response.ok) {
                setError(result.message);
                return;
            }
            setRun(false);
            setError(result.message);
            router.push('/');

            showSnackbar(result.message, 'success', 'top', 'center');




        } catch (err: any) {
            setError(err.message + ' 잘못된 요청입니다. 관리자에게 메일 (hello.viva.bm@gmail.com) 로 요청하여 주세요.');
        }
    }

    return (
        <div className='flex flex-col gap-2 items-center'>
            <VivTitle title='구독해지' />
            <p className='text-center h-12 rounded-2xl px-8 py-2 text-2xl text-slate-400 content-center bg-slate-200'>{data?.subscribeId} {data?.email} </p>
            <p className='text-center h-12 rounded-2xl px-8 py-2 text-sm text-slate-400
            content-center bg-slate-200'> {data?.token} </p>

            {error && (
                <p className='text-red-400 text-center'>{error}</p>
            )}

            <button
                disabled={run}
                onClick={handleUnSubscribe}

                className='px-4 py-2
                bg-slate-400
                hover:bg-red-400
                cursor-pointer
                rounded-2xl
                text-white'>
                {run ? <CircularProgress size={24} color="inherit" /> : '구독해지'}
            </button>
        </div>
    );
}
