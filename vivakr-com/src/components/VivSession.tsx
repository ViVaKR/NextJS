'use client'
import { useSession } from "next-auth/react";

// const getSession = async () => {

//     // status: 'loading', 'authenticated', 'unauthenticated'
//     // session: 사용자 정보 객체 (로그인 시) 또는 null (로그아웃 또는 로딩 중)
//     const { data: session, status } = useSession();
//     if (status === "loading") {
//         return <p>Loading...</p>;
//     }

//     if (status === "authenticated") {
//         // 로그인된 사용자
//         console.log("User Info:", session.user);
//         console.log("Provider:", session.user?.provider); // 우리가 추가한 provider 정보 확인!
//         console.log("Logged in via:", session.user?.provider === 'credentials' ? 'Local Account' : 'Social Account');

//         return <p>Welcome, {session.user?.name}! You logged in using {session.user?.provider}.</p>;
//     }

//     // 로그인되지 않은 사용자
//     return <p>Please log in.</p>;
// }

export default function VivSession() {
    const { data: session, status } = useSession();
    return (
        <div className="flex flex-col items-center justify-center">
            {status === 'loading' && (<p>Loading</p>)}
            <p> User Info: {session?.user} </p>
            <p>Provider: {session?.user.provider}</p>
            <p>Logged in via: {session?.user.provider === 'credetials' ? 'Local Account' : 'Social Account'}</p>
        </div>
    );
}
