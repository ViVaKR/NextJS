// src/services/auth.service.ts
import { jwtDecode } from "jwt-decode";
import { IAuthResponse } from "@/interfaces/i-auth-response";
import { IUser } from "@/interfaces/i-user";
import { apiFetch } from "@/lib/api";
import { IUserDetailDTO } from "@/interfaces/i-userdetail-dto";

const isClient = typeof window !== 'undefined';

const userToken = 'user';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const refreshTokenAsync = async (refreshTokenValue: string, email: string, retries = 1): Promise<string | null> => {
  if (!isClient) return null;

  // 이미 refresh 중이면 기존 Promise 반환
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = new Promise(async (resolve) => {
    try {
      const userData = localStorage.getItem(userToken);
      const oldToken = userData ? JSON.parse(userData).token : '';

      const response = await fetch(`${apiUrl}/api/account/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: oldToken,
          refreshToken: refreshTokenValue,
          email,
        }),
      });
      const result: IAuthResponse = await response.json();

      if (response.ok && result.isSuccess) {
        const newUserData = {
          token: result.token,
          refreshToken: result.refreshToken,
          isSuccess: true,
        };
        localStorage.setItem(userToken, JSON.stringify(newUserData));
        resolve(result.token!);
      } else if (retries > 0) {
        // 재시도
        const retryResult = await refreshTokenAsync(refreshTokenValue, email, retries - 1);
        resolve(retryResult);
      } else {
        // localStorage.removeItem(userToken);
        window.location.href = '/membership/sign-in'; // 실패 시 재로그인 유도
        resolve(null);
      }
    } catch (err) {
      console.error('RefreshToken error:', err);
      // localStorage.removeItem(userToken);
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

    // 토큰 만료 여부 확인
    const decoded: any = jwtDecode(token);

    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp < now) {
      const newToken = await refreshTokenAsync(userDetail.refreshToken!, decoded.email);

      if (newToken) return newToken;
      // localStorage.removeItem(userToken);
      return null;
    }
    return token;
  } catch (err: any) {
    // localStorage.removeItem(userToken);
    return null;
  }
}


export const userDetailAsync = async (): Promise<IUserDetail | null> => {
  const token = await getTokenAsync();
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    const roles = Array.isArray(decoded.role) ? decoded.role : [decoded.role].filter(Boolean);

    const detail: IUserDetail = {
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
