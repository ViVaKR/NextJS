'use client';
import { useAuth } from '@/lib/AuthContext';
import Image from 'next/image';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { useState } from 'react';
import VivTitle from '@/components/VivTitle';

const SignOutPage = () => {
  const { logout } = useAuth();
  const [disable, setDisable] = useState<boolean>(false);

  const handleSignOut = async () => {
    setDisable(true);
    try {
      logout();
    } catch (err: any) {
      console.error('Logout failed:', err);
    } finally {
      setDisable(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-sky-50 to-sky-400">
      <div className="flex flex-col gap-2 justify-center items-center">
        <VivTitle title="로그아웃" />
        <Tooltip title="로그아웃" arrow placement="top">

          <Button
            variant='text'
            color='primary'
            disabled={disable}
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
            {disable ? <CircularProgress size={96} color="inherit" /> : (
              <Image
                src={`/images/sign-out.webp`}
                width={500}
                height={500}
                style={{ width: '640px' }}
                alt="로그아웃"
              />
            )}

          </Button>
        </Tooltip>
      </div>
    </div >
  );
};

export default SignOutPage;
