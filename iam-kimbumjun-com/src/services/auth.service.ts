// src/services/auth.service.ts
import { IAuthResponse } from "@/interfaces/i-auth-response";
import { IUser } from "@/interfaces/i-user";
import { apiFetch } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

const isClient = typeof window !== 'undefined';
const userToken = 'user';

export const getToken = (): string | null => {
  if (!isClient) return null;
  const user = localStorage.getItem(userToken);
  if (!user) return null;
  const userDetail: IAuthResponse = JSON.parse(user);
  return userDetail.token;
}

export function getTokenWithCookie() {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('user='))
    ?.split('=')[1];
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      document.cookie = 'user=; path=/; max-age=0'; // 만료된 토큰 삭제
      localStorage.removeItem('user');
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export const userDetail = () => {
  const token = getToken();
  if (!token) return null;
  const decoded: any = jwtDecode(token);
  const roles = Array.isArray(decoded.role) ? decoded.role : [decoded.role].filter(Boolean);
  const detail: IUserDetail = {
    id: decoded.nameid,
    fullName: decoded.name,
    email: decoded.email,
    roles: roles
  };
  return detail;
}

// 추가된 로직
export const isAdmin = (): boolean => {
  const detail = userDetail();
  return detail?.roles.includes('Admin') ?? false;
};

// 추가된 로직
export const fetchUserDetail = async (tkn: string) => {
  const token = getToken();
  if (!token) return null;
  try {
    const result = await apiFetch('/api/account/detail');
    const isIUser = (data: any): data is IUser => 'id' in data && 'fullName' in data;
    return isIUser(result) ? result : null;
  } catch (error) {
    console.error('Failed to fetch user detail:', error);
    return userDetail(); // API 실패 시 토큰 디코딩으로 fallback
  }
};
/*

useAuth와 통합:
AuthContext로 상태 관리하니 localStorage 직접 접근 줄이고 getToken으로 통일.
서버 데이터 우선:
fetchUserDetail로 API 호출 추가해 토큰 디코딩보다 신뢰성 높임.
타입 안전성:
roles 배열 처리로 JWT 변형 대응.

  private _isAdmin = new BehaviorSubject<boolean>(false);
  adminNext(state: boolean) {
    this._isAdmin.next(state);
  }
*/
