'use client';
import { useAuth } from '@/lib/AuthContext';
import { useEffect, useState } from 'react';
import styles from './Login.module.css';
import Link from 'next/link';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
} from '@mui/material';
import { useSnackbar } from '@/lib/SnackbarContext';
import { useRouter } from 'next/navigation';
import React from 'react';
import { userDetail } from '@/services/auth.service';
import { error } from 'console';
import { useForm } from 'react-hook-form';
import { ISignInRequest } from '@/interfaces/i-signin-request';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ISignInRequest>(
    {
      defaultValues: {
        email: '',
        password: '',

      }
    }
  )

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

  const { showSnackbar } = useSnackbar();

  if (loading) return <div>Loading...</div>;

  const showLoginSuccess = (message: string) => {
    showSnackbar(message + '님 환영합니다.', 'success', 'top', 'right', 3000); // 메시지와 erverity 설정
  };

  const showLoginFailed = () =>
    showSnackbar('로그인 실패하였습니다.', 'error', 'bottom', 'center', 3000);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      const fullName = userDetail()?.fullName ?? '-';
      setTimeout(() => {
        showLoginSuccess(fullName);
        router.push('/');
      }, 100);
    } else {
      showLoginFailed();
    }
  };

  return (
    <div className={styles.signinForm}>
      <div className={styles.box}>
        <span className={styles.borderLine}></span>

        <form
          onSubmit={onSubmit}
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
                aria-describedby="filled-weight-helper-text"
              />
            </FormControl>
          </div>
          {/* Password */}
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
