// src/services/server-auth.ts
'use server';

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

export const getServerToken = async (): Promise<string | null> => {
    try {
        const cookieStore = await cookies(); // 비동기 호출
        const token = cookieStore.get('user')?.value;
        if (!token) return null;

        // 토큰 만료 여부 확인
        const decoded: any = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp < now) {
            return null;
        }
        return token;
    } catch (err) {
        console.error('Server: Failed to get token:', err);
        return null;
    }
};
