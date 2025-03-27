'use client';
import * as React from 'react';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Fab,
  FormGroup,
  InputLabel,
  MenuItem,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
//-->
function MyFormHelperText() {
  const { focused } = useFormControl() || {};

  const helperText = React.useMemo(() => {
    if (focused) {
      return 'This field is being focused';
    }

    return 'Helper text';
  }, [focused]);

  return <FormHelperText>{helperText}</FormHelperText>;
}
const buttons = [
  <Button key="one">One</Button>,
  <Button key="two">Two</Button>,
  <Button key="three">Three</Button>,
];

export default function UseFormControl() {
  const [value, setValue] = React.useState('female');
  const [age, setAge] = React.useState('');
  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: true,
  });

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  return (
    <Stack
      sx={{ width: '95%' }}
      m={2}
      spacing={2}>
      {/* switch */}
      <p className="text-slate-700">[ {state.antoine} ]</p>
      <FormControl
        component="fieldset"
        variant="standard">
        <FormLabel component="legend">Assign responsibility</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={state.gilad}
                onChange={handleSwitchChange}
                name="gilad"
              />
            }
            label="Gilad Gray"
          />
          <FormControlLabel
            control={
              <Switch
                checked={state.jason}
                onChange={handleSwitchChange}
                name="jason"
              />
            }
            label="Jason Killian"
          />
          <FormControlLabel
            control={
              <Switch
                checked={state.antoine}
                onChange={handleSwitchChange}
                name="antoine"
              />
            }
            label="Antoine Llorca"
          />
        </FormGroup>
        <FormHelperText>Be careful</FormHelperText>
      </FormControl>
      {/*  */}
      <p className="p-2 text-center">{age}</p>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleSelectChange}>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      {/* Radio  */}
      <div className="w-full p-2 bg-slate-300 rounded-2xl text-center text-red-500 text-xl">
        {value}
      </div>
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChange}>
          <FormControlLabel
            value="female"
            control={<Radio />}
            label="Female"
          />
          <FormControlLabel
            value="male"
            control={<Radio />}
            label="Male"
          />
        </RadioGroup>
      </FormControl>
      {/* fab 2 */}
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab
          color="primary"
          aria-label="add">
          <AddIcon />
        </Fab>
        <Fab
          color="secondary"
          aria-label="edit">
          <EditIcon />
        </Fab>
        <Fab variant="extended">
          <NavigationIcon sx={{ mr: 1 }} />
          Navigate
        </Fab>
        <Fab
          disabled
          aria-label="like">
          <FavoriteIcon />
        </Fab>
      </Box>
      {/* fab 1 */}
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab
          size="small"
          color="secondary"
          aria-label="add">
          <AddIcon />
        </Fab>
        <Fab
          size="medium"
          color="secondary"
          aria-label="add">
          <AddIcon />
        </Fab>
        <Fab
          color="secondary"
          aria-label="add">
          <AddIcon />
        </Fab>
      </Box>
      {/* ButtonGroup */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& > *': {
            m: 2,
          },
        }}>
        <ButtonGroup
          size="small"
          orientation="vertical"
          aria-label="Small button group">
          {buttons}
        </ButtonGroup>
        <ButtonGroup
          color="secondary"
          aria-label="Medium-sized button group">
          {buttons}
        </ButtonGroup>
        <ButtonGroup
          size="large"
          aria-label="Large button group">
          {buttons}
        </ButtonGroup>
      </Box>
      <ButtonGroup
        variant="outlined"
        aria-label="Loading button group">
        <Button>Submit</Button>
        <Button>Fetch data</Button>
        <Button
          loading
          loadingPosition="start"
          startIcon={<SaveIcon />}>
          Save
        </Button>
      </ButtonGroup>
      <form
        noValidate
        autoComplete="off">
        <FormControl sx={{ width: '95%', margin: '1em' }}>
          <OutlinedInput placeholder="Please enter text" />
          <MyFormHelperText />
        </FormControl>
      </form>
      <Alert
        icon={<CheckIcon />}
        severity="warning"
        onClose={() => {}}>
        This Alert displays the default close icon.
      </Alert>
      <Alert
        variant="filled"
        severity="success"
        action={
          <Button
            size="small"
            color="inherit">
            UNDO
          </Button>
        }>
        This is a filled success Alert.
      </Alert>
      <Alert
        variant="filled"
        severity="success">
        This is a filled success Alert.
      </Alert>
      <Alert
        variant="filled"
        severity="info">
        This is a filled info Alert.
      </Alert>
      <Alert
        variant="filled"
        severity="warning">
        This is a filled warning Alert.
      </Alert>
      <Alert
        variant="filled"
        severity="error">
        This is a filled error Alert.
      </Alert>
      <Alert
        variant="outlined"
        severity="success">
        This is an outlined success Alert.
      </Alert>
      <Alert
        variant="outlined"
        severity="info">
        This is an outlined info Alert.
      </Alert>
      <Alert
        variant="outlined"
        severity="warning">
        This is an outlined warning Alert.
      </Alert>
      <Alert
        variant="outlined"
        severity="error">
        This is an outlined error Alert.
      </Alert>
      <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        This is a success Alert with an encouraging title.
      </Alert>
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        This is an info Alert with an informative title.
      </Alert>
      <Alert severity="warning">
        <AlertTitle>Warning</AlertTitle>
        This is a warning Alert with a cautious title.
      </Alert>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        This is an error Alert with a scary title.
      </Alert>
    </Stack>
  );
}
/*
안녕하세요! 질문하신 MUI의 `sx` prop 안에 있는 `'& > *': { m: 1 }` 부분에 대해 설명드릴게요. 이건 CSS에서 사용하는 **SCSS/Sass 문법**과 MUI의 스타일링 시스템이 결합된 형태라서 처음 보면 조금 헷갈릴 수 있습니다. 하나씩 풀어서 설명드릴게요!

### 코드 분석
```javascript
'& > *': {
  m: 1,
}
```

#### 1. `'&'`란?
- `&`는 **현재 요소**(부모 요소)를 가리키는 SCSS의 **부모 선택자(parent selector)**입니다.
- 여기서는 `<Box>` 컴포넌트 자체를 의미한다고 볼 수 있어요. 즉, 이 `sx` 스타일이 적용된 `<Box>` 요소를 기준으로 스타일을 정의합니다.

#### 2. `>`란?
- `>`는 CSS에서 **직접 자식 선택자(child combinator)**를 의미합니다.
- 이 기호는 부모 요소 바로 아래에 있는 자식 요소만 선택한다는 뜻이에요. 더 깊은 손자 요소(grandchildren)는 포함되지 않습니다.

#### 3. `*`란?
- `*`는 CSS의 **와일드카드(wildcard)**로, **모든 요소**를 의미합니다.
- 즉, `<Box>` 바로 아래에 있는 모든 직접 자식 요소(태그 종류 상관없이)를 선택하겠다는 뜻이에요.

#### 4. `'& > *'` 전체 의미
- `'& > *'`를 합치면:
  **"`<Box>`의 모든 직접 자식 요소"**를 선택한다는 의미가 됩니다.
- 예를 들어, `<Box>` 안에 `<div>`, `<span>`, `<p>` 같은 요소들이 바로 아래에 있다면 이 스타일이 그 요소들에 적용됩니다.

#### 5. `{ m: 1 }`란?
- `m: 1`은 MUI의 **테마 기반 간격 시스템(theme spacing system)**을 사용하는 속성입니다.
- MUI에서 `m`은 `margin`(바깥 여백)을 뜻하고, `1`은 테마에 정의된 간격 단위의 1배를 의미해요.
- 기본적으로 MUI 테마에서 `spacing` 단위는 `8px`이므로, `m: 1`은 **모든 방향(상하좌우)에 8px의 여백**을 적용한다는 뜻입니다. (만약 테마가 커스터마이징되어 있다면 단위가 다를 수도 있어요.)

### 전체 의미
```javascript
'& > *': {
  m: 1,
}
```
→ **"`<Box>`의 모든 직접 자식 요소에 상하좌우 8px의 여백(margin)을 적용한다."**

### 예시로 이해하기
```jsx
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      m: 1,
    },
  }}
>
  <Button>버튼1</Button>
  <Button>버튼2</Button>
  <Typography>텍스트</Typography>
</Box>
```
- 여기서 `<Button>버튼1</Button>`, `<Button>버튼2</Button>`, `<Typography>텍스트</Typography>`는 `<Box>`의 **직접 자식**이에요.
- `'& > *': { m: 1 }` 덕분에 이 세 요소는 각각 상하좌우에 8px 여백이 생겨서 서로 간격이 띄워져 보이게 됩니다.

### 추가 팁
- 만약 `'& > *'` 대신 `'& *'`였다면, 직접 자식뿐 아니라 더 깊은 자손 요소까지 모두 선택되었을 거예요. `>`가 있어서 직접 자식만 타겟팅된다는 점이 중요합니다!
- `m: 1` 대신 `mt: 1` (margin-top), `mx: 2` (margin-left/right)처럼 특정 방향만 지정할 수도 있어요.

이해가 되셨나요? 더 궁금한 점 있으면 언제든 물어보세요! 😊

*/
