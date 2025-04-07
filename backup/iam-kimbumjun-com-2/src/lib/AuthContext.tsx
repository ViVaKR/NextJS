// src/lib/AuthContext.tsx

'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { IAuthContextProps } from '@/interfaces/i-auth-context-props';
import { IAuthResponse } from '@/interfaces/i-auth-response';
import { jwtDecode } from 'jwt-decode';
import { IUserDetailDTO } from '@/interfaces/i-userdetail-dto';
import { ExtendedUser } from '@/interfaces/i-extended-user'; // 인터페이스 재사용
import { signOut, useSession } from 'next-auth/react';

const AuthContext = createContext<IAuthContextProps>({
  user: null,
  isAdmin: () => false,
  login: () => Promise.resolve(false),
  logout: () => { },
  fetchUsers: () => Promise.resolve([]),
  loading: true,
  updateUser: () => { }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setIsLoading] = useState(true);
  const { data: session, status } = useSession(); // next-auth 세션 가져오기

  //* next-auth 세션과 동기화
  useEffect(() => {

    if (status === "authenticated" && session?.user) {
      // Google 로그인 시 세션만 사용
      const sessionUser = session.user as ExtendedUser;
      setUser(sessionUser);
      localStorage.setItem('user', JSON.stringify(sessionUser));
      setIsLoading(false);
    } else if (status === "unauthenticated") {

      // * 인증되지 않은 경우에만 자체 자체 로그인 확인
      const storedUser = localStorage.getItem('user');

      if (storedUser) {

        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);

        // 토큰이 유효한지 확인 후 상세 정보 가져오기
        fetchUserDetail(parsedUser.token).then((detailedUser) => {
          if (detailedUser) {
            setUser({ ...parsedUser, ...detailedUser });
          }
          else {
            setUser(null); // 유효하지 않으면 초기화
            localStorage.removeItem('user');
          }
        });
      }
    }
    setIsLoading(false);
  }, [status, session]);

  const fetchUserDetail = async (token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/account/detail`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch user details');
      const detailedUser = await response.json();
      return detailedUser as IUserDetailDTO;
    } catch (err) {
      console.error('Error fetching user detail:', err);
      return null;
    }
  };

  //* 로그인
  const login = async (email: string, password: string) => {
    try {

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/account/signin`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      const data: IAuthResponse = await response.json();

      if (data.isSuccess) {
        const detailedUser = await fetchUserDetail(data.token!);

        if (!detailedUser) return false;

        const updatedUser: ExtendedUser = {
          id: detailedUser.id,
          fullName: detailedUser.fullName,
          email: detailedUser.email,
          emailConfirmed: detailedUser.emailConfirmed,
          roles: detailedUser.roles,
          phoneNumber: detailedUser.phoneNumber,
          twoFactorEnabled: detailedUser.twoFactorEnabled,
          token: data.token!,
          refreshToken: data.refreshToken!,
          isSuccess: data.isSuccess,
          message: data.message || '',
          phoneNumberConformed: detailedUser.phoneNumberConformed || false,
          accessFailedCount: detailedUser.accessFailedCount || 0,
          avata: detailedUser.avata || '',
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        document.cookie = `user=${data.token}; path=/; max-age=${60 * 60 * 24}`;
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('로그인 실패:', error);
      return false;
    }
  };

  //* Sign Out
  const logout = () => {
    localStorage.removeItem('user');
    document.cookie = 'user=; path=/; max-age=0'; // 쿠키 삭제
    setUser(null); // 상태 즉시 갱신
    signOut({ callbackUrl: "/" }); // next-auth 로그아웃도 함께 호출
  };

  const fetchUsers = async () => {
    if (!user?.token || !isAdmin()) {
      return [];
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/account/list`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.token}`, // 최신 토큰 사용
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) throw new Error('인증실패');
        if (response.status === 403) throw new Error('관리자 권한 필요');
        throw new Error('회원목록을 가져오는데 실패하였습니다.');
      }
      return await response.json();
    } catch (error) {
      throw error; // 호출하는 쪽에서 처리 가능하도록 throw
    }
  };

  let roles: string[] = [];
  if (user?.token) {
    const decoded: any = jwtDecode(user.token);
    roles = decoded.role;
  }

  const isAdmin = (): boolean => {

    if (!user?.token) return false;

    const decoded: any = jwtDecode(user.token);
    const roles: string[] = decoded.role || [];
    return roles.includes('Admin');
  };

  const updateUser = (updates: Partial<ExtendedUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser)); // * 로컬 스토리지 동기화
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, fetchUsers, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// --> export point
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
