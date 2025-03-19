'use client';
import VivTitle from '@/components/VivTitle';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import React from 'react';

const SignOutPage = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
    router.push('/');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <React.Fragment>
      <VivTitle title="로그아웃" />
      <div className="flex flex-col justify-center items-center">
        <button
          type="button"
          onClick={handleSignOut}
          className="cursor-pointer px-4 py-2 w-48 h-12 rounded-xl bg-slate-400 hover:bg-red-400">
          Sign Out
        </button>
      </div>
    </React.Fragment>
  );
};

export default SignOutPage;
