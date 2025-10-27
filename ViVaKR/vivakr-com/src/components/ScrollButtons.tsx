// src/components/ScrollButtons.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Fab, Stack, Tooltip } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled, keyframes } from '@mui/system';

// 애니메이션 정의
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedBox = styled(Box)`
  animation: ${fadeIn} 0.3s ease-in-out;
`;

interface ScrollButtonsProps {
    scrollableRef: React.RefObject<HTMLElement | null>;
}

export default function ScrollButtons({ scrollableRef }: ScrollButtonsProps) {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = useCallback(() => {
        const element = scrollableRef.current;
        if (element) {
            setIsVisible(element.scrollTop > 300);
        }
    }, [scrollableRef]);

    const scrollToTop = () => {
        scrollableRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const scrollToBottom = () => {
        const element = scrollableRef.current;
        if (element) {
            element.scrollTo({
                top: element.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        const element = scrollableRef.current;
        if (element) {
            element.addEventListener('scroll', toggleVisibility);
            toggleVisibility(); // 초기 상태 체크
            return () => {
                element.removeEventListener('scroll', toggleVisibility);
            };
        }
    }, [scrollableRef, toggleVisibility]);

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 1000,
            }}
        >
            {isVisible && (
                <AnimatedBox>
                    <Stack direction="column" spacing={1.5}>
                        <Tooltip title="맨 위로" placement="left">
                            <Fab
                                color="primary"
                                size="small"
                                aria-label="scroll to top"
                                onClick={scrollToTop}
                                sx={{ '&:hover': { bgcolor: 'primary.dark' } }}
                            >
                                <KeyboardArrowUpIcon />
                            </Fab>
                        </Tooltip>
                        <Tooltip title="맨 아래로" placement="left">
                            <Fab
                                color="secondary"
                                size="small"
                                aria-label="scroll to bottom"
                                onClick={scrollToBottom}
                                sx={{ '&:hover': { bgcolor: 'secondary.dark' } }}
                            >
                                <KeyboardArrowDownIcon />
                            </Fab>
                        </Tooltip>
                    </Stack>
                </AnimatedBox>
            )}
        </Box>
    );
}
