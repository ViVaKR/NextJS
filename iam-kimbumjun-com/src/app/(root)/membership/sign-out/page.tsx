'use client';
import VivTitle from '@/components/VivTitle';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import { Button } from '@mui/material';

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
    <div className="flex flex-col items-center h-screen justify-center bg-orange-100">
      <Image
        src={`/images/sign-out.webp`}
        width={500}
        height={500}
        style={{ width: '640px' }}
        alt="로그아웃"
      />

      <div className="flex justify-center items-center">
        <Button
          variant='outlined'
          color='warning'
          sx={{
            ":hover": {
              backgroundColor: 'orange',
              color: 'white',
              border: 'none'
            }
          }}
          onClick={handleSignOut}>
          로그아웃
        </Button>
      </div>
    </div >
  );
};

export default SignOutPage;
