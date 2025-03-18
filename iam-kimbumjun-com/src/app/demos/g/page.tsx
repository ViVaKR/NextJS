import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import FolderIcon from '@mui/icons-material/Folder';
import PageviewIcon from '@mui/icons-material/Pageview';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { green, pink } from '@mui/material/colors';
import { AvatarGroup } from '@mui/material';
export default function SizeAvatars() {
  const img = '/images/avata-1024.png';
  return (
    <Stack
      direction="row"
      margin={`4em`}
      spacing={2}>
      <Avatar
        alt="Remy Sharp"
        src={img}
        sx={{ width: 24, height: 24 }}
      />
      <Avatar
        alt="Remy Sharp"
        src={img}
      />
      <Avatar
        alt="Remy Sharp"
        src={img}
        sx={{ width: 56, height: 56 }}
      />
      <AvatarGroup max={4}>
        <Avatar
          alt="Remy Sharp"
          src={img}
        />
        <Avatar
          alt="Travis Howard"
          src={img}
        />
        <Avatar
          alt="Cindy Baker"
          src={img}
        />
        <Avatar
          alt="Agnes Walker"
          src={img}
        />
        <Avatar
          alt="Trevor Henderson"
          src={img}
        />
        <Avatar>
          <FolderIcon />
        </Avatar>
        <Avatar sx={{ bgcolor: pink[500] }}>
          <PageviewIcon />
        </Avatar>
        <Avatar sx={{ bgcolor: green[500] }}>
          <AssignmentIcon />
        </Avatar>
      </AvatarGroup>
    </Stack>
  );
}
