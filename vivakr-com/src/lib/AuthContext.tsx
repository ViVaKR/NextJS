// src/lib/AuthContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { IAuthContextProps } from '@/interfaces/i-auth-context-props';
import { IAuthResponse } from '@/interfaces/i-auth-response';
import { jwtDecode } from 'jwt-decode';
import { IUserDetailDTO } from '@/interfaces/i-userdetail-dto';
import { ExtendedUser } from '@/interfaces/i-extended-user';
import { signOut, useSession } from 'next-auth/react';
import { fetchUserDetailAsync, getTokenAsync, removeAuthCookie, setAuthCookie } from '@/services/auth.service';

const getRolesFromToken = (token: string | undefined): string[] => {

  if (!token) return [];

  try {

    const decoded: any = jwtDecode(token);

    const roles = decoded.role || decoded.roles;

    if (Array.isArray(roles)) {
      return roles;
    } else if (typeof roles === 'string') {
      return [roles];
    }
    return [];
  } catch (err: any) {
    console.error("역할을 가져오는데 실패하였습니다.:", err);
    return [];
  }
};

const AuthContext = createContext<IAuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<ExtendedUser | null>(null);

  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  const fetchUserDetail = useCallback(async (token: string): Promise<IUserDetailDTO | null> => {
    try {
      const headers = {
        Authorization: `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/account/detail`,
        {
          method: 'GET',
          headers,
          cache: 'no-cache'
        },

      );

      if (!response.ok) return null;

      const detailedUser = await response.json();
      return detailedUser as IUserDetailDTO;

    } catch (err: any) {
      return null;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const token = await getTokenAsync();

        if (token) {
          const detailedUser = await fetchUserDetailAsync(token);
          if (detailedUser) {
            const userData = localStorage.getItem('user');
            if (userData) {
              const parsedUser: ExtendedUser = JSON.parse(userData);
              setUser({
                ...parsedUser,
                id: detailedUser.id,
                fullName: detailedUser.fullName,
                email: detailedUser.email,
                emailConfirmed: detailedUser.emailConfirmed ?? false,
                phoneNumber: detailedUser.phoneNumber ?? '000-0000-0000',
                twoFactorEnabled: detailedUser.twoFactorEnabled ?? false,
                avata: detailedUser.avata ?? '',
              });
            }
          } else {
            setUser(null);
            localStorage.removeItem('user');
          }
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }

        if (status === "authenticated" && session?.user) {
          const sessionUser = session.user as ExtendedUser;
          setUser({ ...sessionUser });

        } else if (status === "unauthenticated") {
          const storedUserString = localStorage.getItem('user');

          if (storedUserString) {
            let parsedUser: ExtendedUser | null = null;
            try {
              parsedUser = JSON.parse(storedUserString);
            } catch (err: any) {
              throw new Error(`(111) ${err.message}`)
            }

            if (parsedUser?.token) {
              const detailedUser = await fetchUserDetail(parsedUser.token);
              if (detailedUser) {

                const roles = getRolesFromToken(parsedUser.token);
                setUser({ ...parsedUser, ...detailedUser, roles });
              } else {
                setUser(null);
                localStorage.removeItem('user');
              }
            } else {
              setUser(null);
              localStorage.removeItem('user');
            }
          } else {
            // TODO
          }
        }
      } catch (err: any) {
        console.error('(134) AuthContext: Initialize error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, [fetchUserDetail, session, session?.user, status]); // logout 의존성 제거

  // 자체 로그인 함수
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
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

      if (!response.ok) {
        if (response.status === 401) throw new Error('인증 실패 (잘못된 이메일/비밀번호)');
        if (response.status === 403) throw new Error('계정 잠김 또는 비활성화');
        throw new Error('로그인에 실패하였습니다.');
      }

      if (data.isSuccess && data.token) {
        const detailedUser = await fetchUserDetail(data.token);
        if (!detailedUser) {
          setUser(null); // 혹시 모르니 초기화
          setLoading(false);
          return false;
        }
        const roles = getRolesFromToken(data.token);

        const updatedUser: ExtendedUser = {
          // 상세 정보 우선 사용, 필요한 경우 data의 정보 추가
          id: detailedUser.id,
          fullName: detailedUser.fullName,
          email: detailedUser.email,
          emailConfirmed: detailedUser.emailConfirmed ?? false,
          roles: roles, // 추출된 역할 저장
          phoneNumber: detailedUser.phoneNumber,
          twoFactorEnabled: detailedUser.twoFactorEnabled ?? false,
          token: data.token, // 받은 토큰 저장
          refreshToken: data.refreshToken!, // 리프레시 토큰 저장
          isSuccess: data.isSuccess,
          message: data.message || '',
          phoneNumberConformed: detailedUser.phoneNumberConformed || false,
          accessFailedCount: detailedUser.accessFailedCount || 0,
          avata: detailedUser.avata || '',
          provider: 'credentials',
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        setAuthCookie(data.token)
        setUser(updatedUser);
        setLoading(false);
        return true;

      } else {
        setUser(null);
        setLoading(false);
        return false;
      }
    } catch (err: any) {
      console.error('(AuthContext 205) 로그인 중 오류 발생:', err);
      setUser(null);
      setLoading(false);
      return false;
    }
  }, [fetchUserDetail]); // fetchUserDetail 의존성 추가

  // * 로그아웃 함수
  const logout = useCallback(async () => {

    // 순서 중요: 상태 업데이트 전에 로컬/세션 정리
    localStorage.removeItem('user');
    localStorage.clear();

    // 쿠키삭제
    removeAuthCookie();
    setUser(null);

    // 현재 도메인으로 리다이렉션, 비동기 signOut 호출
    const url = `${window.location.protocol}\/\/${window.location.hostname}`;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : url;
    await signOut({ redirect: false }); // 서버 리다이렉션 방지
    window.location.href = baseUrl;

    // next-auth 로그아웃 (Google 등) + 커스텀 로그아웃 후 리다이렉션
    // signOut({ callbackUrl: "/" });

  }, []);

  // * 사용자 목록 가져오기 (관리자용)
  const fetchUsers = useCallback(async () => {
    const currentToken: string | null = await getTokenAsync();
    if (!currentToken)
      return [];
    const roles: string[] | undefined = getRolesFromToken(currentToken!)
    if (!roles) return [];
    const isAdmin = roles.some((role) => role.toLowerCase() === 'admin');
    if (!isAdmin) return [];

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/account/list`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-cache'
        }
      );

      if (!response.ok) {
        if (response.status === 401) throw new Error('(249) 인증 실패 (토큰 만료 등)');
        if (response.status === 403) throw new Error('(250) 관리자 권한 필요');
        throw new Error('(251) 회원 목록을 가져오는데 실패하였습니다.');
      }
      return await response.json();
    } catch (err: any) {
      throw new Error(`(AuthContext 268) catch error: ${err}`)
    }
  }, []);

  const isAdmin = useMemo((): boolean => {
    return !!user?.roles?.includes('Admin');
  }, [user]);

  // * 사용자 정보 업데이트 함수
  const updateUser = useCallback((updates: Partial<ExtendedUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  // * 주기적 토큰 체크 (25분마다)
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = await getTokenAsync();
      if (!token) {
        window.location.href = '/membership/sign-in';
      }
    }, 59 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const contextValue = useMemo(() => ({
    user,
    login,
    logout,
    loading,
    isAdmin,
    fetchUsers,
    updateUser
  }), [user, login, logout, loading, isAdmin, fetchUsers, updateUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): IAuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error('컨텍스트를 찾을 수 없습니다. AuthProvider로 감싸주세요.');
  return context;
};
