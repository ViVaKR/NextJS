// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 허용할 Origin 목록을 정의
// 개발 환경에서는 localhost 모든 포트를 포함할 수 있도록 정규표현식 사용
// 운영 환경에서는 실제 도메인만 명시 (예: 'https://vivakr.com', 'https://kimbumjun.com')
const ALLOWED_ORIGINS = [
    'https://vivakr.com',
    'https://kimbumjun.com',
    'https://vivabm.com',
    'http://localhost:29845'
    // 여기에 더 많은 실제 운영 도메인들을 추가
];

export function middleware(request: NextRequest) {

    console.log('--> Start Middleware')
    const response = NextResponse.next();
    const origin = request.headers.get('origin'); // 요청의 Origin 가져오기

    // CORS 헤더 설정 로직
    // 1. 요청 Origin이 ALLOWED_ORIGINS에 명시적으로 포함되어 있는지 확인
    // 2. 개발 환경에서 localhost의 어떤 포트라도 허용할 경우 (정규표현식 사용)
    //    주의: 운영 환경에서는 이 localhost 허용 로직을 제거하거나 특정 포트만 허용해야 합니다.

    let allowOrigin = '';
    if (origin) {
        if (ALLOWED_ORIGINS.includes(origin)) {

            console.log('first');
            allowOrigin = origin;
        } else if (process.env.NODE_ENV === 'development' && /^http:\/\/localhost:\d+$/.test(origin)) {
            console.log('second');
            // 개발 환경일 때만 localhost의 모든 포트를 허용
            allowOrigin = origin;
        }

        else if (/^http:\/\/localhost:\d+$/.test(origin)) {
            console.log('third');
            // localhost의 모든 포트를 허용
            allowOrigin = origin;
        }
    }

    // 허용된 Origin이 있을 경우에만 Access-Control-Allow-Origin 헤더 설정
    if (allowOrigin) {
        response.headers.set('Access-Control-Allow-Origin', allowOrigin);
    } else {
        // 허용되지 않은 Origin에 대한 처리 (선택 사항)
        // 보안상 문제가 없다면 특정 기본 Origin을 설정하거나 (ex: 'http://localhost:3000'),
        // 아니면 이 헤더를 설정하지 않아 브라우저가 요청을 차단하게 둘 수 있습니다.
        // 여기서는 기본적으로 비워둠 (Next.js 기본 동작으로 CORS 실패)
    }

    // 기타 CORS 관련 헤더 설정 (메소드, 헤더, 자격 증명)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true'); // 쿠키 등을 포함한 요청을 허용할 경우

    // OPTIONS 요청 처리 (Preflight Request)
    if (request.method === 'OPTIONS') {
        return response; // Preflight 요청에 대한 성공적인 응답
    }

    return response;
}

// 미들웨어를 적용할 경로 설정
// 이 설정은 미들웨어가 어떤 요청 경로에 대해 실행될지를 결정합니다.
// 예를 들어, API Routes에만 적용하고 싶다면 '/api/:path*' 로 설정할 수 있습니다.
export const config = {
    // 모든 경로에 적용하려면 '/' 또는 ['/((?!_next/static|_next/image|favicon.ico).*)']
    // API Routes에만 적용하려면 '/api/:path*'
    // matcher: '/api/:path*',
    matcher: '/'
};
