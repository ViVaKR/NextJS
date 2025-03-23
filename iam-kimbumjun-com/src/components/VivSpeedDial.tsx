'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

function helloWorld() {
  alert('Fine');
}
const actions = [
  {
    icon: <FileCopyIcon />,
    name: 'Copy',
    onClick: () => {
      alert('file');
      helloWorld();
    },
  },
  {
    icon: <SaveIcon />,
    name: 'Save',
    onClick: () => {
      alert('save');
    },
  },
  {
    icon: <PrintIcon />,
    name: 'Print',
    onClick: () => {
      alert('print');
    },
  },
  {
    icon: <ShareIcon />,
    name: 'Share',
    onClick: () => {
      alert('share');
    },
  },
];

export default function ControlledOpenSpeedDial() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        height: 320,
        backgroundColor: 'yellow',
        borderRadius: '2em',
        border: 'solid 5px skyblue',
        transform: 'translateZ(0px)',
        flexGrow: 1,
      }}>
      <SpeedDial
        ariaLabel="SpeedDial controlled open example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}>
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            onClick={action.onClick}
            // onClick={handleClose}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
