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
import { IChecknameDTO } from '@/interfaces/i-check-name-dto';
import CircularProgress from '@mui/material/CircularProgress'; // 로딩 인디케이터 추가

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

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // --- 필명 체크 관련 상태 추가 ---
  const [isNameAvailable, setIsNameAvailable] = useState<boolean | null>(null); // null: 체크 전, true: 사용 가능, false: 사용 불가능
  const [isCheckingName, setIsCheckingName] = useState<boolean>(false); // 체크 중 로딩 상태
  // --- 끝 ---

  const [hideMembership, setHideMembership] = useState<boolean>(false);

  // IP 주소 확인 로직
  useEffect(() => {
    const checkIp = async () => {
      const rs = await getInfo();
      if (process.env.NEXT_PUBLIC_MYIP) {
        setHideMembership(rs?.ip === process.env.NEXT_PUBLIC_MYIP);
      } else {
        setHideMembership(false); // 기본값은 false로 설정
      }
    };
    checkIp();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, dirtyFields }, // isValid, dirtyFields 추가
    watch,
    getValues,
    reset,
    trigger, // 필드 유효성 검사를 수동으로 트리거하기 위해 추가
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      passwordConfirm: '',
    },
    mode: 'onTouched' // onTouched 또는 onChange로 설정해야 dirtyFields, isValid가 잘 동작함
  });


  useEffect(() => {
    const clearInputs = () => {
      reset();
    };
    clearInputs();
    const timeout = setTimeout(clearInputs, 2000);
    return () => clearTimeout(timeout);
  }, [reset]);

  // 비밀번호 보이기/숨기기 핸들러
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

  // --- 필명 중복 체크 핸들러 수정 ---
  const handleCheckName = async () => {
    const fullNameValue = getValues('fullName');

    // 필드가 수정되지 않았거나 값이 없으면 체크하지 않음
    if (!dirtyFields.fullName || !fullNameValue) {
      setIsNameAvailable(null); // 상태 초기화
      return;
    }

    // react-hook-form의 기본 유효성 검사 먼저 통과하는지 확인 (선택 사항)
    const isFullNameValid = await trigger("fullName");
    if (!isFullNameValid) {
      setIsNameAvailable(null); // 유효하지 않으면 상태 초기화
      return;
    }

    setIsCheckingName(true); // 로딩 시작
    setIsNameAvailable(null); // 이전 결과 초기화

    const checkNameData: IChecknameDTO = { name: fullNameValue };

    try {
      const response = await fetch(`${apiUrl}/api/account/check-name`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkNameData)
      });

      if (!response.ok) {
        // API 오류 처리 (예: 서버 다운)
        console.error("Name check API error:", response.status);
        setIsNameAvailable(false); // API 오류 시 사용 불가능으로 간주하거나, 다른 상태(e.g., 'error') 추가 가능
        showSnackbar("필명 확인 중 오류가 발생했습니다.", "error", 'bottom', 'center');
      } else {
        const result: boolean = await response.json();
        // API 응답 값에 따라 상태 설정 (API가 'true'를 반환하면 중복, 'false'면 사용 가능이라고 가정)
        setIsNameAvailable(!result); // result가 true(중복)이면 isNameAvailable은 false가 됨
      }
    } catch (error) {
      console.error("Error during name check fetch:", error);
      setIsNameAvailable(false); // 네트워크 오류 등 발생 시 사용 불가능 처리
      showSnackbar("필명 확인 중 오류가 발생했습니다.", "error");
    } finally {
      setIsCheckingName(false); // 로딩 종료
    }
  };
  // --- 끝 ---

  // 폼 제출 핸들러 (변경 없음)
  const onSubmit = async (data: SignUpFormData) => {
    // 최종 제출 전 한번 더 필명 사용 가능 여부 확인 (선택 사항)
    if (isNameAvailable !== true) {
      showSnackbar('사용 불가능한 필명입니다. 다른 필명을 사용해주세요.', 'warning');
      return;
    }

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
        `${apiUrl}/api/account/signup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signUpData),
        }
      );

      const result: IAuthResponseDTO = await response.json();
      if (result.isSuccess) {
        showSnackbar(result.message || '회원가입 성공!', 'success', 'bottom', 'center'); // 메시지가 없을 경우 기본값
        router.push('/membership/sign-in');
      } else {
        showSnackbar(result.message || "회원가입에 실패하였습니다. 입력 정보를 확인해주세요.", 'error', 'top', 'right');
      }
    } catch (err: any) {
      console.error("Signup failed:", err); // 에러 로그 추가
      showSnackbar(`회원가입 중 오류가 발생했습니다. ${err.message}`, 'error', 'bottom', 'center');
    }
  };

  // --- 회원가입 버튼 비활성화 조건 ---
  // 1. 필명을 확인 중일 때
  // 2. 필명 확인 결과 사용 불가능할 때 (isNameAvailable === false)
  // 3. 필명 확인을 아직 안 했을 때 (isNameAvailable === null && dirtyFields.fullName) - 사용자가 입력했지만 아직 확인 안함
  // 4. react-hook-form의 전체 폼 유효성 검사를 통과하지 못했을 때 (!isValid)
  const isSubmitDisabled = isCheckingName || isNameAvailable === false || (isNameAvailable === null && !!dirtyFields.fullName) || !isValid;
  // --- 끝 ---

  return (
    <div
      className={`${styles.container}
                bg-transparent
                flex flex-col
                items-center py-24
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
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
          className="xl:w-1/2 2xl:w-1/3 lg:w-3/5 md:2/3
                    shadow-2xl border-lime-400 border-4
                    rounded-3xl mx-8 max-w-sm:w-full max-w-sm:mx-2
                    opacity-95
                    max-w-xs:mx-1 bg-gradient-to-b from-sky-600
                    to-slate-400 py-5 px-10">

          {/* 이메일 (변경 없음) */}
          <FormControl sx={{ m: 1, width: '100%' }} variant="filled">
            <InputLabel htmlFor="email" className='!text-amber-200'>아이디 / 이메일</InputLabel>
            <Controller
              name="email"
              control={control}
              rules={{
                required: '이메일을 입력해주세요.',
                pattern: { // 간단한 이메일 형식 검사 추가 (선택 사항)
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "유효한 이메일 주소를 입력해주세요."
                }
              }}
              render={({ field }) => (
                <FilledInput
                  {...field}
                  error={!!errors.email}
                  autoComplete='off'
                  sx={{ color: 'white' }}
                  id="email"
                  name="email" />
              )}
            />
            {errors.email && <FormHelperText className='!text-red-400'>{errors.email?.message}</FormHelperText>}
          </FormControl>

          {/* --- 필명 수정 --- */}
          <FormControl sx={{ m: 1, width: '100%' }} variant="filled">
            <InputLabel htmlFor="fullName" className='!text-amber-200'>필명</InputLabel>
            <Controller
              name="fullName"
              control={control}
              rules={{ required: '필명을 입력해주세요.' }}
              render={({ field, fieldState }) => ( // fieldState 추가
                <FilledInput
                  {...field}
                  // 에러 표시: react-hook-form 기본 에러 또는 필드가 터치되었고 사용 불가능할 때
                  error={!!errors.fullName || (fieldState.isTouched && isNameAvailable === false)}
                  sx={{ color: 'white' }}
                  // onMouseLeave 대신 onBlur 사용
                  onBlur={async (e: any) => {
                    field.onBlur(); // react-hook-form의 onBlur를 먼저 호출하여 touched 상태 업데이트
                    await handleCheckName(); // 필명 중복 체크 실행
                  }}
                  id="fullName"
                  name="fullName"
                  aria-describedby="fullName-helper-text"
                  endAdornment={ // 로딩 인디케이터 추가
                    isCheckingName ? (
                      <InputAdornment position="end">
                        <CircularProgress size={20} color="inherit" />
                      </InputAdornment>
                    ) : null
                  }
                />
              )}
            />
            {/* 에러 메시지 */}
            {errors.fullName && <FormHelperText id="fullName-helper-text" className='!text-red-400'>{errors.fullName?.message}</FormHelperText>}
            {/* 필명 체크 결과 메시지 */}
            {!isCheckingName && isNameAvailable === true && (
              <FormHelperText id="fullName-helper-text" className='!text-green-400'>사용 가능한 필명입니다.</FormHelperText>
            )}
            {!isCheckingName && isNameAvailable === false && (
              <FormHelperText id="fullName-helper-text" className='!text-red-400'>이미 사용 중이거나 사용할 수 없는 필명입니다.</FormHelperText>
            )}
            {/* 체크 중 메시지는 InputAdornment로 이동 */}
          </FormControl>
          {/* --- 끝 --- */}

          {/* 비밀번호 (변경 없음) */}
          <FormControl sx={{ m: 1, width: '100%' }} variant="filled">
            <InputLabel htmlFor="password" className='!text-amber-200'>비밀번호</InputLabel>
            <Controller
              name="password"
              control={control}
              rules={{
                required: '비밀번호를 입력해주세요.',
                minLength: { value: 6, message: '비밀번호는 6자 이상이어야 합니다.' } // 최소 길이 추가 (선택 사항)
              }}
              render={({ field }) => (
                <FilledInput
                  {...field}
                  id="password"
                  name='password'
                  error={!!errors.password}
                  sx={{ color: 'white' }}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword} // onMouseUp 추가 (클릭 후 포커스 유지 방지)
                        edge="end"
                        tabIndex={-1} // tab 순서에서 제외
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              )}
            />
            {errors.password && <FormHelperText className='!text-red-400'>{errors.password?.message}</FormHelperText>}
          </FormControl>

          {/* 비밀번호 확인 (변경 없음, watch 추가) */}
          <FormControl sx={{ m: 1, width: '100%' }} variant="filled">
            <InputLabel htmlFor="passwordConfirm" className='!text-amber-200'>비밀번호 확인</InputLabel>
            <Controller
              name="passwordConfirm"
              control={control}
              rules={{
                required: '비밀번호 확인을 입력해주세요.',
                validate: value => // 비밀번호 일치 검사
                  value === watch('password') || '비밀번호가 일치하지 않습니다.'
              }}
              render={({ field }) => (
                <FilledInput
                  {...field}
                  id="passwordConfirm"
                  name="passwordConfirm"
                  sx={{ color: 'white' }}
                  error={!!errors.passwordConfirm}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              )}
            />
            {errors.passwordConfirm && <FormHelperText className='!text-red-400'>{errors.passwordConfirm?.message}</FormHelperText>}
          </FormControl>

          {/* 버튼 그룹 */}
          <div className="flex justify-evenly mt-6">
            {/* 1. 취소 버튼 (변경 없음) */}
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={() => reset()} // 취소 시 이전 페이지로 이동 등
              className="!text-lime-300 !border-lime-300 !font-bold hover:!bg-sky-500 hover:!text-white">
              취소
            </Button>
            {/* 2. 이미 회원이신가요? 버튼 */}
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={() => router.push('/membership/sign-in')}
              className="!text-lime-300 !border-lime-300 !font-bold hover:!bg-sky-500 hover:!text-white">
              이미 회원이신가요?
            </Button>

            {/* --- 3. 회원가입 버튼 수정 --- */}
            <Button
              type="submit"
              // hidden 대신 disabled 사용
              disabled={isSubmitDisabled} // 위에서 정의한 비활성화 조건 사용
              variant="outlined"
              color="primary"
              // 비활성화 시 스타일 추가 ( TailwindCSS 활용 )
              className={`!text-lime-300 !border-lime-300 !font-bold hover:!bg-sky-500 hover:!text-white ${isSubmitDisabled ? '!opacity-50 !cursor-not-allowed' : ''}`}
            >
              회원가입
            </Button>
            {/* --- 끝 --- */}
          </div>
        </form>
      )}
    </div>
  );
}

