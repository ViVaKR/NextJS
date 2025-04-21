'use client';
import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { IMenu } from '@/interfaces/i-menu';
import { usePathname, useRouter } from 'next/navigation';
import { Divider } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import LensBlurOutlinedIcon from '@mui/icons-material/LensBlurOutlined';
import { Opacity } from '@mui/icons-material';

export default function VivListMenu({
  items,
  text,
  className,
}: {
  items: IMenu[];
  text?: string;
  className?: string;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const router = useRouter(); // --> 페이지 이동을 위한 useRouter
  const pathname = usePathname(); // 현재 경로 가져오기
  const open = Boolean(anchorEl);

  // 현재 경로와 비교해서 활성 상태 확인
  const isActive = items.some((item) => {
    const matches = item.url === pathname;
    return matches;
  });

  // 활성 상태에 따른 클래스
  const baseClasses = isActive ? 'text-pink-400' : 'text-amber-50';
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    e: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    const item = items[index]; // --> 클릭된 메뉴 항목
    if (item.disabled) return;
    setSelectedIndex(index);
    setAnchorEl(null); // --> 메뉴 닫기
    router.push(item.url);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex justify-center">
      <List
        component="nav"
        className={`${baseClasses} ${className}`} // 활성상태 클래스 적용
        sx={{ bgcolor: 'transparent' }}>
        <ListItemButton
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}>
          {text && (
            <MenuOutlinedIcon sx={{ mr: 1 }} />
          )}
          {text || <MenuOutlinedIcon />}
        </ListItemButton>
      </List>
      {/* 서브 항목 */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
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
                right: 90,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
      >
        {items.map((item, index) => (
          <div key={item.id}>
            {item.hasDivider && <Divider />}
            <MenuItem
              selected={index === selectedIndex}
              onClick={(event) => handleMenuItemClick(event, index)}
              disabled={item.disabled}
              sx={item.disabled ? { Opacity: 0.5 } : {}} //  비활성 스타일
            >
              <LensBlurOutlinedIcon sx={{ mr: 1 }} />
              {`${item.title}`}
            </MenuItem>
          </div>
        ))}
      </Menu>
    </div>
  );
}
