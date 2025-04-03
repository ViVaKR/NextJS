'use client'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Smooch } from 'next/font/google';
import { Tooltip } from '@mui/material';

export default function VivBottomNav() {
    const [value, setValue] = useState('recents');
    const router = useRouter();

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const handleClick = (url: string) => {
        router.push(url);
    }

    return (
        <BottomNavigation
            sx={{ width: '100%', borderTop: '2px solid var(--color-slate-400)', marginTop: '0' }}
            value={value}
            onChange={handleChange}>
            <BottomNavigationAction
                label="Recents"
                value="recents"
                icon={<RestoreIcon />}
            />
            <BottomNavigationAction
                label="Favorites"
                value="favorites"
                icon={<FavoriteIcon />}
            />
            <BottomNavigationAction
                label="Nearby"
                value="nearby"
                icon={<LocationOnIcon />}
            />

            <Tooltip title="고객정보 보호 안내">
                <BottomNavigationAction
                    label="Folder"
                    value="folder"
                    onClick={() => handleClick('/privacy-policy')}
                    icon={<FolderIcon />} />
            </Tooltip>
        </BottomNavigation>
    );
}
