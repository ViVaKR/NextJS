'use client'
import VivTitle from "@/components/VivTitle";
import { IAuthResponse } from "@/interfaces/i-auth-response";
import { useSnackbar } from "@/lib/SnackbarContext";
import { Button, CircularProgress, FilledInput, FormControl, FormHelperText, InputLabel, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type ForgetPasswordFormData = {
  email: string;
  replayUrl: string;
}

export default function ForgetPasswordPaage() {
  const { showSnackbar } = useSnackbar();
  const [domainUrl, setDomainUrl] = useState('//'); // 도메인 초기값

  useEffect(() => {
    // 도메인 정보 클라이언트에서 설정
    setDomainUrl(`${window.location.protocol}\/\/${window.location.hostname}/membership`);
  }, []);
  const onSubmit = async (data: ForgetPasswordFormData) => {

    data.replayUrl = domainUrl; // "https://vivakr.com/membership";

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/forgetpwd`, { // <-- 괄호 제거
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data) // <-- { sendMail } 대신 data 객체 직접 사용
      });

      // 추가: 응답 상태 코드 확인 (더 안정적인 처리)
      if (!response.ok) {
        // 서버에서 에러 메시지를 JSON으로 보낼 경우 처리 시도
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorResult = await response.json();
          // 서버 응답에 message 필드가 있다면 사용, 없다면 전체 응답을 문자열로 변환
          errorMsg = errorResult.message || JSON.stringify(errorResult);
        } catch (e) {
          // JSON 파싱 실패 시 상태 텍스트 사용
          errorMsg = `${errorMsg} - ${response.statusText}`;
        }
        throw new Error(errorMsg); // 에러를 발생시켜 catch 블록에서 처리
      }

      const result: IAuthResponse = await response.json();

      if (result.isSuccess) {
        showSnackbar(`Success: ${result.message || '요청이 성공적으로 처리되었습니다.'}`); // 메시지 없을 경우 기본값 추가
      } else {
        showSnackbar(`Failed: ${result.message || '알 수 없는 오류가 발생했습니다.'}`); // 메시지 없을 경우 기본값 추가
      }

    } catch (err: any) {
      // err 객체에 message 속성이 있는지 확인하고 사용
      showSnackbar(`오류 발생: ${err.message || err}`);
    }
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordFormData>({
    defaultValues: { email: '' },
    mode: 'onTouched'
  });


  return (
    <div className="flex flex-col w-full items-center">
      <VivTitle title="비밀번호 분실" />

      <form onSubmit={handleSubmit(onSubmit)} style={{ minWidth: '50%' }}>

        {/* 이메일 */}
        <FormControl sx={{ m: 1, width: '100%' }} variant="filled">
          <InputLabel htmlFor="email">수신할 이메일 주소</InputLabel>
          <Controller
            name="email"
            control={control}
            rules={{ required: '이메일을 입력하여 주세요.' }}
            render={({ field }) => (
              <FilledInput
                {...field}
                error={!!errors.email}
                id="email"
                name="email"
              />
            )}
          />
          {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}

        </FormControl>

        <Stack direction='row' sx={{ width: '100%' }}>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            disabled={isSubmitting}
            sx={{ mx: 'auto', width: 'auto', }}>

            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : '비밀번호 변경 메일전송'}
          </Button>
        </Stack>
      </form>
    </div>
  );
}
