// src/lib/fetchCodes.ts
import { CodeData } from '@/types/code-form-data';
import { ICode } from '@/interfaces/i-code';
import { ICodeResponse } from '@/interfaces/i-code-response';
import { getToken } from '@/services/auth.service';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// * All Code Data List
export async function fetchCodes(): Promise<ICode[]> {
    try {
        const url = `${apiUrl}/api/code`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            next: { revalidate: 60 }, // 60초마다 재검증, cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch codes: ${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// * Post Code Data
export async function postCodes(data: CodeData): Promise<ICodeResponse
    | null
    | undefined> {
    const token = getToken();
    if (!token) {
        return null;
    }
    try {
        const response = await fetch(`${apiUrl}/api/code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // 토큰 추가 (API가 필요 시)
            },
            body: JSON.stringify(data),
        });
        const result: ICodeResponse = await response.json();
        if (response.ok) {
            return result;
        } else {
            const notOk: ICodeResponse = {
                isSuccess: false,
                message: `Response Not OK: ${result.message}`,
                data: null
            }
            return notOk;
        }
    } catch (err) {
        console.error('Submit failed:', err);
    }
}

export async function fetchCodeById(id: number): Promise<ICode | null> {
    const codes = await fetchCodes();
    return codes.find((c) => c.id === id) || null;
}
