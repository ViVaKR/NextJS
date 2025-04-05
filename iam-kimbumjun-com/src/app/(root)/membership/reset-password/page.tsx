'use client';
import VivTitle from "@/components/VivTitle";
import { IResetPasswordRequest } from "@/interfaces/i-reset-password-request";
import { useSnackbar } from "@/lib/SnackbarContext";
import { Alert, Button, CircularProgress, TextField } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const [resetRequestData, setResetRequestData] = useState<IResetPasswordRequest | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {

    const emailFromUrl = searchParams.get('email');
    const tokenFromUrl = searchParams.get('token');

    if (emailFromUrl && tokenFromUrl) {
      try {
        const decodedEmail = decodeURIComponent(emailFromUrl);
        const decodedToken = decodeURIComponent(tokenFromUrl);
        const initialData: IResetPasswordRequest = {
          email: decodedEmail,
          token: decodedToken,
          newPassword: '',
        };
        setResetRequestData(initialData);
        setError(null);
      } catch (e) {
        setError("필수 정보 (이메일 또는 토큰)가 누락되었습니다.");
      }
    }

  }, [error, searchParams]);

  const handlePasswordResetSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    if (!resetRequestData) {
      setError("재설정 정보를 불러올 수 없습니다. 페이지를 새로고침 해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (newPassword.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    setIsLoading(true);
    const data: IResetPasswordRequest = {
      email: resetRequestData.email,
      token: resetRequestData.token,
      newPassword: newPassword,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccessMessage("비밀번호가 성공적으로 변경되었습니다!");
        showSnackbar("비밀번호 변경완료!!");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "비밀번호 변경에 실패했습니다.");
        showSnackbar("비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      setError("서버와의 연결에 문제가 발생했습니다.");
      showSnackbar("서버 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!resetRequestData) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}><CircularProgress /></div>;
  }

  return (
    <div className="flex flex-col items-center p-8">
      <VivTitle title="비밀번호 재설정" />
      <form onSubmit={handlePasswordResetSubmit}>
        <TextField
          label="새 비밀번호"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
          disabled={isLoading}
        />
        <TextField
          label="새 비밀번호 확인"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
          disabled={isLoading}
        />
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <Button type="submit" variant="contained" color="primary" disabled={isLoading} fullWidth style={{ marginTop: '20px' }}>
          {isLoading ? <CircularProgress size={24} /> : '비밀번호 변경하기'}
        </Button>
      </form>
    </div>
  );
}
