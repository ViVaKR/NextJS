'use client';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Typography, Box, Tooltip } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import CookieIcon from '@mui/icons-material/Cookie';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import Link from 'next/link';
import VivDailogBox from './VivDialogBox';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

export default function VivBottomNav() {
    const [value, setValue] = useState('');
    const router = useRouter();

    const handleChange = (e: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const handleClick = (url: string) => {
        router.push(url);
    };

    return (
        <Box component="footer"
            sx={{
                borderTop: '4px solid #e0e0e0',
                background: 'linear-gradient(180deg, #F08080 0%, #ffffff 100%)',
                padding: '2em 0',
                boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
            }}
        >
            {/* 상단 저작권 및 브랜드 정보 */}
            <Typography
                sx={{
                    textAlign: 'center',
                    marginBottom: '1.5em',
                    fontFamily: 'Poppins, sans-serif',
                    color: '#fff',
                    fontSize: '1.2rem',
                }}
            >
                © {new Date().getFullYear()} BM Co. All rights reserved. Designed with 💖 by ViVaKR
            </Typography>

            {/* 네비게이션 */}
            <BottomNavigation
                sx={{
                    width: '100%',
                    maxWidth: '800px',
                    margin: '0 auto',
                    background: 'transparent',
                    padding: '0.5em 0',
                    '& .MuiBottomNavigationAction-root': {
                        color: '#757575',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: '#1976d2',
                            transform: 'scale(1.1)',
                        },
                        '&.Mui-selected': {
                            color: '#1976d2',
                        },
                    },
                }}

                onChange={handleChange}
                value={value}
            >
                <BottomNavigationAction
                    label="개인정보 처리방침"
                    value="privacy-policy"
                    showLabel={true}
                    className='!text-rose-900'
                    onClick={() => handleClick('/policy/privacy')}
                    icon={<PrivacyTipOutlinedIcon />}
                />
                <BottomNavigationAction
                    label="이용약관"
                    value="terms-of-service"
                    showLabel={true}
                    className='!text-rose-900'
                    onClick={() => handleClick('/policy/terms-of-service')}
                    icon={<GavelIcon />}
                />
                <BottomNavigationAction
                    label="쿠키정책"
                    value="cookie-policy"
                    showLabel={true}
                    className='!text-rose-900'
                    onClick={() => handleClick('/policy/cookie')}
                    icon={<CookieIcon />}
                />


            </BottomNavigation>

            <Typography
                sx={{
                    textAlign: 'center',
                    marginTop: '1em',
                    fontSize: '0.9rem',
                    color: '#999',
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    fontFamily: 'Poppins, sans-serif',
                }}>

                <Link href="mailto:iam@kimbumjun.com"
                    className='px-4 py-2
                            bg-slate-400
                            text-slate-200
                            transition
                            delay-150
                            duration-300
                            ease-in-out
                            hover:-translate-y-1
                            hover:scale-150
                            hover:bg-rose-800 hover:text-white
                            rounded-2xl'>
                    <Tooltip title="문의메일" arrow placement='left'>
                        <EmailOutlinedIcon />
                    </Tooltip>
                </Link>
                <VivDailogBox />
                <Link href="https://github.com/ViVaKR/NextJS/tree/main/vivakr-com" target='_blank'
                    className='px-4 py-2
                            bg-slate-400
                            text-slate-200
                            transition
                            delay-150
                            duration-300
                            ease-in-out
                            hover:-translate-y-1
                            hover:scale-150
                            hover:bg-rose-800 hover:text-white
                            rounded-2xl'>
                    <Tooltip title="사이트 소스(Next.js)" arrow placement='right'>
                        <div className='text-transparent
                        bg-github bg-contain bg-no-repeat bg-center'>source</div>
                    </Tooltip>
                </Link>

            </Typography>
        </Box >
    );
}
// https://github.com/ViVaKR/NextJS/tree/main/vivakr-com
