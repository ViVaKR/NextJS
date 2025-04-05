'use client'
import { IConfirmEmailReplay } from "@/interfaces/i-confirm-email-replay";
import { useAuth } from "@/lib/AuthContext";
import { useSnackbar } from "@/lib/SnackbarContext";
import { userDetail } from "@/services/auth.service";
import { Box, TextField } from "@mui/material";

export default function ChangePasswordPage() {

  const { showSnackbar } = useSnackbar();
  const auth = useAuth();
  const detail = userDetail();

  const onSubmit = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/account/confirm-reply-email`;
    if (auth.user && detail?.email) {
      const data: IConfirmEmailReplay = {
        email: detail.email,
        token: auth.user.token
      }

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        // *  추가 : 응답 상태 코드 확인 (더 안정적인 처리)
        if (!response.ok) {

          // * 서버에서 에러 메시지를 JSON 으로 보낼 경우 처리 시도.
          let errorMsg = `HTTP error! status: ${response.status}`;

          try {
            const errorResult = await response.json();
            // * 서버 응답에 message 필드가 있다면 사요, 없다면 전체 응답을 문자열로 변환
            errorMsg = errorResult.message || JSON.stringify(errorResult);
          } catch (error) {
            // * JSON 파싱 실패 시 상태 텍스트 사용
            errorMsg = `${errorMsg} - ${response.statusText}`
          }

          // * 에러를 발생시켜 catch 블록에서 처리
          throw new Error(errorMsg);
        }
      } catch (err: any) {
        showSnackbar(`오류 발생: ${err.message || err}`);
      }

      return (
        <>
          <h1>ChangePasswordPage</h1>

          <Box sx={{
            px: 2,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>

          </Box>
        </>
      )
    }
  }
}
