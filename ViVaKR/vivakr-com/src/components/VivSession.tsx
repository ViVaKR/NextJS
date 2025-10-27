'use client'
import { useSession } from "next-auth/react";

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
