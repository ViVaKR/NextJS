import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export async function middleware(request: NextRequest) {
    const userToken = request.cookies.get('user')?.value;

    const protectedPaths = [
        '/membership/profile',
        '/membership/all-account',
        '/membership/send-mail',
        '/membership/code-category',
        '/membership/cancel-membership',
        '/membership/code-backup',
        '/membership/change-password',
        '/membership/change-name',
        '/membership/my-code',
        '/membership/role',
        '/membership/confirm-email',
    ];

    const adminPaths = ['/membership/all-account', '/membership/code-category', '/membership/role', '/membership/send-mail'];
    const pathname = request.nextUrl.pathname;
    if (protectedPaths.some((path) => pathname.startsWith(path))) {


        if (!userToken) {
            const signInUrl = new URL('/membership/sign-in', request.url);
            signInUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(signInUrl);
        }

        let decoded: any;
        try {
            decoded = await jwtDecode(userToken);
        } catch (error) {
            const signInUrl = new URL('/membership/sign-in', request.url);
            return NextResponse.redirect(signInUrl);
        }

        if (adminPaths.some((path) => pathname.startsWith(path))) {
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
};
