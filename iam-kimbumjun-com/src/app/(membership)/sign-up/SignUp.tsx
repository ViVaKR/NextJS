'use client';
import VivTitle from '@/components/VivTitle';
import styles from './SignUp.module.css';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
type SignUpFormData = {
  email: string;
  fullName: string;
  password: string;
  passwordConfirm: string;
};
export default function SignUpPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      passwordConfirm: '',
    },
  });

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

  const onSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const signUpData = {
      email: data.email,
      fullName: data.fullName,
      password: data.password,
      roles: ['User'],
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/account/signup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signUpData),
        }
      );

      const result = await response.json();
      if (result.isSuccess) {
        router.push('/membership/sign-in');
      } else {
        alert(result.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('SignUp failed:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div
      className={`${styles.container}
                    bg-transparent
                    flex flex-col
                    items-center
                    py-24
                    justify-baseline
                    w-full`}>
      <VivTitle
        title="회원가입"
        fontColor="text-lime-400"
      />
      {/* 폼 시작 */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="xl:w-1/2
                2xl:w-1/3
                lg:w-3/5
                md:2/3
                shadow-2xl
                border-lime-400
                border-1
                rounded-3xl
                mx-8
                max-w-sm:w-full
                max-w-sm:mx-2
                max-w-xs:mx-1
                bg-transparent
                py-5
                px-10">
        {/* 아이디 */}
        <FormControl
          sx={{ m: 1, width: '100%' }}
          variant="filled">
          <InputLabel
            className="!text-white"
            htmlFor="email">
            아이디 / 이메일
          </InputLabel>
          {/* <FilledInput
            name="email"
            className="!text-lime-400"
          /> */}
          <Controller
            name="email"
            control={control}
            rules={{ required: '이메일을 입력해주세요.' }}
            render={({ field }) => (
              <FilledInput
                {...field}
                id="email"
                className="!text-lime-400"
                aria-describedby="email-helper-text"
              />
            )}
          />
          <FormHelperText id="email-helper-text">
            {errors.email?.message}
          </FormHelperText>
        </FormControl>

        {/* 이름 또는 필명 */}
        <FormControl
          sx={{ m: 1, width: '100%' }}
          variant="filled">
          <InputLabel
            className="!text-white"
            htmlFor="name">
            필명
          </InputLabel>
          <FilledInput
            id="name"
            name="name"
            className="!text-lime-400"
            // endAdornment={
            //   <InputAdornment position="end">{/* kg */}</InputAdornment>
            // }
            aria-describedby="filled-weight-helper-text"
            inputProps={{
              'aria-label': 'weight',
            }}
          />
          <FormHelperText id="filled-weight-helper-text">
            {/* 오류처리 */}
          </FormHelperText>
        </FormControl>

        {/* 비밀번호 */}
        <FormControl
          sx={{ m: 1 }}
          fullWidth
          variant="filled">
          <InputLabel
            className="!text-white"
            htmlFor="filled-adornment-password">
            비밀번호
          </InputLabel>
          <FilledInput
            id="password"
            name="password"
            className="!text-lime-400"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  className="!text-lime-400"
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText id="filled-weight-helper-text">
            {/* 오류처리 */}
          </FormHelperText>
        </FormControl>

        {/* 비밀번호 확인 */}
        <FormControl
          sx={{ m: 1 }}
          fullWidth
          variant="filled">
          <InputLabel
            htmlFor="filled-adornment-password"
            className="!text-white">
            비밀번호 확인
          </InputLabel>
          <FilledInput
            id="password-confirm"
            name="password-confirm"
            className="!text-lime-400"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  className="!text-lime-400"
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        {/* 버튼그룹 */}
        <div className="flex justify-evenly mt-6">
          {/* 1 */}
          <Button
            type="button"
            variant="outlined"
            color="primary"
            className="!text-lime-300 !font-bold hover:!bg-sky-500 hover:!text-white">
            취소
          </Button>
          {/* 2 */}
          <Button
            type="button"
            variant="outlined"
            color="primary"
            className="!text-lime-300 !font-bold hover:!bg-sky-500 hover:!text-white">
            이미회원이신가요? 로그인
          </Button>
          {/* 3 */}
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            className="!text-lime-300 !font-bold hover:!bg-sky-500 hover:!text-white">
            회원가입
          </Button>
        </div>
        {/* 링크 */}
      </form>
    </div>
  );
}
