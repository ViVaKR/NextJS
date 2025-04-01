// src/menus/AccountMenu.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
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

export default function AccountMenu() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const { user, isLoading: profileLoading, error: profileError } = useProfile();
  const { data: session, status } = useSession();

  const getAvataUrl = () => {
    if (user == null || user.avata == null) return null;
    if (session && status === 'authenticated') {
      return session.user.avata;
    }
    return `${baseUrl}/images/${user?.id}_${user.avata.toLowerCase()}`;
  };

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

  const filteredMenus = getMembershipItems().filter((menu) => {
    const isAuthenticated = !!user;
    const userRoles = user?.roles || [];
    if (session && !menu.sessionMenu) return false;
    if (menu.requiresAuth && !isAuthenticated) return false;
    if (menu.hideWhenAuth && isAuthenticated) return false;


    if (menu.requiredRoles && !menu.requiredRoles.some((role) => userRoles.includes(role))) {
      return false;
    }

    return true;
  });

  if (profileError) return null;

  return (
    <Box sx={{ display: "flex", alignItems: "center", marginRight: "0.5em" }}>
      <Box className="flex gap-2 text-nowrap">
        <IconButton
          onClick={avataHandleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          disabled={profileLoading}
        >
          <Avatar
            sx={{ width: 40, height: 40 }}
            alt={user?.avata}
            src={getAvataUrl() ?? '/images/login-icon.png'}>
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
              <span className="material-symbols-outlined">{menu.icon}</span>
              {menu.title}
            </MenuItem>
          </div>
        ))}
      </Menu>
    </Box>
  );
}
