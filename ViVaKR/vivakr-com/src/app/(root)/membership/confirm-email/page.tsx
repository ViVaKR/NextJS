'use client'

import VivTitle from "@/components/VivTitle";
import { IAuthResponse } from "@/interfaces/i-auth-response";
import { useSnackbar } from "@/lib/SnackbarContext";
import { getTokenAsync, userDetailAsync } from "@/services/auth.service";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type confirmReplayData = {
  email: string;
  replayUrl: string;
}

export default function ConfirmEmailPage() {

  const [email, setEmail] = useState<string | null | undefined>();
  const { showSnackbar } = useSnackbar()
  const router = useRouter();
  const [fullName, setFullName] = useState<string>('');
  const [disable, setDisable] = useState<boolean>(false);
  const [domainUrl, setDomainUrl] = useState('//'); // 도메인 초기값
  // 페이지 로드시 토큰 체크
  useEffect(() => {
    const getUserDetail = async () => {
      const token = await getTokenAsync();
      if (!token) {
        router.push('/membership/sign-in'); // 토큰 없으면 리다리렉션
        return;
      }

      const user = await userDetailAsync();
      if (!user) {
        router.push('/membership/sign-in'); // 유저 정보 없으면 리다리렉션
        return;
      }
      setEmail(user.email);
      setFullName(user.fullName);
    }
    getUserDetail();
  }, [router])


  useEffect(() => {
    // 도메인 정보 클라이언트에서 설정
    setDomainUrl(`${window.location.protocol}\/\/${window.location.hostname}/membership`);
  }, []);

  const handleSendMail = async () => {
    setDisable(true);
    try {
      const data: confirmReplayData = {
        email: email || '',
        replayUrl: domainUrl
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/confirm-send-mail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        let errorMsg = `HTTP error! status ${response.status}`;
        try {
          const errorResult: IAuthResponse = await response.json();
          errorMsg = errorResult.message || JSON.stringify(errorResult);
        } catch (e) {
          errorMsg = `${errorMsg} - ${response.statusText}`
        }
        setDisable(false);
        throw new Error(errorMsg);
      }

      const result: IAuthResponse = await response.json();

      if (result.isSuccess) {
        showSnackbar(`Success: ${result.message || '요청이 성공적으로 처리되었습니다.'}`); // 메시지 없을 경우 기본값 추가
        router.push('/');

      } else {
        showSnackbar(`Failed: ${result.message || '알 수 없는 오류가 발생했습니다.'}`); // 메시지 없을 경우 기본값 추가
      }
      setDisable(false);

    } catch (err: any) {
      setDisable(false);
      showSnackbar(`오류발생 : ${err.message || err}`)
    }
  }

  return (
    <div className="w-full px-48 py-8 flex flex-col justify-center items-center gap-4">
      <VivTitle title="메일 인증" />
      <p className="text-slate-400 text-xs"> {domainUrl} </p>
      <Typography sx={{
        textAlign: 'center',
        border: '4px solid lightblue',
        padding: '0.5em 2em',
        borderRadius: '1em',
        fontSize: '2em', color: 'lightblue',
      }}>
        {fullName} 님
      </Typography>

      <Typography sx={{
        textAlign: 'center',
        border: '4px solid lightblue',
        padding: '0.5em 2em',
        borderRadius: '1em',
        fontSize: '2em', color: 'lightblue',
      }}>
        {email}
      </Typography>
      <Button
        onClick={() => handleSendMail()}
        variant='contained'
        disabled={disable}
        color="secondary"
        sx={{
          ":hover": { backgroundColor: 'lightblue', color: 'white' },
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1em'
        }}>
        {disable ? <CircularProgress size={24} color="inherit" /> : '메일전송'}
      </Button>
    </div>
  );
}
