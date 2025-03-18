'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { IAuthContextProps } from '@/interfaces/i-auth-context-props';
import { IAuthResponse } from '@/interfaces/i-auth-response';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext<IAuthContextProps>({
  user: null,
  isAdmin: () => false,
  login: () => Promise.resolve(false),
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IAuthResponse | null>(null);
  const [loading, setIsLoading] = useState(true);

  //* 페이지 로드시 localStorage 에서 토큰 확인
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);

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

      const data = await response.json();
      if (data.isSuccess) {
        localStorage.setItem('user', JSON.stringify(data)); // 토큰 저장
        document.cookie = `user=${data.token}; path=/; max-age=${60 * 60 * 24}`;
        setUser(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  //* Sign Out
  const logout = () => {
    localStorage.removeItem('user');
    document.cookie = 'user=; path=/; max-age=0'; // 쿠키 삭제
    setUser(null); // 상태 즉시 갱신
  };

  // * Roles
  const token = user?.token;
  let roles: string[] = [];
  if (token) {
    const decoded: any = jwtDecode(token);
    roles = decoded.role;
  }

  const isAdmin = () => roles.includes('Admin') || false;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
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
