'use client'
import VivTitle from "@/components/VivTitle";
import { IAuthResponse } from "@/interfaces/i-auth-response";
import { useSnackbar } from "@/lib/SnackbarContext";
import { Button, FilledInput, FormControl, FormHelperText, InputLabel } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

type ForgetPasswordFormData = {
  email: string;
}

export default function ForgetPasswordPaage() {

  const { showSnackbar } = useSnackbar()

  const onSubmit = async (data: ForgetPasswordFormData) => {
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
    formState: { errors },
    watch

  } = useForm<ForgetPasswordFormData>({
    defaultValues: {
      email: ''
    },
    mode: 'onTouched'
  })


  return (
    <div>
      <VivTitle title="비밀번호 분실" />

      <form onSubmit={handleSubmit(onSubmit)}>

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

              />
            )}

          />
          <FormHelperText>
            {errors.email?.message}
          </FormHelperText>
          {watch('email')}
        </FormControl>

        <Button type="submit" variant="outlined" color="primary">
          비밀번호 변경 이메일 보내기
        </Button>


      </form>
    </div>
  );
}


/*

--> IAuthResponse

   this.authService.forgetPassword(this.email).subscribe({
      next: (res) => {
        this.showEmailSent = true;
        if (res.isSuccess) {
          this.showSnackBar('비밀번호 재설정 이메일이 전송되었습니다.');
        } else {
          this.showEmailSent = false;
          this.showSnackBar(res.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isSpinner = false;
        var message = "=> " + err.message;
        this.showSnackBar(message);
      },
      complete: () => {
        this.isSubmitting = false;
        this.isSpinner = false;
      }
    });

  }

 //* 비밀번호 분실시 이메일 확인 메서드
  forgetPassword(email: string): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.baseUrl}/api/account/forgetpwd`, { email });
  }


*/
