'use client';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Title from '@/components/VivTitle';
import { useProfile } from './Profile';
import { Avatar, Divider, TextField } from '@mui/material';
import FileManager from '@/components/file-manager/FileManager';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSnackbar } from '@/lib/SnackbarContext';
import { IUpdateUserName } from '@/interfaces/i-update-user-name';
import { fetchUserDetailAsync, getTokenAsync } from '@/services/auth.service'
import { fetchUserCodesAsync } from '@/lib/fetchCodes';
import { ICode } from '@/interfaces/i-code';
import VivGridControl from '@/components/VivGridControl';

export default function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [name, setName] = useState<string>('');
  const { user, updateUser, isAdmin } = useProfile();
  const [userCodes, setUserCodes] = useState<ICode[] | null>(null);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  // 프로필 페이지 마운트 시 최신 사용자 정보 패칭
  useEffect(() => {
    const refreshUser = async () => {
      try {
        const token = await getTokenAsync();
        if (token && user) {
          const detailedUser = await fetchUserDetailAsync(token);
          if (detailedUser) {
            updateUser({
              id: detailedUser.id,
              fullName: detailedUser.fullName,
              email: detailedUser.email,
              emailConfirmed: detailedUser.emailConfirmed ?? false,
              phoneNumber: detailedUser.phoneNumber ?? '000-0000-0000',
              twoFactorEnabled: detailedUser.twoFactorEnabled ?? false,
              avata: detailedUser.avata ?? '',
            });
          }
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error);
        showSnackbar('사용자 정보를 갱신하지 못했습니다.');
      }
    };

    if (user) {
      refreshUser();
    }
  }, [user, updateUser, showSnackbar]); // user가 변경될 때마다 실행
  if (user === null) return null;

  const getAvataUrl = () => {
    if (user == null || user.avata == '') return '/images/no-avata.svg';
    return `${baseUrl}/images/${user?.id}_${user.avata.toLowerCase()}`;
  };

  const handleGetMyCodes = async () => {
    try {
      const response: ICode[] | null = await fetchUserCodesAsync(user.id);
      if (response != null) {
        setUserCodes(response);
      }
    } catch (e: any) {
      throw e;
    }
  }

  const handleChangeFullName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  }

  const handleFetchFullName = async () => {
    if (name.length < 2) {
      showSnackbar("필명은 2자 이상 작성하여 주세요.");
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/account/updateuser`;
    const data: IUpdateUserName = {
      email: user.email,
      newUserName: name
    }

    try {
      const token = await getTokenAsync();
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        showSnackbar("이름변경 실패");
        return;
      }

      const message = await response.json();
      showSnackbar(message.message);
      updateUser({ fullName: name }); // 상태 갱신
    } catch (error) {
      showSnackbar("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="text-center flex flex-col justify-baseline items-center gap-4">

      <Title title="나의정보" />

      <Card sx={{ minWidth: 400, width: 500, maxWidth: 700 }}>

        <CardMedia
          sx={{ height: 140 }}
          image="/images/lake.webp"
          title="green iguana"
        />

        <CardContent>
          <Avatar
            alt={user?.avata}
            src={getAvataUrl() ?? '/images/no-avata.svg'}
            sx={{ width: 56, height: 56, margin: 'auto' }}
          />

          <p className='text-xs mt-2 text-slate-600'>{user.fullName}</p>
          <TextField
            id="outlined-basic"
            label={`필명 (${user.fullName}) 수정`}
            color='warning'
            onChange={handleChangeFullName}
            sx={{ width: '100%', my: '1em', color: 'lightgoldenrodyellow' }}
            variant="filled" />
          <div className='my-4'>

            {/* 이미지 드레그앤드롭 */}
            <FileManager
              title='아바타 변경 (drag & drop)'
              choice={0} // 0. 아바타
            />
          </div>

          <Typography
            variant="h6"
            component="div"
            sx={{ color: 'text.secondary' }}>
            {user.email}
          </Typography>

          <Typography
            variant="body1"
            component="div"
            className="text-orange-500">
            {user.emailConfirmed ? '인증메일' : '미 인증메일'}
          </Typography>

          <Typography
            variant="body2"
            className="text-sky-700">
            {user.roles.join(', ')}
          </Typography>

        </CardContent>

        <Divider />

        <CardActions className="flex justify-evenly">

          <Button
            size="small"
            disabled={name.length < 2}
            onClick={handleFetchFullName}
            color="success">
            필명변경
          </Button>

          {!user.emailConfirmed && (
            <Button
              size="small"
              onClick={() => router.push('/membership/confirm-email')}
              color="secondary">
              메일인증
            </Button>
          )}

          <Button
            size="small"
            onClick={() => router.push('/membership/change-password')}
            color="secondary">
            비밀번호 변경
          </Button>

          <Button
            size="small"
            onClick={() => router.push('/membership/cancel-membership')}
            color="warning">
            회원탈퇴
          </Button>

          <Button
            size="small"
            onClick={() => handleGetMyCodes()}
            color="primary">
            나의코드
          </Button>

          {isAdmin && (
            <Button
              size="small"
              onClick={() => router.push('/membership/send-mail')}
              color="primary">
              메일전송
            </Button>
          )}


          <Button
            size="small"
            onClick={() => router.push('/code/create')}
            color="primary">
            코드작성
          </Button>
        </CardActions>

      </Card>

      <div className='w-full px-4 py-8'>
        {userCodes && (
          <VivGridControl data={userCodes} userId={user.id} />
        )}
      </div>

    </div >
  );
}
