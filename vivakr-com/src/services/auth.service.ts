// src/services/auth.service.ts
import { jwtDecode } from "jwt-decode";
import { IAuthResponse } from "@/interfaces/i-auth-response";
import { IUserDetailDTO } from "@/interfaces/i-userdetail-dto";

const isClient = typeof window !== 'undefined';
const userToken = 'user';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const setAuthCookie = (token: string) => {
  document.cookie = `user=${token}; path=/; max-age=${60 * 60 * 24}`;
  // Set-Cookie: access-token=...; Path=/; HttpOnly; Secure; SameSite=None
};

export const removeAuthCookie = () => {
  document.cookie = 'user=; path=/; max-age=0';
}

// export const refreshTokenAsync = async (refreshTokenValue: string, email: string, retries = 1): Promise<string | null> => {
export const refreshTokenAsync = async (refreshTokenValue: string, email: string): Promise<string | null> => {

  if (!isClient) return null;
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = new Promise(async (resolve) => {
    try {
      const userData = localStorage.getItem(userToken);
      if (!userData) {
        localStorage.clear();
        removeAuthCookie();
        window.location.href = '/membership/sign-in';
      }

      const oldToken = userData ? JSON.parse(userData).token : '';
      if (oldToken == '') {
        localStorage.clear();
        removeAuthCookie();
        window.location.href = '/membership/sign-in';
      }
      const response = await fetch(`${apiUrl}/api/account/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: oldToken,
          refreshToken: refreshTokenValue,
          email,
        })
      });

      if (!response.ok) {
        localStorage.clear();
        removeAuthCookie();
        window.location.href = '/membership/sign-in';
      }
      const result: IAuthResponse = await response.json();
      if (result.isSuccess) {
        const newUserData = {
          token: result.token,
          refreshToken: result.refreshToken,
          isSuccess: true,
        };
        localStorage.setItem(userToken, JSON.stringify(newUserData));
        setAuthCookie(result.token!);
        resolve(result.token!);
      } else {
        localStorage.clear();
        removeAuthCookie();
        window.location.href = '/membership/sign-in';

      }
    } catch (err: any) {
      console.error('(auth.service catch 60) 토큰갱신 실패:', err);
      localStorage.clear();
      window.location.href = '/membership/sign-in';
      resolve(null);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  });

  return refreshPromise;
};

export const getTokenAsync = async (): Promise<string | null> => {

  if (!isClient) return null;

  try {
    const user = localStorage.getItem(userToken);
    if (!user) return null;
    const userDetail: IAuthResponse = JSON.parse(user);
    const token = userDetail.token;
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp < now) {
      const newToken = await refreshTokenAsync(userDetail.refreshToken!, decoded.email);

      if (newToken) return newToken;
      localStorage.removeItem(userToken);
      return null;
    }
    return token;
  } catch (err: any) {
    localStorage.removeItem(userToken);
    return null;
  }
}


export const userDetailAsync = async (): Promise<IUserDetailDTO | null> => {
  const token = await getTokenAsync();
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    const roles = Array.isArray(decoded.role) ? decoded.role : [decoded.role].filter(Boolean);

    const detail: IUserDetailDTO = {
      id: decoded.nameid,
      fullName: decoded.name,
      email: decoded.email,
      roles,
    };
    return detail;
  } catch (err) {
    return null;
  }
};

export const isAdminAsync = async (): Promise<boolean> => {
  const detail = await userDetailAsync();
  return detail?.roles.includes('Admin') ?? false;
};


// src/services/auth.service.ts
export const fetchUserDetailAsync = async (tkn: string): Promise<IUserDetailDTO | null> => {
  const token = await getTokenAsync();
  if (!token) {
    return null;
  }
  const maxRetries = 2;
  let retries = maxRetries;
  while (retries > 0) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/detail`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const result = await response.json();
      const isIUser = (data: any): data is IUserDetailDTO => 'id' in data && 'fullName' in data;
      if (isIUser(result)) {
        return result;
      }
      throw new Error('Invalid user data');
    } catch (err: any) {
      retries--;
      if (retries === 0) {
        return null;
      }
      // 1초 대기 후 재시도
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return null;
};
