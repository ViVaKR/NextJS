import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React, { useState } from 'react';

export default function VivSelect() {
  const [age, setAge] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };
  return (
    <>
      <FormControl
        sx={{
          m: 1,
          minWidth: 120,
        }}
        size="small">
        <InputLabel id="viv-label">Age</InputLabel>
        <Select
          id='select-demo'
          name='select-demo'
          labelId="viv-label"
          label="Age"
          value={age}
          onChange={handleChange}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
        </Select>
        <FormHelperText>Required</FormHelperText>
      </FormControl>
    </>
  );
}
