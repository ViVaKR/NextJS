// src/menus/AccountMenu.tsx
'use client';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getMembershipItems } from '@/data/menu-items';
import { useEffect, useState } from 'react';
import { IFileInfo } from '@/interfaces/i-file-info';
import { apiFetch } from '@/lib/api';
import { useProfile } from '@/app/(membership)/profile/Profile';
import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';

export default function AccountMenu() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [userAvata, setAvata] = useState<IFileInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { user, isLoading: profileLoading, error: profileError } = useProfile();

  useEffect(() => {
    if (!user) {
      setAvata(null);
      setIsLoading(false);
      return;
    }
    const controller = new AbortController();

    const fetchAvata = async () => {
      try {
        const result = await apiFetch('/api/FileManager/GetUserImage', {
          signal: controller.signal,
        });
        if (!result) return;
        const isAvata = (data: any): data is IFileInfo => 'dbPath' in data;
        if (isAvata(result)) setAvata(result);
        setError(null);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching avatar:', err);
        }
        setError('Failed to load Avata. Please try again.');
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvata();
    return () => controller.abort();
  }, [user, error]);

  const getAvataUrl = () => {
    if (!user || !userAvata?.dbPath) return '/images/login-icon.png';
    return `${baseUrl}/images/${user.id}_${userAvata.dbPath}`;
  };

  const getFullName = () => {
    return user?.fullName || '';
  };

  const getRoles = () => {
    return user?.roles?.join(', ') || ''; // roles가 없으면 빈 문자열
  };

  const avataHandleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClick = (url: string) => {
    handleClose();
    router.push(url);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const filteredMenus = getMembershipItems().filter((menu) => {
    const isAuthenticated = !!user;
    const userRoles = user?.roles || [];
    if (menu.requiresAuth && !isAuthenticated) return false;
    if (menu.hideWhenAuth && isAuthenticated) return false;
    if (
      menu.requiredRoles &&
      !menu.requiredRoles.some((role) => userRoles.includes(role))
    ) {
      return false;
    }
    return true;
  });

  if (profileError) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '0.5em' }}>
      <Box className="flex gap-2 text-nowrap">
        <IconButton
          onClick={avataHandleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          disabled={profileLoading}>
          <Avatar sx={{ width: 40, height: 40 }}>
            <Image
              src={!isLoading ? getAvataUrl() : '/images/login-icon.png'}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              fill={true}
              sizes="40px"
              alt="avata"
            />
          </Avatar>
        </IconButton>
        <div className="flex flex-col gap-1 text-xs justify-center max-md:hidden">
          <span>{getFullName()}</span>
          <span>{getRoles()}</span>
        </div>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        {filteredMenus.map((menu, idx) => (
          <div key={idx}>
            {menu.hasDivider && <Divider />}
            <MenuItem
              onClick={() => handleMenuClick(menu.url)}
              className="gap-2">
              <ClearAllOutlinedIcon />
              {menu.title}
            </MenuItem>
          </div>
        ))}
      </Menu>
    </Box>
  );
}
