'use client';
import { useAuth } from '@/lib/AuthContext';
import { useEffect, useState } from 'react';
import styles from './Login.module.css';
import Link from 'next/link';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  FilledInput,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Tooltip,
} from '@mui/material';
import { useSnackbar } from '@/lib/SnackbarContext';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ISignInRequest } from '@/interfaces/i-signin-request';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { IIpInfo } from '@/interfaces/i-ip-info';

const api = process.env.NEXT_PUBLIC_IPINFO_URL2;

// IP 정보 가져오는 함수
async function getInfo(): Promise<IIpInfo | undefined> {
  try {
    const response = await fetch(`${api}/api/ip`);
    if (!response.ok) {
      throw new Error(`Failed to fetch IP: ${response.status}`);
    }
    const data: IIpInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting IP info:', error);
    // 기본값 또는 에러 상황에 맞는 객체 반환 (예: 빈 IP)
    // return { ip: '', country: '', city: '' }; // 예시
    return undefined;
  }
}

export default function SignIn() {
  const router = useRouter();
  const { login, loading, user } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [domain, setDomain] = useState('');

  const [hideMembership, setHideMembership] = useState<boolean>(false);

  // IP 주소 확인 로직 (마운트 시 한 번 실행)
  useEffect(() => {
    const checkIp = async () => {
      const rs = await getInfo();
      // 환경 변수 값이 있는지 확인 (없으면 비교 불가)
      if (process.env.NEXT_PUBLIC_MYIP) {
        setHideMembership(rs?.ip === process.env.NEXT_PUBLIC_MYIP);
      } else {
        setHideMembership(false); // 환경 변수가 없으면 숨기지 않음 (기본값)
      }
    };

    checkIp();
  }, []); // 빈 의존성 배열: 마운트 시 1회 실행

  // const domain = typeof window !== 'undefined' ? window.location.hostname : '';

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const response = await fetch('/api/vhost');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDomain(data.domain); // 상태 업데이트
      } catch (error) {
        console.error('도메인 가져오기 실패:', error);
      }
    };

    fetchDomain();
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

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

  if (loading) return <div className='content-center'>로딩 중...</div>;

  const showLoginSuccess = () => {
    showSnackbar('환영합니다.', 'success', 'bottom', 'right', 2000);
  };

  const showLoginFailed = () =>
    showSnackbar('로그인 실패하였습니다.', 'error', 'bottom', 'right', 3000);

  // --> 로그인 처리
  const onFormSubmit = async (data: ISignInRequest) => {
    try {
      const result = await login(data.email, data.password);
      if (result) {
        showLoginSuccess();
        router.push('/');
      } else {
        showLoginFailed();
      }
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  return (
    <div className={`${styles.signinForm} bg-gradient-to-b from-sky-100 to-sky-500`}>
      <div className={styles.box}>
        <span className={styles.borderLine}></span>
        {hideMembership && (
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
                <InputLabel htmlFor="email">Email</InputLabel>

                <Controller
                  name="email"
                  control={control}
                  rules={{ required: '이메일을 입력해 주세요' }}
                  render={({ field }) => (
                    <FilledInput
                      {...field}
                      error={!!errors.email}
                      id="email"
                      name="email"
                    />
                  )}
                />
                <FormHelperText>{errors.email?.message}</FormHelperText>
              </FormControl>
            </div>
            {/* Password */}
            <div className="w-full">
              <FormControl
                sx={{ width: '100%' }}
                variant="filled">
                <InputLabel htmlFor="password"> Password </InputLabel>

                <Controller
                  name="password"
                  control={control}
                  rules={{ required: '비밀번호를 입력해 주세요' }}
                  render={({ field }) => (
                    <FilledInput
                      {...field}
                      id="password"
                      name='password'
                      // {...control.register('password')}
                      error={!!errors.password}
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
                            tabIndex={-1}
                            edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                <FormHelperText>{errors.password?.message}</FormHelperText>
              </FormControl>
            </div>

            <div className={styles.links}>
              <Link href="/membership/forget-password">Forget pasword</Link>
              <Link href="/membership/sign-up">Do not have an account</Link>
            </div>
            <p className='text-xs text-slate-500 text-center'>코드 쓰기는 본 사이트 회원만 가능합니다.</p>

            <div className="w-1/2 flex justify-center items-center">
              <button
                className={styles.btnSubmit}
                type="submit"
                value="Submit">
                Login
              </button>
            </div>
            <span className="flex-1 clear-both"></span>


            {domain == 'vivakr.com' ? (
              <>
                <div className="flex justify-evenly mb-8 text-xs items-center">
                  {/* Google */}
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
                    onClick={() => signIn('google', { callbackUrl: '/' })}>
                    <Image
                      width={15}
                      height={15}
                      src="/images/google-icon.svg"
                      alt="Google"
                    />
                    Google
                  </button>
                  {/* GitHub */}
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
                    onClick={() => signIn('github', { callbackUrl: '/' })}>
                    <Image
                      width={15}
                      height={15}
                      src="/images/github-mark.svg"
                      alt="GitHub"
                    />{' '}
                    GitHub
                  </button>
                  {/* Microsoft */}
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
                    onClick={() => signIn('azure-ad', { callbackUrl: '/' })}>
                    <Image
                      width={15}
                      height={15}
                      src="/images/microsoft.svg"
                      alt="Microsoft"
                    />{' '}
                    Microsoft
                  </button>
                </div>


                <div
                  hidden
                  className="flex justify-evenly text-xs mb-4 items-center">
                  <button
                    type="button"
                    disabled
                    hidden
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
                    onClick={() => signIn('facebook', { callbackUrl: '/' })}>
                    <Image
                      width={15}
                      height={15}
                      src="/images/facebook.svg"
                      alt="Facebook Meta"
                    />
                    Facebook
                  </button>
                  <button
                    type="button"
                    disabled
                    hidden
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
                    onClick={() => signIn('discord', { callbackUrl: '/' })}>
                    <Image
                      width={15}
                      height={15}
                      src="/images/discord.svg"
                      alt="Discord"
                    />
                    Discord
                  </button>

                  <button
                    type="button"
                    disabled
                    hidden
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
                    onClick={() => signIn('twitter', { callbackUrl: '/' })}>
                    <Image
                      width={15}
                      height={15}
                      src="/images/x.svg"
                      alt="Twitter"
                    />{' '}
                    Twitter(X)
                  </button>
                </div>
              </>
            ) : (
              <Tooltip title="소셜 로그인을 위하여 vivakr.com 으로 이동합니다." arrow>
                <Link
                  href={`https://vivakr.com/membership/sign-in`}
                  className="text-center flex bottom-0
                          items-center mb-8 mt-8
                          mx-auto
                          rounded-lg
                          hover:bg-sky-500
                          hover:text-white
                          text-slate-400
                          justify-center
                          px-4 py-2
                          w-auto h-auto">
                  Social Login
                </Link>
              </Tooltip>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

