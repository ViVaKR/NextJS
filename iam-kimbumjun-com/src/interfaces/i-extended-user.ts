import { IUserDetailDTO } from "@/dtos/i-userdetail-dto";
import { IAuthResponse } from "./i-auth-response";

// 확장된 User 타입 정의
export interface ExtendedUser extends IAuthResponse, IUserDetailDTO { }
