import { IAuthResponse } from "@/interfaces/i-auth-response";
import { IUser } from "@/interfaces/i-user";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { jwtDecode } from "jwt-decode";

const userToken = 'user';

const getToken = (): string | null => {
  const user = localStorage.getItem(userToken);
  if (!user) return null;
  const userDetail: IAuthResponse = JSON.parse(user);
  return userDetail.token;
}

// * get token
// export const SavedToken = (): string | null | undefined => {
//   const { user } = useAuth();
//   return user?.token;
// }

// export const getUserDetail = () => {
//   const token = getToken();

//   if (!token) return null;

//   const decoded: any = jwtDecode(token);

//   const userDetail: IUserDetail = {
//     id: decoded.nameid,
//     fullName: decoded.name,
//     email: decoded.email,
//     roles: decoded.role
//   };
//   return userDetail;
// }

export const userDetail = () => {

  const token = getToken();
  // const token = SavedToken();
  if (!token) return null;
  const decoded: any = jwtDecode(token);
  const roles = Array.isArray(decoded.role) ? decoded.role : [decoded.role].filter(Boolean);
  const userDetail: IUserDetail = {
    id: decoded.nameid,
    fullName: decoded.name,
    email: decoded.email,
    roles: roles
    // roles: decoded.role
  };
  return userDetail;
}

// 추가된 로직
export const isAdmin = () => {
  const detail = userDetail();
  return detail?.roles.includes('Admin') ?? false;
};

// 추가된 로직
export const fetchUserDetail = async () => {
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
