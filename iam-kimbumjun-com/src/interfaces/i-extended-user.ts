import { IUserDetailDTO } from "@/dtos/i-userdetail-dto";
import { IAuthResponse } from "./i-auth-response";

export // 확장된 User 타입 정의
    interface ExtendedUser extends IAuthResponse, IUserDetailDTO { }
