'use client';
import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { IMenu } from '@/interfaces/i-menu';
import { usePathname, useRouter } from 'next/navigation';
import { Divider } from '@mui/material';

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
            <span className="material-symbols-outlined mr-2">stacks</span>
          )}
          {text || <span className="material-symbols-outlined">menu</span>}
        </ListItemButton>
      </List>
      {/* 서브 항목 */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}>
        {items.map((item, index) => (
          <div key={item.id}>
            {item.hasDivider && <Divider />}
            <MenuItem
              selected={index === selectedIndex}
              onClick={(event) => handleMenuItemClick(event, index)}>
              <span className="material-symbols-outlined mr-4">
                {item.icon}
              </span>
              {`${item.title}`}
            </MenuItem>
          </div>
        ))}
      </Menu>
    </div>
  );
}
