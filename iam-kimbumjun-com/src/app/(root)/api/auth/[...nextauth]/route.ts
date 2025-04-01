// * src/app/(root)/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { ExtendedUser } from "@/interfaces/i-extended-user";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            // 최초 로그인 시 user 객체를 token에 매핑
            if (user) {
                token.user = {
                    id: user.id || "NoId", // Google은 id 제공 안 하니까 빈 값 가능
                    fullName: user.name || "Guest",
                    email: user.email || "NoMail",
                    emailConfirmed: true, // Google은 기본 확인된 이메일
                    roles: ["User"], // 기본 역할 부여
                    phoneNumber: "000-0000-0000",
                    twoFactorEnabled: false,
                    token: "", // Google 토큰은 여기 안 넣음
                    refreshToken: "",
                    isSuccess: true,
                    message: "Google Login Success",
                    phoneNumberConformed: false,
                    accessFailedCount: 0,
                    avata: user.image || "/images/login-icon.png",
                } as ExtendedUser;
            }
            return token;
        },
        async session({ session, token }) {
            // 세션에 JWT의 user 객체를 반영
            session.user = token.user as ExtendedUser;
            return session;
        },

        async redirect({ url, baseUrl }) {
            return `${baseUrl}`;
        },
    },
});

export { handler as GET, handler as POST };

/*
- 설명:
    - jwt 콜백: Google 로그인 시 받은 user 데이터를 ExtendedUser로 변환.
    - session 콜백: JWT의 데이터를 세션에 반영.
    - 이렇게 하면 useSession()으로 가져오는 session.user가 ExtendedUser 타입을 따름.
*/
