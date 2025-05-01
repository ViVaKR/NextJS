// src/menus/AccountMenu.tsx
"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { getMembershipItems } from "@/data/menu-items";
import { useProfile } from "@/app/(root)/membership/profile/Profile";
import { useSession } from "next-auth/react";
import LensBlurOutlinedIcon from '@mui/icons-material/LensBlurOutlined';
import { Badge, styled } from "@mui/material";

// 기본 이미지 경로 상수화
const DEFAULT_AVATAR_LOGIN = '/images/login.svg';
const DEFAULT_AVATAR_NO_IMAGE = '/images/no-avata.svg';

export default function AccountMenu() {

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const { user, isLoading: profileLoading, error: profileError } = useProfile();

  const { data: session, status } = useSession();

  // --- 아바타 URL 계산 로직 개선 (useMemo 사용) ---
  const avatarUrl = useMemo(() => {
    // 참고: 만약 next-auth session의 아바타를 profile보다 우선하고 싶다면,
    // 이 useMemo 로직 상단에 session 상태를 먼저 확인하는 코드를 추가하면 됨.
    // 예:
    if (status === 'authenticated' && session?.user?.avata) {
      return session.user.avata; // session 아바타가 최종 URL이라고 가정
    }
    // // 이후 useProfile 로직 진행...

    // 1. 프로필 로딩 중이거나 에러 발생 시 (아직 상태 모름) -> 기본 로그인 아이콘
    // 또는 명시적으로 로딩 아바타를 보여줘도 됨
    if (profileLoading || profileError) {
      // 로딩 중임을 시각적으로 표시하고 싶다면 다른 아이콘이나 스켈레톤 사용 가능
      return DEFAULT_AVATAR_LOGIN; // 혹은 로딩 표시용 아바타
    }

    // 2. 로그인하지 않은 상태 (user 객체가 없음) -> 기본 로그인 아이콘
    if (!user) {
      return DEFAULT_AVATAR_LOGIN;
    }

    // 3. 로그인 상태 - 아바타 정보 확인 (user.avata 우선)
    const trimmedAvatar = user.avata?.trim(); // Optional chaining + trim

    if (trimmedAvatar) {
      // 사용자 정의 아바타가 있으면 URL 생성
      // baseUrl 이나 user.id가 없는 경우 대비 (이론상 없어야 함)
      if (baseUrl && user.id) {
        return `${baseUrl}/images/${user.id}_${trimmedAvatar.toLowerCase()}`;
      } else {
        console.warn("Avatar URL construction failed: baseUrl or user.id missing.");
        return DEFAULT_AVATAR_NO_IMAGE; // 생성 실패 시 기본 아바타
      }
    } else {
      // 로그인했지만 등록된 아바타가 없음 -> '아바타 없음' 아이콘
      return DEFAULT_AVATAR_NO_IMAGE;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profileLoading, profileError, baseUrl]); // 의존성 배열 명시
  /*
    const getAvataUrl = () => {
      if (session && status === 'authenticated') {
        return session.user.avata;
      }
      if (user == null) {
        return '/images/login.svg';
      }
      if (user.avata.trim() == '') {
        return '/images/no-avata.svg';
      }
      return `${baseUrl}/images/${user?.id}_${user?.avata.toLowerCase()}`;
    };
   */
  const getFullName = () => user?.fullName || "";
  const getRoles = () => user?.roles?.join(", ") || "";
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
  /*
    const filteredMenus = getMembershipItems().filter((menu) => {
      const isAuthenticated = !!user;
      const userRoles = user?.roles || [];
      if (session && !menu.sessionMenu) return false;

      if (menu.requiresAuth && !isAuthenticated) return false;
      if (menu.hideWhenAuth && isAuthenticated) return false;
      const emailConfirm = user?.emailConfirmed;
      if ((menu.id === 9 || menu.id === 10) && emailConfirm) return false;
      if (menu.requiredRoles && !menu.requiredRoles.some((role) => userRoles.includes(role)))
        return false;
      return true;
    });
   */

  // --- 메뉴 필터링 로직 (큰 변경 없음, session 관련 로직 확인 필요) ---
  const filteredMenus = useMemo(() => { // 필터링도 useMemo 적용 가능
    return getMembershipItems().filter((menu) => {
      // user 상태를 기준으로 인증 여부 판단
      const isAuthenticated = !!user;
      const userRoles = user?.roles || [];

      // session 메뉴 관련 로직은 의도 확인 필요:
      // session 이 있을 때 session 메뉴만 보여주려는 의도? 아니면 반대?
      // 현재: session 있으면 non-session 메뉴 숨김 -> 로그아웃 등만 보임
      // 만약 '로그인 상태'(user 존재)일 때 session 메뉴(로그아웃)를 보여줘야 한다면:
      // if (isAuthenticated && menu.sessionMenu) return true; // 로그아웃 메뉴
      // if (!isAuthenticated && !menu.sessionMenu && menu.hideWhenAuth) return true; // 로그인/가입 메뉴
      // --> 이 부분은 현재 로직이 의도된 것인지 확인 필요! 아래는 원본 유지
      if (session && !menu.sessionMenu) return false;


      if (menu.requiresAuth && !isAuthenticated) return false;
      if (menu.hideWhenAuth && isAuthenticated) return false;
      const emailConfirm = user?.emailConfirmed;
      // emailConfirm 관련 메뉴 ID(9, 10)는 menu-items.ts 에 없어서 일단 유지
      if ((menu.id === 9 || menu.id === 10) && emailConfirm) return false;
      if (menu.requiredRoles && !menu.requiredRoles.some((role) => userRoles.includes(role)))
        return false;
      return true;
    });
  }, [user, session]); // user, session 상태 변경 시 메뉴 재필터링

  if (profileError) {
    console.error("Profile loading error:", profileError);
    return null;
  }


  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#FF00FF',
      color: '#FF00FF',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));

  return (
    <Box sx={{ display: "flex", alignItems: "center", marginRight: "0.5em" }}>
      <Box className="flex gap-2 items-center justify-center text-nowrap">

        <IconButton
          onClick={avataHandleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          disabled={profileLoading}>

          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            // 로딩 중이 아닐 때만 뱃지 보임
            invisible={profileLoading || !user}
            variant="dot">
            <Avatar
              sx={{
                width: 40, height: 40,
                '&:hover': {
                  bgcolor: '#00ffff', // 호버 시 배경색
                },
              }}
              alt={user?.fullName || "User"} // 로딩 중 alt 텍스트
              src={avatarUrl}>
            </Avatar>
          </StyledBadge>
        </IconButton>

        <div className="flex flex-col gap-1 text-xs justify-center max-md:hidden">
          <span>{getFullName()}</span>
          <span>{getRoles()}</span>
        </div>

      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {filteredMenus.map((menu, idx) => (
          <div key={idx}>
            {menu.hasDivider && <Divider />}
            <MenuItem onClick={() => handleMenuClick(menu.url)} className="gap-2">
              <LensBlurOutlinedIcon />
              {menu.title}
            </MenuItem>
          </div>
        ))}
      </Menu>
    </Box>
  );
}
