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
import { IRegisterRequest } from '@/interfaces/i-register-request';
import { IAuthResponseDTO } from '@/interfaces/i-auth-response';
import { useEffect, useState } from 'react';
import { IIpInfo } from '@/interfaces/i-ip-info';
import { useSnackbar } from '@/lib/SnackbarContext';


const api = process.env.NEXT_PUBLIC_IPINFO_URL2;

// IP 정보 가져오는 함수 (변경 없음)
async function getInfo(): Promise<IIpInfo | undefined> {
  try {
    const response = await fetch(`${api}/api/ip`);
    if (!response.ok) {
      throw new Error(`Failed to fetch IP: ${response.status}`);
    }
    const data: IIpInfo = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting IP info:", error);
    // 기본값 또는 에러 상황에 맞는 객체 반환 (예: 빈 IP)
    // return { ip: '', country: '', city: '' }; // 예시
    return undefined;
  }
}

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

  const { showSnackbar } = useSnackbar();

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
    mode: 'onTouched'
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
      showSnackbar('비밀번호가 일치하지 않습니다.', 'error', 'bottom', 'center')
      return;
    }

    const signUpData: IRegisterRequest = {
      email: data.email,
      fullName: data.fullName,
      password: data.password,
      roles: [],
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

      const result: IAuthResponseDTO = await response.json();
      if (result.isSuccess) {
        showSnackbar(result.message, 'success', 'top', 'right');
        router.push('/membership/sign-in');
      } else {
        showSnackbar(result.message, 'error', 'top', 'right');
      }
    } catch (err: any) {
      showSnackbar(err.message, 'error', 'top', 'right');
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
      {hideMembership && (
        <VivTitle
          title="회원가입"
          fontColor="text-lime-400"
        />
      )}

      {/* 폼 시작 */}
      {hideMembership && (
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

          {/* 이메일 */}
          <FormControl sx={{ m: 1, width: '100%' }} variant="filled">
            <InputLabel htmlFor="email" className='!text-amber-200'>아이디 / 이메일</InputLabel>
            <Controller
              name="email"
              control={control}
              rules={{ required: '이메일을 입력해주세요.' }}
              render={({ field }) => (
                <FilledInput
                  {...field}
                  error={!!errors.email}
                  sx={{ color: 'white' }}
                  id="email" />
              )}
            />
            <FormHelperText className='!text-red-400'>{errors.email?.message}</FormHelperText>
          </FormControl>

          {/* 필명 */}
          <FormControl sx={{ m: 1, width: '100%' }} variant="filled">
            <InputLabel htmlFor="fullName" className='!text-amber-200'>필명</InputLabel>
            <Controller
              name="fullName"
              control={control}
              rules={{ required: '필명을 입력해주세요.' }}
              render={({ field }) => (
                <FilledInput {...field}
                  error={!!errors.fullName}
                  sx={{ color: 'white' }}
                  id="fullName" aria-describedby="fullName-helper-text" />
              )}
            />
            <FormHelperText className='!text-red-400'>{errors.fullName?.message}</FormHelperText>
          </FormControl>

          {/* 비밀번호 */}
          <FormControl sx={{ m: 1, width: '100%' }} variant="filled">
            <InputLabel htmlFor="password" className='!text-amber-200'>비밀번호</InputLabel>
            <Controller
              name="password"
              control={control}
              rules={{ required: '비밀번호를 입력해주세요.' }}
              render={({ field }) => (
                <FilledInput
                  {...field}
                  id="password"
                  error={!!errors.password}
                  sx={{ color: 'white' }}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        tabIndex={-1}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              )}
            />
            <FormHelperText className='!text-red-400'>{errors.password?.message}</FormHelperText>
          </FormControl>

          {/* 비밀번호 확인 */}
          <FormControl sx={{ m: 1, width: '100%' }} variant="filled">
            <InputLabel htmlFor="passwordConfirm" className='!text-amber-200'>비밀번호 확인</InputLabel>
            <Controller
              name="passwordConfirm"
              control={control}
              rules={{ required: '비밀번호 확인을 입력해주세요.' }}
              render={({ field }) => (
                <FilledInput
                  {...field}
                  id="passwordConfirm"
                  sx={{ color: 'white' }}
                  error={!!errors.passwordConfirm}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        tabIndex={-1}
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              )}
            />
            <FormHelperText className='!text-red-400'>{errors.passwordConfirm?.message}</FormHelperText>
          </FormControl>

          {/* 버튼그룹 */}
          <div className="flex justify-evenly mt-6">
            {/* 1 */}
            <Button
              type="button"
              variant="outlined"
              color="primary"
              className="!text-lime-300 !border-lime-300 !font-bold hover:!bg-sky-500 hover:!text-white">
              취소
            </Button>
            {/* 2 */}
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={() => router.push('/membership/sign-in')}
              className="!text-lime-300 !border-lime-300 !font-bold hover:!bg-sky-500 hover:!text-white">
              이미회원이신가요?
            </Button>
            {/* 3 */}
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              className="!text-lime-300 !border-lime-300 !font-bold hover:!bg-sky-500 hover:!text-white">
              회원가입
            </Button>
          </div>
          {/* 링크 */}
        </form>
      )}

    </div>
  );
}
