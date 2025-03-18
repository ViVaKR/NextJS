'use client';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { PersonAdd, Settings, Logout, Login } from '@mui/icons-material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getMembershipItems } from '@/data/menu-items';
import { IMenu } from '@/interfaces/i-menu';
import { useEffect, useState } from 'react';
import { IFileInfo } from '@/interfaces/i-file-info';
import { apiFetch } from '@/lib/api';
import { useProfile } from '@/app/membership/profile/Profile';

const iconMap: Record<string, React.ComponentType> = {
  profile: Avatar,
  'all-account': Avatar,
  'my-account': Avatar,
  'add-account': PersonAdd,
  settings: Settings,
  login: Login,
  logout: Logout,
};

export default function AccountMenu() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [userAvata, setAvata] = useState<IFileInfo | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const profile = useProfile();
  const { user, isLoading: profileLoading, error: profileError } = useProfile();

  useEffect(() => {
    if (!user) {
      setAvata(null);
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
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching avatar:', error);
        }
        setError('Failed to load Avata. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvata();
    return () => controller.abort(); // 언마운트 시 요청 취소
  }, [user]); // user가 변경될 때만 실행

  const getAvataUrl = () => {
    if (profile == null || userAvata == null) return null;
    return `${baseUrl}/images/${profile.user?.id}_${userAvata?.dbPath}`;
  };

  const avataHandleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  // const handleClick = (e: React.MouseEvent<HTMLElement>) => {
  //   const tag = e.currentTarget.getAttribute('data-tag');
  //   router.push(`${tag}`);
  //   handleClose();
  // };

  const handleMenuClick = (url: string) => {
    // if (url === '/membership/sign-out') {
    //   router.push('/');

    // } else {
    //   router.push(url);
    // }

    handleClose();
    router.push(url);
  };

  // const handleClick = (e: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(e.currentTarget);
  // };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menus: IMenu[] = getMembershipItems();
  // if (profileError) return null; // 프로필 에러 시 아무것도 렌더링 안 함

  // 메뉴 필터링
  const filteredMenus = getMembershipItems().filter((menu) => {
    const isAuthenticated = !!user;
    const userRoles = user?.roles || [];

    // 로그인 필요 조건
    if (menu.requiresAuth && !isAuthenticated) return false;
    // 로그인 시 숨김 조건
    if (menu.hideWhenAuth && isAuthenticated) return false;
    // 역할 기반 필터링
    if (
      menu.requiredRoles &&
      !menu.requiredRoles.some((role) => userRoles.includes(role))
    )
      return false;

    return true;
  });

  if (profileError) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
      <Tooltip title="Account settings">
        <IconButton
          onClick={avataHandleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          disabled={profileLoading} // 로딩 중 비활성화
        >
          <Avatar sx={{ width: 32, height: 32, border: '2x solid #fff' }}>
            <Image
              src={
                !isLoading
                  ? getAvataUrl() ?? '/images/avata-1024.png'
                  : '/images/avata-1024.png'
              }
              fill={true}
              sizes="32px" // Avatar 크기에 맞춤
              alt="avata"
              priority={true} // 초기 로드 속도 개선
            />
          </Avatar>
        </IconButton>
      </Tooltip>

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
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
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
        {/* Filtered Menu */}
        {filteredMenus.map((menu) => {
          const IconComponent = iconMap[menu.url] || Avatar;
          const isAvatar = IconComponent === Avatar;
          return (
            <div key={menu.url}>
              {menu.hasDivider && <Divider />}
              <MenuItem onClick={() => handleMenuClick(menu.url)}>
                {isAvatar ? (
                  <Avatar />
                ) : (
                  <ListItemIcon>
                    <IconComponent />
                  </ListItemIcon>
                )}
                {menu.title}
              </MenuItem>
            </div>
          );
        })}
      </Menu>
    </Box>
  );
}

/*
--> anchorEl은 어떤 목적을 달성하기 위한 건가?

anchorEl의 목적: Menu 컴포넌트가 화면에 표시될 때 **위치 기준점(anchor)**을 제공하는 거야. 네 코드에서는 아바타 아이콘(IconButton)을 클릭하면 그 위치에 메뉴가 뜨도록 설정돼 있어. 즉, avataHandleClick에서 setAnchorEl(event.currentTarget)을 호출해서 클릭된 아바타 요소를 기준으로 메뉴가 열리게 되는 거지.

--> backup menu
        {menus.map((menu) => {
          const IconComponent = iconMap[menu.url] || Avatar; // 기본값으로 Avatar
          const isAvatar = IconComponent === Avatar;
          return (
            <div key={menu.url}>
              {menu.hasDivider && <Divider />}
              <MenuItem
                data-tag={menu.url}
                onClick={handleClick}>
                {isAvatar ? (
                  <Avatar />
                ) : (
                  <ListItemIcon>
                    <IconComponent />
                  </ListItemIcon>
                )}
                {menu.title}
              </MenuItem>
            </div>
          );
        })}


*/
