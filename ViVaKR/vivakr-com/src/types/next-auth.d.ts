// src/types/next-auth.d.ts
import { JWT as DefaultJWT } from 'next-auth/jwt';
import { Session as DefaultSession } from 'next-auth';

declare module "next-auth" {
    interface Session {
        user: ExtendedUser; // 기본 { name, email, image } 대신 ExtendedUser로 확장
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: ExtendedUser; // JWT에도 동일하게 확장
    }
}
