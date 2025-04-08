import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(request: NextRequest) {

    console.log(`[Middleware] Path requested: ${request.nextUrl.pathname}`); // 경로 로깅

    const userToken = request.cookies.get('user')?.value;

    const protectedPaths = [
        '/membership/profile',
        '/membership/all-account',
        '/membership/code-category',
        '/membership/cancel-membership',
        '/membership/code-backup',
        '/membership/change-password',
        '/membership/change-name',
        '/membership/my-code',
        '/membership/role',
    ];

    const adminPaths = ['/membership/all-account', '/membership/code-category', '/membership/role'];

    const pathname = request.nextUrl.pathname;

    if (protectedPaths.some((path) => pathname.startsWith(path))) {

        console.log('[Middleware] Path is protected.');

        if (!userToken) {

            console.log('[Middleware] No token found. Redirecting to sign-in.'); // 로깅

            const signInUrl = new URL('/membership/sign-in', request.url);
            signInUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(signInUrl);
        }

        let decoded: any;
        try {
            decoded = jwtDecode(userToken);
            console.log('[Middleware] Decoded JWT Payload:', JSON.stringify(decoded)); // 디코딩된 전체 페이로드 로깅

        } catch (error) {
            const signInUrl = new URL('/membership/sign-in', request.url);
            return NextResponse.redirect(signInUrl);
        }

        if (adminPaths.some((path) => pathname.startsWith(path))) {

            console.log('[Middleware] Path requires Admin role.');

            const roles = Array.isArray(decoded.role) ? decoded.role : [decoded.role];

            if (!roles.includes('Admin')) {
                return NextResponse.redirect(new URL('/membership/unauthorized', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/membership/((?!sign-in).*)'],
    // matcher: ['/membership/((?!sign-in).*)', '/dashboard/:path*'],
};
