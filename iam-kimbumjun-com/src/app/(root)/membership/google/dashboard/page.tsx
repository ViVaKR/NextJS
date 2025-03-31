// * src/app/(root)/google/dashboard/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Dashboard() {
    const { data: session, status } = useSession();

    // 인증 상태 체크
    useEffect(() => {
        if (status === "unauthenticated") {
            // 로그인이 안 되어 있으면 홈으로 리디렉션
            window.location.href = "/";
        }
    }, [status]);

    if (status === "loading") {
        return <p>로딩 중...</p>;
    }

    if (!session) {
        return null; // 세션이 없으면 아무것도 렌더링하지 않음 (useEffect에서 처리됨)
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>대시보드에 오신 걸 환영합니다!</h1>
            <p>안녕하세요, {session.user?.fullName}님!</p>
            <p>이메일: {session.user?.email}</p>
            <button
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#ff4444",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                로그아웃
            </button>
        </div>
    );
}
