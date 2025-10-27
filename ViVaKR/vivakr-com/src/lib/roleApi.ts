// src/lib/roleApi.ts
import { getTokenAsync, isAdminAsync } from '@/services/auth.service';
import { IResponseDTO } from '@/interfaces/i-response';

// 역할 추가
export async function assignRole(userId: string, roleId: string): Promise<IResponseDTO> {
    const token = await getTokenAsync();
    if (!token || !isAdminAsync()) throw new Error('권한이 없습니다.');
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/role/assign`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, roleId }),
    });
    const result: IResponseDTO = await response.json();
    if (!response.ok) throw new Error(result.responseMessage || '역할 할당 실패');
    return result;
}

// 역할 삭제
export async function removeRole(userId: string, roleId: string): Promise<IResponseDTO> {
    const token = await getTokenAsync();
    if (!token || !isAdminAsync()) throw new Error('권한이 없습니다.');
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/role/remove`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, roleId }),
    });
    const result: IResponseDTO = await response.json();
    if (!response.ok) throw new Error(result.responseMessage || '역할 제거 실패');
    return result;
}
