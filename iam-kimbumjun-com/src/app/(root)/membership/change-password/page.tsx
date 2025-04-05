'use client'
import VivTitle from "@/components/VivTitle";
import { useSnackbar } from "@/lib/SnackbarContext";
import { getToken } from "@/services/auth.service";
import { Controller, useForm } from "react-hook-form";
import { useProfile } from "../profile/Profile";
import { Button, FilledInput, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IChangePassword } from "@/interfaces/i-change-password";
import { IAuthResponse } from "@/interfaces/i-auth-response";


type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function ChangePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter()
  const { showSnackbar } = useSnackbar();
  const { user } = useProfile();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ChangePasswordData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    mode: 'onTouched'
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault();

  const onSubmit = async (data: ChangePasswordData) => {
    setError(null);
    setIsLoading(true);

    if (!user?.email) {
      setError("사용자 이메일 정보가 없습니다. 로그인 상태를 확인해주세요.");
      setIsLoading(false);
      return;
    }

    if (data.newPassword !== data.confirmNewPassword) {
      setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.')
      return;
    }

    if (data.newPassword.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    const sendData: IChangePassword = {
      email: user.email,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    };

    try {
      const token = getToken();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/account/changepassword`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 인증 헤더 추가
        },
        body: JSON.stringify(sendData)
      });

      const result: IAuthResponse = await response.json();

      if (response.ok && result.isSuccess) {
        showSnackbar("비밀번호 변경 완료! 로그아웃 후 재로그인 해주세요.");
        router.push('/membership/sign-out');
      } else {
        setError(result.message || "비밀번호 변경에 실패했습니다.");
        showSnackbar(result.message || "비밀번호 변경 실패");
      }

    } catch (err: any) {
      showSnackbar(`서버측 오류가 발생하였습니다. : ${err.message}`)
    }
  }

  return (
    <div className=" flex flex-col items-center py-24 justify-baseline" >

      <VivTitle title="비밀번호 변경" />
      <p className="px-8 py-4 bg-amber-400 w-[400px] rounded-full text-center text-slate-700 text-xl h-auto"> {user?.email || "로딩 중..."} </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col items-center gap-4 my-8"
      >
        {/* 에러 메시지 표시 */}
        {error && <FormHelperText error>{error}</FormHelperText>}

        {/* 현재 비밀번호 */}
        <FormControl>
          <InputLabel htmlFor="currentPassword">현재 비밀번호</InputLabel>
          <Controller
            name="currentPassword"
            control={control}
            rules={{ required: '현재 비밀번호를 입력해 주세요' }}
            render={({ field }) => (
              <FilledInput
                {...field}
                error={!!errors.currentPassword}
                id="currentPassword"
                type={showPassword ? 'text' : 'password'}
                sx={{ width: '400px' }}
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
          <FormHelperText>{errors.currentPassword?.message}</FormHelperText>
        </FormControl>

        {/* 새로운 비밀번호 */}
        <FormControl>
          <InputLabel htmlFor="newPassword">새로운 비밀번호</InputLabel>
          <Controller
            name="newPassword"
            control={control}
            rules={{ required: '새로운 비밀번호르 입력해 주세요' }}
            render={({ field }) => (
              <FilledInput
                {...field}
                error={!!errors.newPassword}
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                sx={{ width: '400px' }}
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
          <FormHelperText>{errors.newPassword?.message}</FormHelperText>
        </FormControl>

        {/* 새로운 비밀번호 확인 */}
        <FormControl>
          <InputLabel htmlFor="confirmNewPassword">새로운 비밀번호 확인</InputLabel>
          <Controller
            name="confirmNewPassword"
            control={control}
            rules={{ required: '새로운 비밀번호 확인을 확인하여 주세요' }}
            render={({ field }) => (
              <FilledInput
                {...field}
                error={!!errors.confirmNewPassword}
                id="confirmNewPassword"
                type={showPassword ? 'text' : 'password'}
                sx={{ width: '400px' }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      tabIndex={-1}
                      onMouseDown={handleMouseDownPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            )}
          />
          <FormHelperText>{errors.confirmNewPassword?.message}</FormHelperText>
        </FormControl>


        {/* 버튼그룹 */}
        <div className="flex justify-evenly mt-6 gap-2">
          {/* 취소 */}
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={() => router.back()}
            className="!text-slate-400 !font-bold hover:!bg-sky-500 hover:!text-white">
            취소
          </Button>

          {/* 비밀번호 변경 */}
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            className="!text-slate-400 !font-bold hover:!bg-sky-500 hover:!text-white">
            {isLoading ? "변경 중..." : "비밀번호 변경"}
          </Button>
        </div>

      </form>
    </div>
  )
}
