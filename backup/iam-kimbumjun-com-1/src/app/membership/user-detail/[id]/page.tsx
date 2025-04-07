'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { IUserDetailDTO } from '@/dtos/i-userdetail-dto';
import React from 'react';

export default function UserDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, loading: authLoading } = useAuth();
  const resolvedParams = React.use(params); // Promise 풀기
  const { id } = resolvedParams; // 풀린 객체에서 id 추출
  const [userDetail, setUserDetail] = useState<IUserDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !user.token) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }
    if (!id) {
      setError('사용자 ID가 필요합니다.');
      setLoading(false);
      return;
    }

    const fetchUserDetail = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/account/${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user.token}`, // 관리자 토큰
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          if (response.status === 401) throw new Error('인증 실패');
          if (response.status === 403)
            throw new Error('관리자 권한이 없습니다.');
          if (response.status === 404)
            throw new Error('사용자를 찾을 수 없습니다.');
          throw new Error('데이터 로드 실패');
        }
        const data: IUserDetailDTO = await response.json();
        setUserDetail(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [user, authLoading, id]);

  if (loading || authLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!userDetail) return <div>사용자 정보 없음</div>;

  return (
    <div>
      <h1>회원 상세 정보 (관리자용)</h1>
      <p>ID: {userDetail.id}</p>
      <p>이름: {userDetail.fullName}</p>
      <p>이메일: {userDetail.email}</p>
      <p>역할: {userDetail.roles.join(', ')}</p>
      <p>전화번호: {userDetail.phoneNumber || '-'}</p>
      <p>아바타: {userDetail.avata || '없음'}</p>
      <p>이메일 확인: {userDetail.emailConfirmed ? '예' : '아니오'}</p>
      <p>2단계 인증: {userDetail.twoFactorEnabled ? '활성화' : '비활성화'}</p>
      <p>전화번호 확인: {userDetail.phoneNumberConformed ? '예' : '아니오'}</p>
      <p>접속 실패 횟수: {userDetail.accessFailedCount}</p>
    </div>
  );
}
