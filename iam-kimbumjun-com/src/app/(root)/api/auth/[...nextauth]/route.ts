// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                // ASP.NET Core API로 로그인 요청
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/account/signin`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    }
                );

                const data = await response.json();

                if (data.isSuccess && data.token) {
                    // 사용자 상세 정보 가져오기
                    const detailedUserResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/account/detail`,
                        {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${data.token}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    if (!detailedUserResponse.ok) {
                        throw new Error('Failed to fetch user details');
                    }

                    const detailedUser = await detailedUserResponse.json();

                    // 세션에 저장할 사용자 객체
                    return {
                        id: detailedUser.id,
                        email: detailedUser.email,
                        fullName: detailedUser.fullName,
                        roles: detailedUser.roles,
                        token: data.token,
                        refreshToken: data.refreshToken,
                    };
                }

                throw new Error('Invalid credentials');
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any, user: any }) {
            // 최초 로그인 시 사용자 정보를 토큰에 저장
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.fullName = user.fullName;
                token.roles = user.roles;
                token.accessToken = user.token;
                token.refreshToken = user.refreshToken;
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            // 세션에 토큰 정보 반영
            session.user = {
                id: token.id as string,
                email: token.email as string,
                fullName: token.fullName as string,
                roles: token.roles as string[],
                token: token.accessToken as string,
                refreshToken: token.refreshToken as string,
            };
            return session;
        },
    },
    pages: {
        signIn: '/login', // 커스텀 로그인 페이지 (필요 시)
    },
    secret: process.env.NEXTAUTH_SECRET, // .env에 추가 필요
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
