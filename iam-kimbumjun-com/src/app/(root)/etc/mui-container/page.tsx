'use client'
import VivTitle from '@/components/VivTitle';
import { Container, CssBaseline } from '@mui/material';
export default function MuiContainerPage() {

    return (
        <>

            <Container maxWidth={false}
                disableGutters={true} // If true the left and right padding is removed
                sx={{
                    bgcolor: 'var(--color-slate-200)',
                    height: '100vh'
                }}>

                <VivTitle title='MuiContainerPage' />
                <div>Hello</div>

            </Container>
        </>
    );
}

/*
maxWidth : xs, sm, md, lg, xl, false, string

*/
