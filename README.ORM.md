# ORM

## Prisma

[document](https://grok.com/share/bGVnYWN5_23f8cce1-ae5b-462e-92a2-207d2e30624f)

```bash
npm install prisma --save-dev
npm install tsx --save-dev
npm install @prisma/extension-accelerate
npm install @prisma/client

npx prisma init
npm install class-validator class-transformer

npx prisma migrate dev --name init
npx prisma migrate resolve --applied init
pnpx prisma db push

# after seed
npx prisma db seed
npx prisma studio

#
docker exec -it viv-postgres psql -U postgres
docker exec -it viv-postgres psql -U bj -d bj
docker exec -it viv-postgres psql -U bj -d bj -c "\dt"

```

## Create DB, User

```bash
CREATE USER text WITH PASSWORD '비밀번호';
CREATE DATABASE text OWNER text;
GRANT ALL PRIVILEGES ON DATABASE text TO text;

# option
ALTER ROLE bj WITH CREATEDB;

docker exec -it viv-postgres psql -U postgres -d bj
GRANT SELECT, INSERT, UPDATE, DELETE ON _prisma_migrations TO bj;
\du
\dt
\d demo
\dp demo
\l

# pnpm dev
# Test
curl +X POST http://localhost:3000/api/demo
curl http://localhost:3000/api/demo
```

`! → %21`
`# → %23`
`* → %2A`
`! → %21`
`& → %26`

```sql

-- 연결된 세션 종료
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'bj' AND pid <> pg_backend_pid();

-- 데이터베이스 삭제
DROP DATABASE bj;

-- 데이터베이스 재생성
CREATE DATABASE bj;

-- bj 사용자 확인 및 권한 설정 (필요 시)
CREATE USER bj WITH PASSWORD 'B9037!m8947#' IF NOT EXISTS;
GRANT CONNECT ON DATABASE bj TO bj;
GRANT USAGE ON SCHEMA public TO bj;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bj;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bj;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bj;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO bj;

```

## package.json

```json
{
  "prisma": {
    "schema": "src/app/prisma/schema.prisma"
  }
}
```

## 오류수정

```bash
# 캐시 및 모듈 삭제
rm -rf node_modules pnpm-lock.yaml .next

# 패키지 재설치
pnpm install

# Prisma 클라이언트 생성
npx prisma generate

# 개발 서버 실행
pnpm dev


````

/*
- 설명:
    - jwt 콜백: Google 로그인 시 받은 user 데이터를 ExtendedUser로 변환.
    - session 콜백: JWT의 데이터를 세션에 반영.
    - 이렇게 하면 useSession()으로 가져오는 session.user가 ExtendedUser 타입을 따름.
*/


/*
// 재사용 가능하게 수정
export const authOptions = {
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
                    message: `${account?.provider} Login Success!`,
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
            return `${baseUrl}`; // 홈으로 리다이렉트
        },
    },
};

// 추가
// const handler = NextAuth(authOptions)
 */
