// src/lib/fetchCodes.ts
import { CodeData } from '@/types/code-form-data';
import { ICode } from '@/interfaces/i-code';
import { ICodeResponse } from '@/interfaces/i-code-response';
import { getTokenAsync } from '@/services/auth.service';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// * All Code Data List
export async function fetchCodesAsync(): Promise<ICode[]> {
    try {
        const url = `${apiUrl}/api/code/all`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-cache'
        });
        if (!response.ok) {
            throw new Error(`데이터 목록 가져오기 실패: ${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        throw error;
    }
}

// Delete
export async function fetchUserCodesAsync(userId: string): Promise<ICode[] | null> {

    const token = await getTokenAsync();
    if (!token) return null;

    try {
        const url = `${apiUrl}/api/code/user/${userId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-cache'

        });

        if (!response.ok) {
            throw new Error(`Failed to fetch codes: ${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        throw error;
    }
}

export async function fetchLimitedCodes(limit: number): Promise<ICode[]> {

    try {
        const url = `${apiUrl}/api/code/take?limit=${limit}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`데이터 청크 로드 실패: ${response.status}`)
        }
        return response.json();
    } catch (error) {
        throw error;
    }

}

// * Post Code Data
export const postCodesAsync = async (data: CodeData): Promise<ICodeResponse | null> => {

    const token = await getTokenAsync();
    if (!token) {
        throw new Error('로그인이 필요합니다.');
    }

    try {
        const response = await fetch(`${apiUrl}/api/code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-cache',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '코드 작성에 실패했습니다.');
        }

        const result: ICodeResponse = await response.json();
        return result as ICodeResponse;
    } catch (err) {
        console.error('Submit failed:', err);
        return {
            isSuccess: false,
            message: `Submission failed: ${err}`,
            data: null
        }
    }
}


// * PUT Code Data
export async function updateCodeAsync(id: number, data: CodeData): Promise<ICodeResponse
    | null
    | undefined> {
    const token = await getTokenAsync();
    if (!token) {
        return null;
    }
    try {
        const response = await fetch(`${apiUrl}/api/code/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // 토큰 추가 (API가 필요 시)
            },
            cache: 'no-cache',
            body: JSON.stringify(data),
        });
        const result: ICodeResponse = await response.json();

        if (response.ok) {
            return result;
        } else {
            const notOk: ICodeResponse = {
                isSuccess: false,
                message: `(fetchCodes) 코드 업데이트에 실패: ${result.message}`,
                data: null
            }
            return notOk;
        }
    } catch (err: any) {
        const response: ICodeResponse = {
            isSuccess: false,
            message: `(fetchCodes) 서버오류: ${err}`,
            data: null
        }
        return response;
    }
}

// Delete
export const deleteCodeAsync = async (id: number): Promise<ICodeResponse> => {
    const token = await getTokenAsync();
    if (!token) {
        throw new Error('로그인이 필요합니다.');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/code/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '코드 삭제에 실패했습니다.');
    }

    const result = await response.json();
    return result as ICodeResponse;
};



export async function fetchCodeById(id: number): Promise<ICode | null> {
    const codes = await fetchCodesAsync();
    return codes.find((c) => c.id === id) || null;
}


