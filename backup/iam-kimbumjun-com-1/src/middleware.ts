import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(request: NextRequest) {
    const userToken = request.cookies.get('user')?.value;
    const protectedPaths = ['/membership/profile', '/membership/all-account', '/membership/code-category'];
    const adminPaths = ['/membership/all-account', '/membership/code-category'];
    const pathname = request.nextUrl.pathname;

    console.log('pathname:', pathname);
    console.log('userToken:', userToken);

    if (protectedPaths.some((path) => pathname.startsWith(path))) {
        if (!userToken) {
            const signInUrl = new URL('/membership/sign-in', request.url);
            signInUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(signInUrl);
        }

        let decoded: any;
        try {
            decoded = jwtDecode(userToken);
            console.log('Decoded token:', decoded);
        } catch (error) {
            console.error('Token decoding failed:', error);
            const signInUrl = new URL('/membership/sign-in', request.url);
            return NextResponse.redirect(signInUrl);
        }

        if (adminPaths.some((path) => pathname.startsWith(path))) {
            const roles = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
            console.log('Roles:', roles);
            if (!roles.includes('Admin')) {
                return NextResponse.redirect(new URL('/membership/unauthorized', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/membership/((?!sign-in).*)', '/dashboard/:path*'],
};
