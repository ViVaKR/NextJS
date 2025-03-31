// src/types/next-auth.d.ts
import { JWT as DefaultJWT } from 'next-auth/jwt';
import { Session as DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            fullName: string;
            roles: string[];
            token: string;
            refreshToken: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id: string;
        email: string;
        fullName: string;
        roles: string[];
        accessToken: string;
        refreshToken: string;
    }
}
