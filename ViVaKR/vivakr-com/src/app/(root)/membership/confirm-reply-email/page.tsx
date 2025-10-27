'use client'

import VivTitle from "@/components/VivTitle";
import { IAuthResponse } from "@/interfaces/i-auth-response";
import { IConfirmEmailReplay } from "@/interfaces/i-confirm-email-replay";
import { useSnackbar } from "@/lib/SnackbarContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmEmailReplayPage() {
  const [data, setData] = useState<IConfirmEmailReplay>();
  const searchParams = useSearchParams();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    const tokenFromUrl = searchParams.get('token');
    if (emailFromUrl && tokenFromUrl) {
      try {
        const decodedEmail = decodeURIComponent(emailFromUrl);
        const decodedToken = decodeURIComponent(tokenFromUrl);
        const data: IConfirmEmailReplay = {
          email: decodedEmail,
          token: decodedToken
        }
        setData(data);
      } catch (e: any) {
        throw e;
      }
    }
  }, [searchParams])

  const handleSendConfirmMail = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/confirm-reply-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorResult = await response.json();
          errorMsg = errorResult.message || JSON.stringify(errorResult);
        } catch (e) {
          errorMsg = `${errorMsg} - ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const result: IAuthResponse = await response.json();
      if (result.isSuccess) {
        router.refresh();
        router.push('/membership/profile');

        showSnackbar(`Success: ${result.message || '요청이 성공적으로 처리되었습니다.'}`);
      } else {
        showSnackbar(`Failed: ${result.message || '알 수 없는 오류가 발생했습니다.'}`);
      }
    } catch (err: any) {
      showSnackbar(err.message);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <VivTitle title="이메일 확인하기" />
      <p className="text-red-950
                  bg-yellow-500
                    mb-8
                    px-12 py-4 rounded-2xl">
        {data?.email}
      </p>
      <button
        onClick={handleSendConfirmMail}
        className="border-1 px-4
                        py-2
                        text-slate-500
                        cursor-pointer
                        hover:bg-yellow-300
                        hover:border-yellow-300
                        border-slate-400
                        rounded-2xl">
        확인메일 전송
      </button>
    </div>
  );
}
