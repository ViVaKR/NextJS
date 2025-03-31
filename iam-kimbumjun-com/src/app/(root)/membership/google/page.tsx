// * src/app/(root)/google/page.tsx

"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from 'next/image'
export default function Home() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div>
                <p>환영합니다, {session.user?.fullName}님!</p>
                <button onClick={() => signOut()}>로그아웃</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-1/2">
            <button
                type="button"
                className="px-8 py-2 cursor-pointer hover:text-white hover:bg-red-400 rounded-full flex gap-2
                text-slate-500 font-bold"
                onClick={() => signIn("google")}>
                <Image
                    width={25}
                    height={25}
                    src="/images/google-icon.svg"
                    alt="Google" /> 구글 로그인

            </button>
        </div>
    );
}
