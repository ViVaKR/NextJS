// src/lib/fetchCodes.ts
import { ICode } from '@/interfaces/i-code';

export async function fetchCodes(): Promise<ICode[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    try {
        const url = `${baseUrl}/api/code`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            next: { revalidate: 60 }, // 60초마다 재검증
            // cache: 'no-store'
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
