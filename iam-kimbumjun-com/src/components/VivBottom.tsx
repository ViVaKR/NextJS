'use client'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tooltip, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

export default function VivBottomNav() {
    const [value, setValue] = useState('');
    const router = useRouter();

    const handleChange = (e: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const handleClick = (url: string) => { router.push(url); }

    return (

        <div className='flex flex-col justify-center border-t-4 border-t-slate-400'>

            <Typography sx={{ margin: '2em auto' }}

                className='text-gray-500 !text-xl !font-poppins'>
                Copyright {(new Date().getFullYear())}. BM Co. All rights reserved.
            </Typography>

            <BottomNavigation
                sx={{
                    width: '100%',
                    margin: '0 auto',
                    padding: '1em 0'
                }}
                value={value}
                onChange={handleChange}>

                <Tooltip title="홈" arrow>
                    <BottomNavigationAction
                        label="Home"
                        value="home"
                        onClick={() => handleClick('/')}
                        icon={<HomeOutlinedIcon />}
                    />
                </Tooltip>

                <Tooltip title="코드조각">
                    <BottomNavigationAction
                        label="Code"
                        value="code"
                        onClick={() => handleClick('/code')}
                        icon={<CodeOutlinedIcon />}
                    />

                </Tooltip>

                <Tooltip title="고객정보 보호 안내">
                    <BottomNavigationAction
                        label="Folder"
                        value="고객정보 보호 안내"
                        onClick={() => handleClick('/privacy-policy')}
                        icon={<FolderIcon />} />
                </Tooltip>

                <Tooltip title="돌아가기" arrow>
                    <BottomNavigationAction
                        label="Recents"
                        value="recents"
                        onClick={() => router.back()}
                        icon={<RestoreIcon />}
                    />
                </Tooltip>

            </BottomNavigation>
            <p className='min-h-96 !bg-white'></p>
        </div>
    );
}
