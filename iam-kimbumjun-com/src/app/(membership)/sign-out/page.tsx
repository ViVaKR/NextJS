'use client';
import VivTitle from '@/components/VivTitle';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';

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
    <div className="flex flex-col items-center py-48 h-screen bg-orange-100">
      <Image
        src={`/images/sign-out.webp`}
        width={500}
        height={500}
        alt=""
      />

      <div className="flex flex-col justify-center items-center">
        <button
          type="button"
          onClick={handleSignOut}
          className="cursor-pointer px-4 py-2  w-48 h-auto rounded-full hover:bg-orange-200">
          <VivTitle title="로그아웃" />
        </button>
      </div>
    </div>
  );
};

export default SignOutPage;
