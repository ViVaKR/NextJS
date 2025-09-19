// 클라이언트 프로젝트의 `app/api/external/route.ts` 파일

import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // 내부적으로 외부 API를 호출 (이때는 서버 to 서버 통신이라 CORS 문제가 발생하지 않음)
        const response = await fetch('http://localhost:8081');

        if (!response.ok) {
            // 외부 API 응답이 실패하면 클라이언트에게도 실패를 알림
            return new NextResponse(JSON.stringify({ error: `External API error: ${response.status}` }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const data = await response.json();
        return NextResponse.json(data); // 외부 API의 응답을 클라이언트로 그대로 전달
    } catch (error) {
        console.error('Error fetching external API:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch external data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
