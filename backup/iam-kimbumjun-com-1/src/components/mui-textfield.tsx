'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { inputBaseClasses } from '@mui/material/InputBase';

function RedBar() {
  return (
    <Box
      sx={(theme) => ({
        height: 20,
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        ...theme.applyStyles('dark', {
          backgroundColor: 'rgb(255 132 132 / 25%)',
        }),
      })}
    />
  );
}

export default function InputWithIcon() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [name, setName] = React.useState('Kim Bum Jun');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        '& > :not(style)': { m: 1 },
        display: 'flex',
        flexDirection: 'column',
      }}>
      <p>{name}</p>
      <RedBar />
      <FormControl
        variant="standard"
        fullWidth
        sx={{ m: 2, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            id="input-with-sx"
            fullWidth
            label="Name"
            color="success"
            value={name}
            sx={{ mr: 2 }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
            }}
            variant="standard"
          />
        </Box>
      </FormControl>
      <RedBar />
      {/* Password */}
      <FormControl
        sx={{ m: 1, width: '100%' }}
        variant="standard">
        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
        <Input
          id="standard-adornment-password"
          type={showPassword ? 'text' : 'password'}
          sx={{ mr: 2 }}
          color="warning"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? 'hide the password' : 'display the password'
                }
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <RedBar />
      <FormControl>
        <TextField
          id="standard-suffix-shrink"
          label="Email"
          variant="standard"
          helperText="Enter Email"
          slotProps={{
            htmlInput: {
              sx: { textAlign: 'right' },
            },
            input: {
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{
                    alignSelf: 'flex-end',
                    margin: 0,
                    marginBottom: '5px',
                    opacity: 0,
                    pointerEvents: 'none',
                    [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: {
                      opacity: 1,
                    },
                  }}>
                  @gmail.com
                </InputAdornment>
              ),
            },
          }}
        />
      </FormControl>
      <RedBar />
    </Box>
  );
}
