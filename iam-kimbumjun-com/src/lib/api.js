
async function refreshToken() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: user.email,
            token: user.token,
            refreshToken: user.refreshToken,
        }),
    });
    return response.json();
}

export async function apiFetch(url, options = {}) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {}),
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        if (response.status === 401) {
            try {
                const refreshResponse = await refreshToken();
                if (refreshResponse.isSuccess) {
                    localStorage.setItem('user', JSON.stringify(refreshResponse));
                    return apiFetch(url, options); // 재시도
                }
                throw new Error('Unauthorized - Refresh failed');
            } catch (error) {
                throw error; // 상위로 에러 전달
            }
        }
        throw new Error(`API error: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
}

export const fetcher = (...args) => fetch(...args).then(res => res.json);

/*
설명: apiFetch는 모든 API 호출에 토큰을 추가하고, 401 에러 발생 시 리프레시 토큰으로 새 토큰을 요청합니다. 이는 Angular의 인터셉터와 유사한 역할을 합니다.
*/

/*
--> API 요청 유틸리티 (토큰 삽입)
Angular의 token.interceptor.ts를 대체하기 위해, 공통 API 호출 함수에 토큰을 자동으로 추가합니다.
*/
