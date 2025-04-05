// src/app/(root)/membership/cancel-membership/CancelMemberShipPage.tsx
'use client';
import VivTitle from '@/components/VivTitle';
import { FilledInput, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, Button } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { useProfile } from '../profile/Profile';
import { getToken } from '@/services/auth.service';
import { useSnackbar } from '@/lib/SnackbarContext';
import { useRouter } from 'next/navigation';
import { IAuthResponse } from '@/interfaces/i-auth-response';

type DeleteAccountData = {
  password: string;
};

export default function CancelMemberShipPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useProfile();
  const { showSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DeleteAccountData>({
    defaultValues: {
      password: '',
    },
    mode: 'onTouched',
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault();

  const onSubmit = async (data: DeleteAccountData) => {
    setError(null);
    setIsLoading(true);

    if (!user?.email) {
      setError("사용자 정보가 없습니다. 로그인 상태를 확인해주세요.");
      setIsLoading(false);
      return;
    }

    const sendData = {
      email: user.email,
      password: data.password,
    };

    try {
      const token = getToken();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/account/cancel-account`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 인증 토큰 추가
        },
        body: JSON.stringify(sendData),
      });

      const result: IAuthResponse = await response.json();

      if (response.ok && result.isSuccess) {
        showSnackbar("계정이 성공적으로 삭제되었습니다.");
        router.push('/'); // 홈으로 리다이렉트
      } else {
        setError(result.message || "계정 삭제에 실패했습니다.");
        showSnackbar(result.message || "계정 삭제 실패");
      }
    } catch (err: any) {
      setError("서버 오류가 발생했습니다.");
      showSnackbar(`서버 오류: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <VivTitle title="회원탈퇴" />
      <p>회원탈퇴를 진행하시겠습니까?</p>
      <p>비밀번호로 인증해주세요.</p>
      <p className="px-8 py-4 bg-amber-400 w-[400px] rounded-full text-center text-slate-700 text-xl h-auto">
        {user?.email || "로딩 중..."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center gap-4">
        {error && <FormHelperText error>{error}</FormHelperText>}

        <FormControl>
          <InputLabel htmlFor="password">비밀번호</InputLabel>
          <Controller
            name="password"
            control={control}
            rules={{ required: '비밀번호를 입력해주세요.' }}
            render={({ field }) => (
              <FilledInput
                {...field}
                error={!!errors.password}
                id="password"
                type={showPassword ? 'text' : 'password'}
                sx={{ width: '400px' }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            )}
          />
          <FormHelperText>{errors.password?.message}</FormHelperText>
        </FormControl>

        <div className="flex justify-evenly mt-6 gap-2">
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={() => router.back()}
            disabled={isLoading}
            className="!text-slate-400 !font-bold hover:!bg-sky-500 hover:!text-white"
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="outlined"
            color="warning"
            disabled={isLoading || !watch('password')}
            className="!text-slate-400 !font-bold hover:!bg-red-500 hover:!text-white"
          >
            {isLoading ? "삭제 중..." : "회원탈퇴"}
          </Button>
        </div>
      </form>
    </div>
  );
}
