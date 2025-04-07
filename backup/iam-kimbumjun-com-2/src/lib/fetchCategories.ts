// src/lib/fetchCodes.ts
import { ICategory } from '@/interfaces/i-category';

export async function fetchCategories(signal?: AbortSignal): Promise<ICategory[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = `${baseUrl}/api/category/list`;
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        signal
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }

    return response.json();
}
