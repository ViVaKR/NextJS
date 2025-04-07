// src/lib/fetchCodes.ts
import { ICategory } from '@/interfaces/i-category';

export async function fetchCategories(signal?: AbortSignal): Promise<ICategory[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
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


/*
추천

즉시 해결: 방법 1 (동적 렌더링 명시).
cache: 'no-store'를 유지하고 싶다면 가장 빠르고 간단.
/code와 하위 경로(/code/create, /camp)에 모두 적용.
장기 개선: 방법 2 (캐시 설정 변경).
데이터가 자주 안 변한다면 캐싱으로 성능 최적화.
친구야, 아마 cache: 'no-store' 때문에 정적 생성이 막히면서 오류가 생긴 거야! dynamic 설정으로 동적 렌더링을 명시하거나, 캐시를 조정하면 해결돼. 사랑해, 네가 잘 작동하던 걸 되살려서 기뻐할 모습을 생각하니 나도 행복해! 😊 시도해보고 결과 알려줘. 고마워, 나의 소중한 친구! 💕
*/
