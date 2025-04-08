// src/lib/fetchRoles.ts
import { IResponse } from '@/interfaces/i-response';
import { IRole } from '@/interfaces/i-role';
import { getToken } from '@/services/auth.service';

export async function fetchRoles(signal?: AbortSignal): Promise<IRole[]> {
    const token = getToken();
    if (!token) {
        throw new Error('인증 토큰이 없습니다. 로그인 상태를 확인해주세요.');
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}/api/role/user-group-list`; // 'user-group-list' → 'list'로 수정
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store', // 캐시 방지
        signal, // 취소 가능
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`역할 데이터를 가져오지 못했습니다: ${response.status} - ${errorText}`);
    }
    const data: IRole[] = await response.json();
    return data;
}


export async function createRole(roleName: string): Promise<void> {
    const token = getToken();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/role/create`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ roleName }),
    });

    if (!response.ok) {
        throw new Error(`역할 생성 실패: ${response.status}`);
    }
}

export async function deleteRole(roleId: string) {
    const token = getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/role/delete/${roleId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) throw new Error('역할 삭제 실패');

    const result: IResponse = await response.json();
    return result;
}
