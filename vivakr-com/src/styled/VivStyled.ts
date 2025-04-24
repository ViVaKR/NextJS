import { Button, Paper, styled } from "@mui/material";

// styledComponents.js
export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#454545',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  '&:hover': { color: 'red' },
  cursor: 'pointer',
  color: theme.palette.text.secondary,
}));

export const StyledButton = styled(Button)`
    &:hover {
      color: red;
      background-color: skyblue;
    }
    cursor: pointer;
  `;


export const VivStyledButton = styled(Button)(({ theme }) => ({
  color: 'var(--color-slate-400)',
  '&:hover': {
    color: '#ff00ff',
    backgroundColor: 'skyblue', // 추가!
  },
  cursor: 'pointer',
}));
