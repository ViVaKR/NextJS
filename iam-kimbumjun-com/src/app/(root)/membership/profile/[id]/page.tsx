'use client';
import FileManager from '@/components/file-manager/FileManager';
import { IUserDetailDTO } from '@/interfaces/i-userdetail-dto';
import { useParams, useSearchParams } from 'next/navigation';

export default function UserProfile() {
  const params = useParams(); // 동적 경로 파라미터 (id)
  const searchParams = useSearchParams(); // 쿼리 파라미터
  const id = params?.id as string; // id 추출
  const userQuery = searchParams?.get('user'); // 쿼리에서 user 문자열 가져오기
  const user: IUserDetailDTO | null = userQuery
    ? JSON.parse(decodeURIComponent(userQuery))
    : null;

  return (
    <div>
      <h1>UserProfile</h1>
      <p>ID: {id}</p>
      {user ? (
        <div>
          <p>이름: {user.fullName}</p>
          <p>이메일: {user.email}</p>
          <p>역할: {user.roles.join(', ')}</p>
          <p>전화번호: {user.phoneNumber || '-'}</p>
          <p>아바타: {user.avata || '없음'}</p>

        </div>
      ) : (
        <p>사용자 데이터 없음</p>
      )}
    </div>
  );
}
