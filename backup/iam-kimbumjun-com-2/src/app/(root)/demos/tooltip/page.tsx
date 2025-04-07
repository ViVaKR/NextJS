'use client'

import * as React from 'react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { Box, Zoom } from '@mui/material';
import Grid from '@mui/material/Grid'

import { createTheme, styled } from '@mui/material/styles'


const VivDiv = styled('div')({
  color: 'darkslategray',
  backgroundColor: 'skyblue',
  padding: 8,
  borderRadius: 4,
});


export default function ArrowTooltips() {

  React.useEffect(() => {
    console.log('in useEffect');
  })


  return (

    <Grid>
      <Box
        sx={{
          display: 'flex',
          margin: '1em'
        }}
      >
        <VivDiv>Styled div</VivDiv>

        <Tooltip
          title="Add"
          slots={{
            transition: Zoom
          }}
          placement='bottom'
          arrow>
          <Button>Arrow</Button>
        </Tooltip>

        <Tooltip
          title="Follow Cursor"
          followCursor
        >
          <Button>Follow Cursor</Button>
        </Tooltip>

        <Tooltip
          title="Follow Cursor"
          followCursor
          enterDelay={500}
          leaveDelay={200}
        >
          <Button>Delay Tooltips</Button>
        </Tooltip>
      </Box>
    </Grid>
  );
}
