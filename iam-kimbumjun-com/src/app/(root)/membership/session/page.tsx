// * src/app/(root)/google/dashboard/page.tsx
"use client";

import VivTitle from "@/components/VivTitle";
import { Container } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import Image from 'next/image';

export default function Dashboard() {
    const { data: session, status } = useSession();

    // 인증 상태 체크
    useEffect(() => {
        if (status === "unauthenticated") {
            // 로그인이 안 되어 있으면 홈으로 리디렉션
            window.location.href = "/membership/google";
        }
    }, [status]);

    if (status === "loading") {
        return <p>로딩 중...</p>;
    }

    if (!session) {
        return null; // 세션이 없으면 아무것도 렌더링하지 않음 (useEffect에서 처리됨)
    }

    return (
        <Container maxWidth="sm" sx={{
            pt: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: '1em',
            alignItems: 'center'
        }}>
            <VivTitle title="회원정보" />
            <Image
                width={50}
                height={50}
                src={session.user?.avata}
                style={{ borderRadius: '50%' }}
                alt='-' />

            <p>{session.user?.fullName}</p>
            <p>{session.user?.email}</p>
            <button
                onClick={() => signOut({ callbackUrl: "/membership/signin" })}
                className="
                px-8
                py-2
                bg-red-400
                cursor-pointer
                hover:bg-sky-400
                text-white rounded-full">
                로그아웃
            </button>
        </Container>
    );
}
