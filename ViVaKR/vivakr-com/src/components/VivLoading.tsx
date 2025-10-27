'use client';
import { Preview } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  CircularProgressProps,
  Typography,
} from '@mui/material';
import * as React from 'react';

interface LoadingProps {
  params: {
    choice?: number;
  };
}

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        size="10rem"
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Typography
          variant="caption"
          component="div"
          sx={{ color: 'text.secondary' }}>{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function VivLoading({ params }: LoadingProps) {
  const choice = params?.choice ?? 1;
  const [progress, setProgress] = React.useState(10);
  React.useEffect(() => {
    const duration = choice * 1_000; // choice 에 따라 속도 조절
    const interval = 100; // 100ms 마다 증가
    const steps = duration / interval; // 총 반복 횟수 (5_000 / 50 = 100 회 반복)
    const step = 100 / steps; // 100% 를 총 반복 횟수로 나눔 (100/ 100 = 1)

    let currentProgress = 10;

    const timer = setInterval(() => {
      currentProgress += step;

      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(currentProgress, 100);
      });
    }, interval);
    setProgress(20); // 언마운트 시에도 100%로 설정

    // cleanup 시 마지막 값 보장.
    return () => {
      // clearInterval(timer);
    };
  }, [choice]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
      <CircularProgressWithLabel value={progress} />
    </Box>
  );
}
