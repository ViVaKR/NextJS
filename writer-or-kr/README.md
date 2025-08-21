This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash


npm install prisma --save-dev

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev


# 1. Prisma CLI를 개발용으로 설치 (-D 플래그)
pnpm add prisma -D

# 2. Prisma Client를 일반 의존성으로 설치
pnpm add @prisma/client

# 3. Prisma 프로젝트 초기화
pnpm dlx prisma init

# 보안 처리
pnpm approve-builds

# 마이그레이션
pnpm dlx prisma migrate dev --name init

```
