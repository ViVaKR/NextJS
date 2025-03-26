'use client'
import VivTitle from '@/components/VivTitle';
import { VivStyledButton } from '@/styled/VivStyled';
import { Box, Button, Divider, Paper, Stack, styled, Typography } from '@mui/material';
import { yellow } from '@mui/material/colors';
import Grid from '@mui/material/Grid2';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'var(--color-slate-400)',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    "&:hover": { color: 'red' },

    cursor: 'pointer',
    color: theme.palette.text.secondary
}));

const StyledButton = styled(Button)`
&:hover {
    color: red;
    background-color: skyblue;
}
`;

export default function MuiGrid2Page() {

    return (
        <Box className="relative flex flex-col p-4 gap-4 min-h-screen">

            <Stack>
                <VivTitle title='MUI Grid Demo' />
            </Stack>

            <Box sx={{ width: '80%' }}>
                <Stack
                    spacing={{ xs: 1, sm: 2 }}
                    direction={`row`}
                    useFlexGap
                    sx={{
                        flexWrap: 'wrap', direction: 'flex',

                        justifyContent: 'content', alignItems: 'center',
                        minWidth: 0, height: 200
                    }}
                >
                    <Typography overflow={`scroll`} noWrap>
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta ducimus consequatur iusto. Ipsam unde, sapiente veritatis corporis consectetur amet possimus consequuntur sit impedit modi a deserunt voluptate, ipsa magni. Nemo?
                    </Typography>
                </Stack>
            </Box>

            <Grid container spacing={2} minHeight={160}>
                <Grid size={4}>
                    <Stack
                        spacing={{ xs: 1, sm: 2, md: 3 }}
                        useFlexGap
                        direction={{ xs: 'column', sm: 'row' }}
                        sx={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', height: 100, bgcolor: 'lightblue' }}
                        divider={<Divider orientation='vertical' />}

                    >
                        <Paper>Row 1</Paper>
                        <Paper>Row 2</Paper>
                        <Paper>Long content</Paper>
                    </Stack>
                </Grid>
                <Grid size={8}>
                    <Paper sx={{
                        height: '100%',
                        textAlign: 'center',
                        alignContent: 'center',
                        boxSizing: 'border-box'
                    }}>
                        Hello World
                    </Paper>
                </Grid>

            </Grid>

            <Box sx={{
                flexGrow: 1,
                py: 0,
                bgcolor: 'var(--color-slate-200)'
            }}>

                <Grid container
                    minHeight={160}
                    spacing={0.2}
                    sx={{
                        '--Grid-borderWidth': '1px',
                        border: 'var(--Grid-borderWidth) solid',
                        borderColor: 'divider',
                        '& > div': {
                            borderColor: 'divider',
                            border: 'var(--Grid-borderWidth) solid'
                        }
                    }}>

                    {[...Array(6)].map((_, index) => (
                        <Grid key={index} minHeight={160} size={{
                            xs: 12, sm: 6, md: 4, lg: 3
                        }} />
                    ))}

                </Grid>

            </Box>
            {/*  */}
            <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} >
                <Grid size={12}>

                </Grid>
                <Grid size={8}>
                    <Item>size=8</Item>
                </Grid>
                <Grid size={4}>
                    <Item>size=4</Item>
                </Grid>
                <Grid size={4}>
                    <Item>size=8</Item>
                </Grid>
                <Grid size={8}>
                    {/* <StyledButton>Hello</StyledButton> */}

                    <VivStyledButton>My Button</VivStyledButton>

                </Grid>
                <Grid size={12}>
                    <StyledButton>Hello</StyledButton>

                    <Button>Button</Button>

                </Grid>

            </Grid>

            <Grid direction={`row`}
                sx={{
                    justifyContent: "center",
                    alignItems: "center"
                }}
                container spacing={{ xs: 2, sm: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}>

                {Array.from(Array(12)).map((_, index) => (
                    <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
                        <Item>{index + 1}</Item>
                    </Grid>
                ))}

            </Grid>

            <Grid container
                direction={`row`}
                spacing={3}
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: '10vh',
                    backgroundColor: '#ff00ff'
                }}>

                <Grid size="grow">
                    <Paper>Grow</Paper>
                </Grid>
                <Grid size={6}>
                    <Paper>
                        size=6
                    </Paper>
                </Grid>
                <Grid size="grow">
                    <Paper>
                        Grow
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid size="auto">
                    size=auto
                </Grid>
                <Grid size={6}>
                    <Paper>
                        size=6
                    </Paper>
                </Grid>
                <Grid size="grow">
                    <Paper>
                        size=grow
                    </Paper>
                </Grid>

            </Grid>


            {/*  */}
            <Grid container spacing={2}
                sx={{ padding: 4, display: 'flex', gap: 1, bgcolor: 'var(--color-slate-200)' }}
                minHeight={160}

                columns={16}>
                <Grid size={2} sx={{ bgcolor: 'var(--color-red-400)' }}>A</Grid>
                <Grid size={5} sx={{ bgcolor: 'var(--color-red-200)' }}>B</Grid>
                <Grid size={1}>C</Grid>
                <Grid size={4}>D</Grid>
                <Grid size={4}>E</Grid>
            </Grid>
        </Box >

    );
}
