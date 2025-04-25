'use client'

import { BarChart } from '@mui/x-charts/BarChart';
import { number } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function VivBarChart() {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [accounts, setAccounts] = useState<number>(0);
    const [codes, setCodes] = useState<number>(0);
    const [subscribe, setSubscribe] = useState<number>(0);
    const [fileCount, setFileCount] = useState<number>(0);

    useEffect(() => {
        const getAccounts = async () => {
            const respose = await fetch(`${apiUrl}/api/account/total`);
            if (!respose.ok) setAccounts(0);
            const result = await respose.json();
            setAccounts(result);
        }
        getAccounts();
    }, [apiUrl]);

    useEffect(() => {
        const getCodes = async () => {
            const respose = await fetch(`${apiUrl}/api/code/total`);
            if (!respose.ok) setCodes(0);
            const result = await respose.json();
            setCodes(result);
        }
        getCodes();
    }, [apiUrl]);

    useEffect(() => {
        const getSubscribes = async () => {
            const respose = await fetch(`${apiUrl}/api/subscribe/total`);
            if (!respose.ok) setSubscribe(0);
            const result = await respose.json();
            setSubscribe(result);
        }
        getSubscribes();
    }, [apiUrl]);

    useEffect(() => {
        const getSubscribes = async () => {
            const respose = await fetch(`${apiUrl}/api/subscribe/total`);
            if (!respose.ok) setSubscribe(0);
            const result = await respose.json();
            setSubscribe(result);
        }
        getSubscribes();
    }, [apiUrl]);

    useEffect(() => {
        const getFiles = async () => {
            const respose = await fetch(`${apiUrl}/api/filemanager/total`);
            if (!respose.ok) setFileCount(0);
            const result = await respose.json();
            setFileCount(result);
        }
        getFiles();
    }, [apiUrl]);

    return (
        <div className='flex flex-row justify-around min-w-[480px]'>
            <BarChart
                series={[
                    { data: [accounts] }, // 등록된 코드
                ]}
                height={290}
                width={180}
                xAxis={[{
                    data: ['가입회원'], scaleType: 'band',
                    colorMap: {
                        type: 'piecewise',
                        thresholds: [0, 10000000],
                        colors: ['green']
                    }
                }]}
            />
            <BarChart
                series={[
                    { data: [codes] }, // 등록된 코드
                ]}

                height={290}
                width={180}
                xAxis={[{
                    data: ['등록된 코드'], scaleType: 'band',
                    colorMap: {
                        type: 'piecewise',
                        thresholds: [0, 10000000],
                        colors: ['red']
                    }

                },

                ]}
            />
            <BarChart
                series={[
                    { data: [subscribe] },
                ]}

                height={290}
                width={180}
                xAxis={[{
                    data: ['구독자수'], scaleType: 'band',
                    colorMap: {
                        type: 'piecewise',
                        thresholds: [0, 10000000],
                        colors: ['yellow']
                    }
                },

                ]}
            />

            <BarChart
                series={[
                    { data: [fileCount] },
                ]}

                height={290}
                width={180}
                xAxis={[{
                    data: ['등록파일 수'], scaleType: 'band',
                    colorMap: {
                        type: 'piecewise',
                        thresholds: [0, 10000000],
                        colors: ['blue']
                    }
                },
                ]}
            />
        </div>
    );
}

