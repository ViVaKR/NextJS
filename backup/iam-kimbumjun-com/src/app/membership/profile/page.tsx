'use client';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Title from '@/components/Title';
import { useProfile } from './Profile';
import { Fragment } from 'react';
import { Avatar, Divider } from '@mui/material';

export default function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const { user } = useProfile();
  if (user === null) return null;
  const getAvataUrl = () => {
    if (user == null || user.avata == null) return null;
    return `${baseUrl}/images/${user?.id}_${user.avata.toLowerCase()}`;
  };

  return (
    <div className="text-center flex flex-col justify-baseline items-center gap-4">
      <Title title="나의정보" />
      <Card sx={{ maxWidth: 500 }}>
        <CardMedia
          sx={{ height: 140 }}
          image="/images/lake.webp"
          title="green iguana"
        />
        <CardContent>
          <Avatar
            alt={user?.avata}
            src={getAvataUrl() ?? '/images/login-icon.png'}
            sx={{ width: 56, height: 56, margin: 'auto' }}
          />
          <Typography
            gutterBottom
            variant="h5"
            sx={{ color: 'var(--color-slate-500)' }}
            component="div">
            {user.fullName}
          </Typography>

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
            {user.emailConfirmed ? '이메일 확인완료' : '미 인증'}
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
            color="success">
            필명변경
          </Button>
          <Button
            size="small"
            color="secondary">
            비밀번호 변경
          </Button>
          <Button
            size="small"
            color="warning">
            회원탈퇴
          </Button>
          <Button
            size="small"
            color="primary">
            코드작성
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
