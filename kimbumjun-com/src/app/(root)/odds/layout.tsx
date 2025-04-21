// src/app/demos/layout.tsx
'use client';
import { Button, Box, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion'; // Framer Motion 추가
import { usePathname } from 'next/navigation';
import VivDrawer from '@/components/VivDrawer';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleShowMenu = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <VivDrawer
        open={open}
        setOpen={setOpen}
      />
      <Box
        component="div"
        sx={{ flexGrow: 1 }}>
        <div className="text-xs">
          <Tooltip
            title="메뉴보기"
            arrow
            placement="auto">
            <Button
              onClick={handleShowMenu}
              sx={{
                backgroundColor: 'transparent',
                width: '100%',
              }}>
              <WidgetsOutlinedIcon
                color="primary"
                fontSize="small"
              />
            </Button>
          </Tooltip>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}>
            {children}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default Layout;
