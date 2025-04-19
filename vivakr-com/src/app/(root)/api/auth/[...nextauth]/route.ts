// * src/app/(root)/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { ExtendedUser } from "@/interfaces/i-extended-user";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import DiscordProvider from "next-auth/providers/discord";
import AzureADProvider from "next-auth/providers/azure-ad";
// import AppleProvider from "next-auth/providers/apple";

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
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID!,
            clientSecret: process.env.TWITTER_CLIENT_SECRET!,
            version: "2.0", // OAuth 2.0 사용
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        }),
        AzureADProvider({
            clientId: process.env.MICROSOFT_CLIENT_ID!,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
            tenantId: "common", // 모든 계정 허용
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, account }) {
            // 최초 로그인 시 user 객체를 token에 매핑
            if (account && user) {
                token.user = {
                    id: user.id || account?.providerAccountId || "NoId",
                    fullName: user.name || "Guest",
                    email: user.email || "NoMail",
                    emailConfirmed: !!user.email,
                    roles: ["User"],
                    phoneNumber: "123-4567-8901",
                    twoFactorEnabled: false,
                    token: account?.id_token ?? "",
                    refreshToken: account?.refresh_token ?? "",
                    isSuccess: true,
                    message: `${account?.provider} Login Success!`,
                    phoneNumberConformed: false,
                    accessFailedCount: 0,
                    avata: user.image || "/images/login-icon.png",
                    provider: account?.provider
                } as ExtendedUser;
            }
            return token;
        },
        async session({ session, token }) {
            // 세션에 JWT의 user 객체를 반영
            if (token.user)
                session.user = token.user as ExtendedUser;
            return session;
        },

        async redirect({ url, baseUrl }) {
            return `${baseUrl}`; // 홈으로 리다이렉트
        },
    },
    // pages: { // 자체 로그인 페이지가 있다면 설정
    //   signIn: '/auth/signin',
    // }
});

export { handler as GET, handler as POST };
