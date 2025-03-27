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
import { useEffect, useState, useCallback } from 'react';
import { IFileInfo } from '@/interfaces/i-file-info';
import { apiFetch } from '@/lib/api';
import { useProfile } from '@/app/(root)/membership/profile/Profile';

export default function AccountMenu() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [userAvata, setAvata] = useState<IFileInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [avatarSrc, setAvatarSrc] = useState<string>('/images/login-icon.png');
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { user, isLoading: profileLoading, error: profileError } = useProfile();

  useEffect(() => {
    if (!user) {
      setAvata(null);
      setIsLoading(false);
      setAvatarSrc('/images/login-icon.png');
      return;
    }
    const controller = new AbortController();

    const fetchAvata = async () => {
      try {
        const result = await apiFetch('/api/FileManager/GetUserImage', {
          signal: controller.signal,
        });
        const isAvata = (data: any): data is IFileInfo => 'dbPath' in data;
        if (isAvata(result)) {
          setAvata(result);
        } else {
          setAvata(null); // 유효하지 않은 데이터면 null 설정
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching avatar:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvata();
    return () => controller.abort();
  }, [user]);
  /*
    문제: getAvataUrl이 컴포넌트 렌더링마다 새 함수로 생성됨 → useEffect 의존성 배열에 포함되면 매번 실행됨.
    원인: 함수는 기본적으로 객체처럼 참조가 매번 달라지니까, useEffect가 불필요하게 재실행돼.
    해결: useCallback으로 함수를 메모이제이션(Memoization)해서 참조를 고정.
    */

  // 타입 정의 유지
  const getAvataUrl = useCallback(() => {
    if (!user || isLoading || !userAvata?.dbPath) {
      return '/images/login-icon.png';
    }
    const dbPath = userAvata.dbPath.trim();
    if (!dbPath || dbPath === '-' || !/\.(jpg|jpeg|png|gif)$/i.test(dbPath)) {
      return '/images/login-icon.png';
    }
    return `${baseUrl}/images/${user.id}_${dbPath}`;
  }, [user, isLoading, userAvata, baseUrl]); // 의존성 배열 추가

  useEffect(() => {
    const url = getAvataUrl();
    if (url !== '/images/login-icon.png') {
      fetch(url)
        .then((res) => setAvatarSrc(res.ok ? url : '/images/login-icon.png'))
        .catch(() => setAvatarSrc('/images/login-icon.png'));
    } else {
      setAvatarSrc(url);
    }
  }, [getAvataUrl]);

  const getFullName = () => user?.fullName || '';
  const getRoles = () => user?.roles?.join(', ') || '';

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

  //--> Start
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
              src={avatarSrc}
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
              {/* <ClearAllOutlinedIcon /> */}
              <span className="material-symbols-outlined">{menu.icon}</span>

              {menu.title}
            </MenuItem>
          </div>
        ))}
      </Menu>
    </Box>
  );
}
