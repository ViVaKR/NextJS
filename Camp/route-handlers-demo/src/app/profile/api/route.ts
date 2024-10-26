import { type NextRequest } from 'next/server';
import {
    headers

} from 'next/headers';
export async function GET(request: NextRequest) {

    //--> 클라이언트 헤더 정보 가져오기 (Accempt, User-Agent, Authorization)
    const requestHeaders = new Headers(request.headers);

    const headerList = headers(); // 권장하는 방법

    const acceptHeader = requestHeaders.get('accept');
    const authorizationHeader = requestHeaders.get('authorization');
    const userAgentHeader = requestHeaders.get('user-agent');

    console.log('authorizationHeader => ', authorizationHeader);
    console.log((await headerList).get('authorization'));
    console.log('acceptHeader => ', acceptHeader);
    console.log('agent => ', userAgentHeader);
    return new Response('Profile API data');
}
