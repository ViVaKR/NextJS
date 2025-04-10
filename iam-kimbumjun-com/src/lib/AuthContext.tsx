// src/lib/AuthContext.tsx
// src/lib/AuthContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { IAuthContextProps } from '@/interfaces/i-auth-context-props';
import { IAuthResponse } from '@/interfaces/i-auth-response';
import { jwtDecode } from 'jwt-decode'; // 'jwt-decode' named import 방식 권장
import { IUserDetailDTO } from '@/interfaces/i-userdetail-dto';
import { ExtendedUser } from '@/interfaces/i-extended-user';
import { signOut, useSession } from 'next-auth/react';

// Helper function to decode token and extract roles safely
const getRolesFromToken = (token: string | undefined): string[] => {
  if (!token) return [];
  try {
    const decoded: any = jwtDecode(token);
    // 'role' 클레임이 배열일 수도 있고 단일 문자열일 수도 있음을 고려
    const roles = decoded.role || decoded.roles; // 일반적인 클레임 이름 사용
    if (Array.isArray(roles)) {
      return roles;
    } else if (typeof roles === 'string') {
      // 쉼표로 구분된 문자열 등 특정 형식이라면 파싱 필요
      // 예: return roles.split(',').map(r => r.trim());
      return [roles]; // 단일 역할 문자열인 경우 배열로 변환
    }
    return [];
  } catch (error) {
    console.error("Failed to decode token:", error);
    return [];
  }
};

const AuthContext = createContext<IAuthContextProps | undefined>(undefined); // 기본값 undefined 권장
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true); // 초기 로딩 상태는 true
  const { data: session, status } = useSession(); // next-auth 세션

  // 사용자 상세 정보 가져오기 (토큰 기반)
  const fetchUserDetail = useCallback(async (token: string): Promise<IUserDetailDTO | null> => {
    // 기존 로직과 동일, 에러 처리 강화 가능
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
      if (!response.ok) {
        // 401 Unauthorized 등 특정 상태 코드 처리 가능
        if (response.status === 401) {
          console.warn("Token validation failed (401)");
          return null; // 유효하지 않은 토큰으로 간주
        }
        throw new Error(`Failed to fetch user details (${response.status})`);
      }
      const detailedUser = await response.json();
      return detailedUser as IUserDetailDTO;
    } catch (err) {
      console.error('Error fetching user detail:', err);
      return null;
    }
  }, []); // 의존성 없음

  // 초기 인증 상태 확인 로직
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true); // 명시적으로 로딩 시작
      try {
        if (status === "authenticated" && session?.user) {
          // --- NextAuth 세션이 있는 경우 ---
          const sessionUser = session.user as ExtendedUser; // 타입 단언 주의
          // NextAuth 세션에 역할 정보가 포함되어 있는지 확인 필요
          // 만약 session.user에 roles가 없다면, 별도 API 호출 또는 토큰 필요 시 처리
          // 여기서는 session.user가 필요한 정보를 다 가졌다고 가정
          // 필요하다면 session에서 access token을 가져와 decode할 수도 있음
          // const roles = getRolesFromToken(session.accessToken); // 예시 (accessToken 이름은 다를 수 있음)
          setUser({
            ...sessionUser,
            // roles: roles, // 역할 정보 추가 (필요시)
            // token: session.accessToken // 커스텀 토큰 저장 필요 시
          });
          // localStorage.setItem('user', JSON.stringify(sessionUser)); // NextAuth가 관리하므로 중복 저장 제거 권장
        } else if (status === "unauthenticated") {
          // --- NextAuth 세션이 없고, 자체 로그인을 확인하는 경우 ---
          const storedUserString = localStorage.getItem('user');
          if (storedUserString) {
            let parsedUser: ExtendedUser | null = null;
            try {
              parsedUser = JSON.parse(storedUserString);
            } catch (e) {
              console.error("Failed to parse stored user:", e);
              localStorage.removeItem('user'); // 파싱 실패 시 삭제
            }

            if (parsedUser?.token) {
              // 토큰 유효성 검사 겸 상세 정보 가져오기
              const detailedUser = await fetchUserDetail(parsedUser.token);
              if (detailedUser) {
                // 성공: 상세 정보와 기존 정보 결합 (역할 정보 포함)
                const roles = getRolesFromToken(parsedUser.token); // 토큰에서 역할 추출
                setUser({ ...parsedUser, ...detailedUser, roles }); // user 상태 업데이트
              } else {
                // 실패: 토큰 만료/무효 -> 로그아웃 처리
                setUser(null);
                localStorage.removeItem('user');
              }
            } else {
              // 저장된 정보는 있으나 토큰이 없는 경우 (비정상)
              setUser(null);
              localStorage.removeItem('user');
            }
          } else {
            // 저장된 사용자 정보 없음
            setUser(null);
          }
        }
        // status === "loading" 인 경우는 아무것도 안하고 로딩 상태 유지
      } catch (error) {
        console.error("Error during auth initialization:", error);
        setUser(null); // 오류 발생 시 로그아웃 상태로
        localStorage.removeItem('user'); // 안전하게 로컬 스토리지 클리어
      } finally {
        // authenticated, unauthenticated 처리 완료 시 또는 loading이 아닐 때 로딩 종료
        if (status !== "loading") {
          setLoading(false);
        }
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, fetchUserDetail]); // session 객체 자체는 변경될 수 있으므로 포함

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

      if (data.isSuccess && data.token) {
        const detailedUser = await fetchUserDetail(data.token);
        if (!detailedUser) {
          // 상세 정보 조회 실패 시 로그인 실패 처리
          console.error("Login successful but failed to fetch user details.");
          setUser(null); // 혹시 모르니 초기화
          setLoading(false);
          return false;
        }

        const roles = getRolesFromToken(data.token); // 로그인 성공 시 토큰에서 역할 추출

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
          // isGoogle: false // 자체 로그인임을 명시 (선택적)
        };

        localStorage.setItem('user', JSON.stringify(updatedUser)); // 로컬 스토리지에 저장
        document.cookie = `user=${data.token}; path=/; max-age=${60 * 60 * 24}`; // 쿠키 저장 제거 (특별한 이유 없으면)
        setUser(updatedUser); // 상태 업데이트 -> UI 즉시 반영!
        setLoading(false);
        return true;
      } else {
        console.error("Login failed:", data.message || 'Unknown reason');
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
    document.cookie = 'user=; path=/; max-age=0'; // 쿠키 삭제 제거
    setUser(null); // 상태 즉시 갱신
    signOut({ callbackUrl: "/" }); // next-auth 로그아웃 (Google 등) + 커스텀 로그아웃 후 리다이렉션
  }, []);

  // 사용자 목록 가져오기 (관리자용)
  const fetchUsers = useCallback(async () => {
    // isAdmin() 대신 user 상태의 roles 직접 확인
    if (!user?.token || !user.roles?.includes('Admin')) {
      console.warn("Fetch users denied. User not admin or no token.");
      return []; // 또는 에러 throw new Error('Unauthorized');
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/account/list`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        // 에러 처리 개선
        const errorData = await response.text(); // 에러 메시지 확인 시도
        console.error(`Failed to fetch users (${response.status}): ${errorData}`);
        if (response.status === 401) throw new Error('인증 실패 (토큰 만료 등)');
        if (response.status === 403) throw new Error('관리자 권한 필요');
        throw new Error('회원 목록을 가져오는데 실패하였습니다.');
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching user list:", error);
      throw error; // 호출한 쪽에서 처리하도록 다시 throw
    }
  }, [user]); // user 상태에 의존

  // 관리자 여부 확인 (상태 기반으로 변경)
  const isAdmin = useMemo((): boolean => {
    return !!user?.roles?.includes('Admin'); // user 상태의 roles 확인
  }, [user]); // user 상태가 변경될 때만 재계산

  // 사용자 정보 업데이트 함수
  const updateUser = useCallback((updates: Partial<ExtendedUser>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updates };
      // 업데이트 시 역할 정보가 변경될 수 있다면 여기서 roles 재설정 필요
      // 예: if (updates.roles) updatedUser.roles = updates.roles;
      localStorage.setItem('user', JSON.stringify(updatedUser)); // 로컬 스토리지 동기화
      return updatedUser;
    });
  }, []); // 의존성 없음

  // Context 값 구성 (useMemo로 감싸서 불필요한 리렌더링 방지)
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

// 커스텀 훅 (useContext 사용)
export const useAuth = (): IAuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) { // 기본값을 undefined로 했으므로 undefined 체크
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
/*
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { IAuthContextProps } from '@/interfaces/i-auth-context-props';
import { IAuthResponse } from '@/interfaces/i-auth-response';
import { jwtDecode } from 'jwt-decode';
import { IUserDetailDTO } from '@/interfaces/i-userdetail-dto';
import { ExtendedUser } from '@/interfaces/i-extended-user'; // 인터페이스 재사용
import { signOut, useSession } from 'next-auth/react';


// Helper function to decode token and extract roles safely
const getRolesFromToken = (token: string | undefined): string[] => {
  if (!token) return [];
  try {
    const decoded: any = jwtDecode(token);
    // 'role' 클레임이 배열일 수도 있고 단일 문자열일 수도 있음을 고려
    const roles = decoded.role || decoded.roles; // 일반적인 클레임 이름 사용
    if (Array.isArray(roles)) {
      return roles;
    } else if (typeof roles === 'string') {
      // 쉼표로 구분된 문자열 등 특정 형식이라면 파싱 필요
      // 예: return roles.split(',').map(r => r.trim());
      return [roles]; // 단일 역할 문자열인 경우 배열로 변환
    }
    return [];
  } catch (error) {
    console.error("Failed to decode token:", error);
    return [];
  }
};

const AuthContext = createContext<IAuthContextProps | undefined>(undefined); // 기본값 undefined 권장
// const AuthContext = createContext<IAuthContextProps>({
//   user: null,
//   isAdmin: () => false,
//   login: () => Promise.resolve(false),
//   logout: () => { },
//   fetchUsers: () => Promise.resolve([]),
//   loading: true,
//   updateUser: () => { }
// });

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
 */
