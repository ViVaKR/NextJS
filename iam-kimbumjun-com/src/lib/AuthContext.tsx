'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { IAuthContextProps } from '@/interfaces/i-auth-context-props';
import { IAuthResponse } from '@/interfaces/i-auth-response';
import { jwtDecode } from 'jwt-decode';
import { IUserDetailDTO } from '@/dtos/i-userdetail-dto';
import type { NextApiRequest, NextApiResponse } from 'next'

// 확장된 User 타입 정의
interface ExtendedUser extends IAuthResponse, IUserDetailDTO { }

const AuthContext = createContext<IAuthContextProps>({
  user: null,
  isAdmin: () => false,
  login: () => Promise.resolve(false),
  logout: () => { },
  fetchUsers: () => Promise.resolve([]),
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setIsLoading] = useState(true);
  //* 페이지 로드시 localStorage 에서 토큰 확인
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // 토큰이 유효한지 확인 후 상세 정보 가져오기
      fetchUserDetail(parsedUser.token).then((detailedUser) => {
        if (detailedUser) setUser({ ...parsedUser, ...detailedUser });
      });
    }
    setIsLoading(false);
  }, []);

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

  //* Sign In
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
        const detailedUser = await fetchUserDetail(data.token);

        if (!detailedUser) {
          return false;
        }

        const updatedUser: ExtendedUser = {
          id: detailedUser.id,
          fullName: detailedUser.fullName,
          email: detailedUser.email,
          emailConfirmed: detailedUser.emailConfirmed,
          roles: detailedUser.roles,
          phoneNumber: detailedUser.phoneNumber,
          twoFactorEnabled: detailedUser.twoFactorEnabled,
          token: data.token,
          refreshToken: data.refreshToken,
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
      console.error('Login failed:', error);
      return false;
    }
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

  //* Sign Out
  const logout = () => {
    localStorage.removeItem('user');
    document.cookie = 'user=; path=/; max-age=0'; // 쿠키 삭제
    setUser(null); // 상태 즉시 갱신
  };

  let roles: string[] = [];
  if (user?.token) {
    const decoded: any = jwtDecode(user.token);
    roles = decoded.role;
  }

  const isAdmin = () => {
    if (!user?.token) return false;
    const decoded: any = jwtDecode(user.token);
    const roles: string[] = decoded.role || [];
    return roles.includes('Admin');
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAdmin, fetchUsers }}>
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
