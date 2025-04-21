'use client';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import { Button, Tooltip } from '@mui/material';

const SignOutPage = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-sky-50 to-sky-400">
      <div className="flex justify-center items-center">
        <Tooltip title="로그아웃" arrow placement="top">
          <Button
            variant='text'
            color='primary'
            sx={{
              borderRadius: '50%',
              ":hover": {
                backgroundColor: 'transparent',
                color: 'white',
                border: 'none',
                padding: '3rem',
                borderRadius: '50%',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease-in-out',
                transform: 'scale(1.05)',
              }
            }}
            onClick={handleSignOut}>
            <Image
              src={`/images/sign-out.webp`}
              width={500}
              height={500}
              style={{ width: '640px' }}
              alt="로그아웃"
            />
          </Button>
        </Tooltip>
      </div>
    </div >
  );
};

export default SignOutPage;
