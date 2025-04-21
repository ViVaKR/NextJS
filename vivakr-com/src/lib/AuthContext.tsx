// src/lib/AuthContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { IAuthContextProps } from '@/interfaces/i-auth-context-props';
import { IAuthResponse } from '@/interfaces/i-auth-response';
import { jwtDecode } from 'jwt-decode';
import { IUserDetailDTO } from '@/interfaces/i-userdetail-dto';
import { ExtendedUser } from '@/interfaces/i-extended-user';
import { signOut, useSession } from 'next-auth/react';
import { fetchUserDetailAsync, getTokenAsync } from '@/services/auth.service';

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
        }
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
                emailConfirmed: detailedUser.emailConfirmed,
                phoneNumber: detailedUser.phoneNumber,
                twoFactorEnabled: detailedUser.twoFactorEnabled,
                avata: detailedUser.avata,
              });
            }
          } else {
            setUser(null); // UI상 로그아웃 상태지만 localStorage는 유지
          }
        } else {
          setUser(null);
        }
        // *
        if (status === "authenticated" && session?.user) {
          //? NextAuth
          const sessionUser = session.user as ExtendedUser;
          setUser({ ...sessionUser });

        } else if (status === "unauthenticated") {
          const storedUserString = localStorage.getItem('user');
          if (storedUserString) {
            let parsedUser: ExtendedUser | null = null;
            try {
              parsedUser = JSON.parse(storedUserString);
            } catch (err: any) {
              throw err;
            }

            if (parsedUser?.token) {
              // 토큰 유효성 검사 겸 상세 정보 가져오기
              const detailedUser = await fetchUserDetail(parsedUser.token);
              if (detailedUser) {
                // 성공: 상세 정보와 기존 정보 결합 (역할 정보 포함)
                const roles = getRolesFromToken(parsedUser.token); // 토큰에서 역할 추출
                setUser({ ...parsedUser, ...detailedUser, roles }); // user 상태 업데이트
              } else {
                // setUser(null);
                // localStorage.removeItem('user');
              }
            } else {
              // setUser(null);
              // localStorage.removeItem('user');
            }
          }
        } else {
          //...
        }

        // *
      } catch (err) {
        console.error('AuthContext: Initialize error:', err);
        // setUser(null); // 오류 시 UI만 초기화
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, [fetchUserDetail, session?.user, status]); // logout 의존성 제거

  // 자체 로그인 함수
  const login
    = useCallback(async (email: string, password: string): Promise<boolean> => {
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
            emailConfirmed: detailedUser.emailConfirmed,
            roles: roles, // 추출된 역할 저장
            phoneNumber: detailedUser.phoneNumber,
            twoFactorEnabled: detailedUser.twoFactorEnabled,
            token: data.token, // 받은 토큰 저장
            refreshToken: data.refreshToken!, // 리프레시 토큰 저장
            isSuccess: data.isSuccess,
            message: data.message || '',
            phoneNumberConformed: detailedUser.phoneNumberConformed || false,
            accessFailedCount: detailedUser.accessFailedCount || 0,
            avata: detailedUser.avata || '',
            provider: 'credentials',
          };

          localStorage.setItem('user', JSON.stringify(updatedUser)); // 로컬 스토리지에 저장
          document.cookie = `user=${data.token}; path=/; max-age=${60 * 60 * 24}`; // 쿠키 저장 제거 (특별한 이유 없으면)
          setUser(updatedUser); // 상태 업데이트 -> UI 즉시 반영!
          setLoading(false);
          return true;

        } else {
          setUser(null);
          setLoading(false);
          return false;
        }
      } catch (error) {
        console.error('로그인 중 오류 발생:', error);
        setUser(null);
        setLoading(false);
        return false;
      }
    }, [fetchUserDetail]); // fetchUserDetail 의존성 추가

  // 로그아웃 함수
  const logout = useCallback(() => {

    // 순서 중요: 상태 업데이트 전에 로컬/세션 정리
    localStorage.removeItem('user');
    // 쿠키 삭제 제거
    document.cookie = 'user=; path=/; max-age=0';
    setUser(null);

    // next-auth 로그아웃 (Google 등) + 커스텀 로그아웃 후 리다이렉션
    signOut({ callbackUrl: "/" });
  }, []);

  // 사용자 목록 가져오기 (관리자용)
  const fetchUsers = useCallback(async () => {
    if (!user?.token || !user.roles?.some((role) => role.toLowerCase() !== 'admin')) return [];

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/account/list`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-cache'
        }
      );

      if (!response.ok) {
        if (response.status === 401) throw new Error('인증 실패 (토큰 만료 등)');
        if (response.status === 403) throw new Error('관리자 권한 필요');
        throw new Error('회원 목록을 가져오는데 실패하였습니다.');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }, [user]); // user 상태에 의존

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
    }, 25 * 60 * 1000);
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
