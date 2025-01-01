import { type NextRequest } from 'next/server';
import {
    headers,
    cookies
} from 'next/headers';
export async function GET(request: NextRequest) {

    //--> 클라이언트 헤더 정보 가져오기 (Accempt, User-Agent, Authorization)
    const requestHeaders = new Headers(request.headers);

    const headerList = headers(); // 권장하는 방법

    (await cookies()).set('resultsPerPage', '20');

    const themeCookie = request.cookies.get('theme');

    const acceptHeader = requestHeaders.get('accept');
    const authorizationHeader = requestHeaders.get('authorization');
    const userAgentHeader = requestHeaders.get('user-agent');

    console.log('authorizationHeader => ', authorizationHeader);
    console.log((await headerList).get('authorization'));
    console.log('acceptHeader => ', acceptHeader);
    console.log('agent => ', userAgentHeader);

    console.log('themeCookie => ', themeCookie);

    console.log((await cookies()).get('resultsPerPage'));
    return new Response("<h1>API Data</h1>", {
        headers: {
            'Content-Type': 'text/html',
            "Set-Cookie": "theme=dark;"
        }
    });
}
