'use client';
import { apiFetch } from '@/lib/api';
import { useEffect, useState } from 'react';
import { IUser } from '@/interfaces/i-user';
import { useAuth } from '@/lib/AuthContext';

export function useProfile() {
  const [user, setUser] = useState<IUser | null>(null);
  // const { user, setUser } = useAuth(); // useAuth에서 user 가져오기
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem('user') || '{}');
    const isAuthenticated = !!userFromStorage?.token;

    if (!isAuthenticated) {
      setIsLoading(false); // 인증 없으면 로딩 종료
      return;
    }
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const result = await apiFetch('/api/account/detail', {});
        const isIUser = (data: any): data is IUser =>
          'id' in data && 'fullName' in data;

        if (isIUser(result)) {
          setUser(result as IUser);
          setError(null);
        } else {
          throw new Error('Invalid user data');
        }
      } catch (error) {
        setError('Failed to load profile. Please try again.');
        console.error('Error fetching user info:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, []); // // 빈 의존성 배열로 최초 마운트 시만 실행

  return { user, isLoading, error };
}

// 참조용 코드 ..

/*
--> Role 체크 ..
useEffect(() => {
    const fetchUserInfo = async () => {
        try {
            setIsLoading(true);
            const result = await apiFetch('/api/account/detail', {});
            const user = result as IUser;
            if (!user.roles.includes('User')) {
                setError('Access denied.');
                return;
            }
            setUser(user);
            setError(null);
        } catch (error: any) {
            setError('Failed to load profile.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchUserInfo();
}, []);

*/

// const response = await fetch(
//   `${process.env.NEXT_PUBLIC_API_URL}/api/account/list`,
//   {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${user.token}`,
//       'Content-Type': 'application/json',
//     },
//   }
// );

/*
token
isSuccesss
message
refreshToken


  //* Get User Details
  getDetail = (): Observable<IUserDetail> => {
    return this.http.get<IUserDetail>(`${this.baseUrl}/api/account/detail`, {
      context: new HttpContext().set(SkipLoading, true)
    });
  }

*/
