'use client';
import VivTitle from '@/components/VivTitle';
import { Fragment, useState } from 'react';
import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  Divider,
  Grid,
  Pagination,
  Paper,
  Stack,
  styled,
  TablePagination,
  ThemeProvider,
} from '@mui/material';

import VivSpeedDial from '@/components/VivSpeedDial';
import VivSelect from '@/components/VivSelect';
import VivVertMenu from '@/components/VivVertMenu';

const VivBar = styled(Paper)(({ theme }) => ({
  backgroundColor: '#ff00ff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
}));

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));

const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });

export default function BoxPage() {
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Fragment>
      <CssBaseline />
      <Container maxWidth={false}>
        <VivTitle title="Box" />
        <VivVertMenu />
        <VivSelect />
        <Stack
          spacing={2}
          mb={4}>
          <Pagination
            count={10}
            color="secondary"
          />
          <VivSpeedDial />

          <Pagination
            count={10}
            variant="outlined"
            color="primary"
          />

          <Pagination
            count={10}
            variant="outlined"
            color="secondary"
            shape="rounded"
            showFirstButton
            showLastButton
          />

          <TablePagination
            component="div"
            count={100}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Stack>

        {/*  */}
        <Box sx={{ flexGrow: 1, background: 'yellow' }}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim id
            fugit facilis unde quisquam quas animi expedita aliquid? Ducimus
            repellat facilis exercitationem nisi, corrupti perspiciatis tempora
            a distinctio fugiat ratione.
          </p>
        </Box>
        {/*  */}

        <Grid
          container
          spacing={2}
          columns={16}>
          <Grid size={6}>
            <Item>size=6</Item>
          </Grid>
          <Grid size={10}>
            <Item>size=10</Item>
          </Grid>
        </Grid>
        <Grid
          container
          my={2}
          // sx={{
          //   justifyContent: 'center',
          //   alignItems: 'baseline',
          // }}
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}>
          {Array.from(Array(12)).map((_, index) => (
            <Grid
              key={index}
              size={{ xs: 2, sm: 4, md: 3 }}>
              <Item>{index + 1}</Item>
            </Grid>
          ))}
        </Grid>

        {/*  */}
        <Grid
          container
          spacing={2}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.default',
              display: 'grid',
              gridTemplateColumns: { md: '1fr 1fr' },
              gap: 2,
            }}>
            {[0, 1, 2, 3, 4, 6, 8, 12, 16, 24].map((elevation) => (
              <Item
                key={elevation}
                elevation={elevation}>
                {`elevation=${elevation}`}
              </Item>
            ))}
          </Box>
        </Grid>

        {/* Stack */}

        <Stack
          spacing={2}
          divider={
            <Divider
              orientation="vertical"
              flexItem
            />
          }
          direction="row">
          <VivBar>item 1</VivBar>
          <VivBar>item 2</VivBar>
          <VivBar>item 3</VivBar>
        </Stack>

        <Box sx={{ bgcolor: '#cfe8fc', height: '50vh', mb: 4 }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, nemo.
          Consectetur, maxime. Laudantium natus labore necessitatibus ea sit
          nam, quisquam nesciunt debitis corrupti vero quae quos enim cumque!
          Vitae, modi.
        </Box>
        <Box
          component="section"
          sx={{ p: 2, border: '1px dashed grey' }}>
          This Box renders as an HTML Section element.
        </Box>

        <ThemeProvider
          theme={{
            palette: {
              primary: {
                main: '#007FFF',
                dark: '#0066CC',
              },
            },
          }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              mt: 2,
              ml: 2,
              borderRadius: 1,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'prmary.dark',
              },
            }}
          />
        </ThemeProvider>
      </Container>
    </Fragment>
  );
}
