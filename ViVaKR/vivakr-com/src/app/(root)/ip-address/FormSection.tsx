// src/app/etc/ip-address/FormSection.tsx
'use client';

import { IIpInfo } from '@/interfaces/i-ip-info';
import { Box, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';

const api = process.env.NEXT_PUBLIC_IPINFO_URL2;

interface FormSectionProps {
    initialIpInfo: IIpInfo;
    onIpInfoFetched?: (ipInfo: IIpInfo) => void; // 부모에게 IP 정보를 전달할 함수 타입 정의
}

async function getInfoAsync(ip: string): Promise<IIpInfo> {

    const response = await fetch(`${api}/api/ip/${ip}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch IP info: ${response.statusText}`);
    }
    const data: IIpInfo = await response.json();
    return data;
}

const FormSection: React.FC<FormSectionProps> = ({ initialIpInfo, onIpInfoFetched }) => {

    const [ipAddress, setIpAddress] = useState<string>('');
    const [info, setInfo] = useState<IIpInfo>(initialIpInfo);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // 부모로부터 받은 initialIpInfo가 변경될 경우 내부 info 상태 업데이트 (선택적)
    // 만약 부모가 초기 IP 외에 다른 이유로 initialIpInfo를 변경할 가능성이 있다면 필요

    const handleDelete = () => {
        setIpAddress('');
        setError(null);
    };

    const handleGetIpInfo = async () => {

        if (ipAddress && !isLoading) {
            setIsLoading(true);
            setError(null); // 이전 에러 초기화
            try {
                const fetchedIpInfo = await getInfoAsync(ipAddress);
                setInfo(fetchedIpInfo); // 자식 컴포넌트 내부 상태 업데이트 (표시용)

                // ? 핵심,성공적으로 IP 정보를 가졍왔으면 부모로 부터 받은 콜백 함수 호출 하여 데이터 전달
                if (onIpInfoFetched)
                    onIpInfoFetched(fetchedIpInfo);
                // ? ------------------------
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch IP info. Please try again.';
                setError(errorMessage);
                console.error('Error fetching IP info: ', error);
                // 에러 발생 시 부모에게 알릴 필요가 있다면, onIpInfoFetched(null) 등을 호출할 수도 있음
                const nullIp: IIpInfo = {}
                if (onIpInfoFetched)
                    onIpInfoFetched(nullIp); // 예시: 에러 시 null 전달
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handleBlur = () => {
        if (ipAddress && !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ipAddress)) {
            setError('Invalid IP format');
        } else if (error === 'Invalid IP format') { // 유효한 형식으로 바뀌면 에러 제거
            setError(null);
        }
    }

    const handleIpAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIpAddress(e.target.value);
        if (error) { // 입력 시 에러 메시지 초기화 (선택적)
            setError(null);
        }
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
        <div className='h-auto'>
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                noValidate
                autoComplete="off"
            >
                <h1 className="text-slate-400 text-center w-96 mx-auto mb-4">{info.ip}</h1>

                <TextField id="ipaddress" name='ipaddress'
                    label="Enter IP Address"
                    variant="standard"
                    value={ipAddress}
                    onBlur={handleBlur}
                    onChange={handleIpAddress}
                    helperText={error}
                    disabled={isLoading}
                />
                <span className='text-xs'>
                    {error && <p className="text-red-400 text-center">{error}</p>}
                </span>

                <Stack direction="row" spacing={1} style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <IconButton
                        color="warning"
                        disabled={isLoading}
                        onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                    <div className='flex-1'></div>
                    <IconButton color="primary"
                        disabled={!ipAddress || isLoading || !!error}
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
