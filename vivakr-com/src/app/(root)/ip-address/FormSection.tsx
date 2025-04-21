// src/app/etc/ip-address/FormSection.tsx
'use client'; // 클라이언트 컴포넌트 선언

import { IIpInfo } from '@/interfaces/i-ip-info';
import { Box, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';

const api = process.env.NEXT_PUBLIC_IPINFO_URL2;

interface FormSectionProps {
    ipInfo: IIpInfo;
}

async function getInfoAsync(ip: string): Promise<IIpInfo> {
    const response = await fetch(`${api}/api/ip/${ip}`);
    const data: IIpInfo = await response.json();
    return data;
}

const FormSection: React.FC<FormSectionProps> = ({ ipInfo: initalIpInfo }) => {
    const [ipAddress, setIpAddress] = useState<string>('');
    const [info, setInfo] = useState<IIpInfo>(initalIpInfo);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDelete = () => {
        setIpAddress(''); // Delete 버튼 클릭 시 값 지우기
    };

    const handleGetIpInfo = async () => {

        if (ipAddress) {
            setIsLoading(true);
            try {
                // const ipInfo = await getIpInfomations(ipAddress);
                const ipInfo = await getInfoAsync(ipAddress);
                setInfo(ipInfo);
                setError(null); // 성공 시 에러 초기화
            } catch (error) {
                setError('Failed to fetch IP info. Please try again.');
                console.error('Error fetching IP info: ', error)
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleBlur = () => {
        if (ipAddress && !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ipAddress)) {
            setError('Invalid IP format');
        } else {
            setError(null);
        }
    }

    const handleIpAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIpAddress(e.target.value);
    };

    const infoItems = [
        { label: 'IP', value: info.ip },
        { label: 'City', value: info.city },
        { label: 'Region', value: info.region },
        { label: 'Country', value: info.country },
        { label: 'Location', value: info.location },
        { label: 'ISP', value: info.isp },
    ];

    return (
        <div className='min-h-screen'>
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                noValidate
                autoComplete="off"
            >
                <h1 className="text-slate-400 text-center w-96 mx-auto mb-4">{info.ip}</h1>

                <TextField id="standard-basic"
                    label="IP Address"
                    variant="standard"
                    value={ipAddress}
                    onBlur={handleBlur}
                    onChange={handleIpAddress} />
                <span className='text-xs'>
                    {error && <p className="text-red-400 text-center">{error}</p>}
                </span>

                <Stack direction="row" spacing={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton
                        color="warning"
                        onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                    <div className='flex-1'></div>
                    <IconButton color="primary"
                        disabled={!ipAddress || isLoading}
                        onClick={handleGetIpInfo}>
                        <TouchAppOutlinedIcon />
                    </IconButton>
                </Stack>
            </Box>

            <div className="border-2 rounded-2xl border-slate-400 p-4 flex flex-col mx-auto w-[500px]">
                <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem' }}>
                    {infoItems.map((item) => (
                        <React.Fragment key={item.label}>
                            <dt style={{ fontWeight: 'bold', marginRight: '2em' }}>{item.label}</dt>
                            <dd>{item.value}</dd>
                        </React.Fragment>
                    ))}
                </dl>
                <span>
                    {isLoading && <p className="text-blue-500 text-xs text-center">Loading...</p>}
                    {error && <p className="text-red-500 text-center">{error}</p>}
                </span>
            </div>
        </div>
    );
};

export default FormSection;
