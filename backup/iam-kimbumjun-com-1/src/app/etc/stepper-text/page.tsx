import Title from '@/components/Title';
import VivVerticalStepper from '@/components/VivStep';
import { Box } from '@mui/material';
import React from 'react';
const Page = () => {
    return (
        <React.Fragment>
            <Title title="단계별 글" />
            <Box sx={{
                width: '100%',
                background: 'var(--color-slate-50)',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <VivVerticalStepper />
            </Box>
        </React.Fragment >
    );
}
export default Page;
