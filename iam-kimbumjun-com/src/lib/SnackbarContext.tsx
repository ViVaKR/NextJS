// src/lib/SnackbarContext.tsx
'use client';
import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import { createContext, useContext, useState, useCallback } from 'react';
import { duration } from '@mui/material';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'right' | 'center';
  duration: number; // 자동 닫힘 시간
}

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    severity?: AlertColor,
    vertical?: 'top' | 'bottom',
    horizontal?: 'left' | 'right' | 'center',
    duration?: number // 시간옵션
  ) => void;
}

const SnackbarContext = React.createContext<SnackbarContextType | undefined>(
  undefined
);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info',
    vertical: 'bottom', // 기본값
    horizontal: 'center', // 기본값
    duration: 6000, // 기본값 : 6초
  });

  const showSnackbar = useCallback(
    (
      message: string,
      severity: AlertColor = 'info',
      vertical: 'top' | 'bottom' = 'bottom',
      horizontal: 'left' | 'right' | 'center' = 'center',
      duration: number = 6_000 // 기본값 6_000ms 호출시에 변경 가능
    ) => {
      setSnackbar({
        open: true,
        message,
        severity,
        vertical,
        horizontal,
        duration,
      });
    },
    []
  ); // 빈 배열로 메모이제이션

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.duration}
        anchorOrigin={{
          vertical: snackbar.vertical,
          horizontal: snackbar.horizontal,
        }} // 위치 지정
        onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error('useSnackbar must be used within SnackbarProvider');
  return context;
}
