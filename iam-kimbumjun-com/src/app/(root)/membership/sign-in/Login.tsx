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
import { useForm } from 'react-hook-form';
import { ISignInRequest } from '@/interfaces/i-signin-request';
import { signIn } from "next-auth/react";
import Image from 'next/image'

export default function SignIn() {

  const router = useRouter();
  const { login, loading, user, updateUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInRequest>(
    {
      defaultValues: {
        email: '',
        password: '',
      }
    }
  )

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseEvents = (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault();

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

  if (loading) return <div>로딩 중...</div>;

  const showLoginSuccess = () => {
    showSnackbar('환영합니다.', 'success', 'bottom', 'right', 2000);
  };

  const showLoginFailed = () =>
    showSnackbar('로그인 실패하였습니다.', 'error', 'bottom', 'right', 3000);

  const onFormSubmit = async (data: ISignInRequest) => {

    try {
      const result = await login(data.email, data.password);
      if (result) {
        showLoginSuccess();
        router.push('/');
        // setTimeout(() => {
        // }, 100);
      } else {
        showLoginFailed();
      }
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  return (
    <div className={styles.signinForm}>
      <div className={styles.box}>
        <span className={styles.borderLine}></span>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
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
                {...control.register('email')}
                // onChange={(e) => setEmail(e.target.value)}
                aria-describedby="filled-weight-helper-text"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
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
                {...control.register('password')}
                // onChange={(e) => setPassword(e.target.value)}
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
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
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
          <span className='flex-1'></span>

          <div className='flex justify-center mb-4 text-xs items-center'>
            <button
              type="button"
              className="px-4
              py-2
              cursor-pointer
              hover:text-white
              hover:bg-red-400
              rounded-xl
              flex justify-center items-center
              gap-1
              text-slate-500
              font-bold"
              onClick={() => signIn("google", { callbackUrl: '/' })}>
              <Image
                width={15}
                height={15}
                src="/images/google-icon.svg"
                alt="Google" />Google

            </button>
            <button
              type="button"
              className="px-4
              py-2
              cursor-pointer
              hover:text-white
              hover:bg-red-400
              rounded-xl
              flex justify-center items-center
              gap-1
              text-slate-500
              font-bold"
              onClick={() => signIn("github", { callbackUrl: '/' })}>
              <Image
                width={15}
                height={15}
                src="/images/github-mark.svg"
                alt="GitHub" /> GitHub

            </button>
            <button
              type="button"
              className="px-4
              py-2
              cursor-pointer
              hover:text-white
              hover:bg-red-400
              rounded-xl
              flex justify-center items-center
              gap-1
              text-slate-500
              font-bold"
              onClick={() => signIn("facebook", { callbackUrl: '/' })}
            >
              <Image width={15} height={15} src="/images/facebook.svg" alt="Facebook Meta" />
              Facebook
            </button>


          </div>

          {/* Line 2 */}
          <div className='flex justify-center mb-4 text-xs items-center'>

            <button
              type="button"
              className="px-4
              py-2
              cursor-pointer
              hover:text-white
              hover:bg-red-400
              rounded-xl
              flex justify-center items-center
              gap-1
              text-slate-500
              font-bold"
              onClick={() => signIn("azure-ad", { callbackUrl: '/' })}>
              <Image
                width={15}
                height={15}
                src="/images/microsoft.svg"
                alt="GitHub" /> Microsoft

            </button>
            <button
              type="button"
              className="px-4
              py-2
              cursor-pointer
              hover:text-white
              hover:bg-red-400
              rounded-xl
              flex justify-center items-center
              gap-1
              text-slate-500
              font-bold"
              onClick={() => signIn("discord", { callbackUrl: '/' })}
            >
              <Image width={15} height={15} src="/images/discord.svg" alt="Discord" />
              Discord
            </button>

            <button
              type="button"
              className="px-4
              py-2
              cursor-pointer
              hover:text-white
              hover:bg-red-400
              rounded-xl
              flex justify-center items-center
              gap-1
              text-slate-500
              font-bold"
              onClick={() => signIn("twitter", { callbackUrl: '/' })}
            >
              <Image width={15} height={15} src="/images/x.svg" alt="Twitter" /> Twitter(X)
            </button>
          </div>


        </form>
      </div>
    </div>
  );
}


/*
인기 순위 (2025년 기준 추정)

Google: 사용자층 가장 넓음, 설정 쉬움.
Facebook: 소셜 미디어 1위, 복잡함.
Microsoft: 개인+기업 통합, 안정적.
Twitter(X): 간단하고 트렌디.
GitHub: 개발자 중심, 쉬움.
Discord: 커뮤니티 특화, 쉬움.
Apple: 프리미엄 경험, 중간 난이도.
LinkedIn: 전문가 타겟, 중간 난이도.
Instagram: 소셜 미디어 보조, 복잡함.

*/
