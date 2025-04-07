'use client';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from './Login.module.css';
import Link from 'next/link';
import {
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const auth = useAuth();
  const { login, loading } = auth;
  const router = useRouter();
  const searchParams = useSearchParams(); // 쿼리 파라미터 읽기

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

  if (loading) return <div>Loading...</div>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      // 쿼리 파라미터에서 redirect 값 가져오기, 없으면 기본 경로로
      // const redirectPath = searchParams.get('redirect') || '/';
      // router.push(redirectPath); // 로그인 후 직전 페이지로 이동
      window.history.back();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      alert('Login failed');
    }
    // if (success) {
    //   router.push('/');
    //   window.location.reload();
    // } else {
    //   alert('Login failed');
    // }
  };

  return (
    <div className={styles.signinForm}>
      <div className={styles.box}>
        <span className={styles.borderLine}></span>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4
          rounded-xl
          form p-4 border-4
          !bg-slate-200
          border-slate-600">
          <h1 className={styles.title}>Sign In</h1>
          <div className="w-full">
            <FormControl
              sx={{ width: '100%' }}
              variant="filled">
              <InputLabel htmlFor="filled-adornment-password">Email</InputLabel>
              <FilledInput
                id="filled-adornment-weight"
                onChange={(e) => setEmail(e.target.value)}
                // endAdornment={
                //   <InputAdornment position="end">kg</InputAdornment>
                // }
                aria-describedby="filled-weight-helper-text"
                // inputProps={{
                //   'aria-label': 'weight',
                // }}
              />
              {/* <FormHelperText id="filled-weight-helper-text">
                Weight
              </FormHelperText> */}
            </FormControl>
          </div>
          <div className="w-full">
            <FormControl
              sx={{ width: '100%' }}
              variant="filled">
              <InputLabel htmlFor="filled-adornment-password">
                Password
              </InputLabel>
              <FilledInput
                id="filled-adornment-password"
                // value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? 'hide the password'
                          : 'display the password'
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
          </div>

          <div className={styles.links}>
            <Link href="/membership/forget-password">Forget pasword</Link>
            <Link href="/membership/sign-up">Do not have an account</Link>
          </div>

          <div className="w-1/2 flex justify-center items-center">
            <button
              className={styles.btnSubmit}
              type="submit"
              value="Submit">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
