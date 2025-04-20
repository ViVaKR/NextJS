// src/services/auth.service.ts
import { jwtDecode } from "jwt-decode";
import { IAuthResponse } from "@/interfaces/i-auth-response";
import { IUser } from "@/interfaces/i-user";
import { apiFetch } from "@/lib/api";

const isClient = typeof window !== 'undefined';

const userToken = 'user';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getToken = async (): Promise<string | null> => {

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
      const newToken = await refreshToken(userDetail.refreshToken!, decoded.email);

      if (newToken) return newToken;
      localStorage.removeItem(userToken);
      return null;
    }
    return token;
  } catch (err: any) {
    console.error('Client: Failed to get token:', err);
    localStorage.removeItem(userToken);
    return null;
  }
}



// src/services/auth.service.ts
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const refreshToken = async (refreshTokenValue: string, email: string, retries = 1): Promise<string | null> => {
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
      console.log('RefreshToken request:', { token: oldToken, refreshToken: refreshTokenValue, email });

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
      console.log('RefreshToken response:', result);

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
        const retryResult = await refreshToken(refreshTokenValue, email, retries - 1);
        resolve(retryResult);
      } else {
        localStorage.removeItem(userToken);
        window.location.href = '/membership/sign-in'; // 실패 시 재로그인 유도
        resolve(null);
      }
    } catch (err) {
      console.error('RefreshToken error:', err);
      localStorage.removeItem(userToken);
      window.location.href = '/membership/sign-in';
      resolve(null);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  });

  return refreshPromise;
};

export const userDetail = async (): Promise<IUserDetail | null> => {
  const token = await getToken();
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
    console.error('Failed to decode token:', err);
    return null;
  }
};

export const isAdmin = async (): Promise<boolean> => {
  const detail = await userDetail();
  return detail?.roles.includes('Admin') ?? false;
};

export const fetchUserDetail = async (token?: string): Promise<IUserDetail | null> => {
  const authToken = token || await getToken();
  if (!authToken) return null;

  try {
    const result = await apiFetch('/api/account/detail', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const isIUser = (data: any): data is IUser => 'id' in data && 'fullName' in data;
    return isIUser(result) ? result : null;
  } catch (error) {
    console.error('Failed to fetch user detail:', error);
    return userDetail(); // API 실패 시 토큰 디코딩으로 폴백
  }
};
