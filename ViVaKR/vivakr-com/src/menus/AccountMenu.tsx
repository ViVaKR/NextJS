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

const DEFAULT_AVATAR_LOGIN = '/images/login.svg';
const DEFAULT_AVATAR_NO_IMAGE = '/images/no-avata.svg';

export default function AccountMenu() {

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const { user, isLoading: profileLoading, error: profileError } = useProfile();
  const { data: session, status } = useSession();

  const avatarUrl = useMemo(() => {
    if (status === 'authenticated' && session?.user?.avata) {
      return session.user.avata; // session 아바타가 최종 URL이라고 가정
    }
    if (profileLoading || profileError) {
      return DEFAULT_AVATAR_LOGIN; // 혹은 로딩 표시용 아바타
    }

    if (!user) {
      return DEFAULT_AVATAR_LOGIN;
    }

    const trimmedAvatar = user.avata?.trim(); // Optional chaining + trim

    if (trimmedAvatar) {
      if (baseUrl && user.id) {
        return `${baseUrl}/images/${user.id}_${trimmedAvatar.toLowerCase()}`;
      } else {
        console.warn("Avatar URL construction failed: baseUrl or user.id missing.");
        return DEFAULT_AVATAR_NO_IMAGE; // 생성 실패 시 기본 아바타
      }
    } else {
      return DEFAULT_AVATAR_NO_IMAGE;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profileLoading, profileError, baseUrl]);

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

  const filteredMenus = useMemo(() => {
    return getMembershipItems().filter((menu) => {
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
  }, [user, session]);

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
                  bgcolor: '#00ffff',
                },
              }}
              alt={user?.fullName || "User"}
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
