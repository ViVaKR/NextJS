'use client';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Typography, Box } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import GavelIcon from '@mui/icons-material/Gavel';
import CookieIcon from '@mui/icons-material/Cookie';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import Link from 'next/link';

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
                background: 'linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%)',
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
                    color: '#666',
                    fontSize: '1.1rem',
                }}
            >
                © {new Date().getFullYear()} BM Co. All rights reserved. | Designed with 💖 by ViVaKR
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
                    onClick={() => handleClick('/privacy-policy')}
                    icon={<PrivacyTipOutlinedIcon />}
                />
                <BottomNavigationAction
                    label="이용약관"
                    value="terms-of-service"
                    onClick={() => handleClick('/terms-of-service')}
                    icon={<GavelIcon />}
                />
                <BottomNavigationAction
                    label="쿠키정책"
                    value="cookie-policy"

                    onClick={() => handleClick('/cookie-policy')}
                    icon={<CookieIcon />}
                />
            </BottomNavigation>

            <Typography
                sx={{
                    textAlign: 'center',
                    marginTop: '1em',
                    fontSize: '0.9rem',
                    color: '#999',
                    fontFamily: 'Poppins, sans-serif',
                }}>
                <Link href="mailto:iam@kimbumjun.com">담당자</Link>
            </Typography>
        </Box>
    );
}
