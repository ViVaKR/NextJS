// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate'


// PrismaClient 를 전역으로 재사용
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma
    || new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;


/*
--> Using
import prisma from '@/lib/prisma';

// 예: 사용자 조회
const users = await prisma.user.findMany();

// Run
rm -rf .next
pnpm install
pnpm prisma generate
pnpm build
*/
