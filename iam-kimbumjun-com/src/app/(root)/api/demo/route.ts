// src/app/api/demo/route.ts (App Router 사용 시)
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST() {
    const demo = await prisma.demo.create({
        data: {
            name: 'Jang Gil San',
        },
    });
    return NextResponse.json(demo, { status: 200 });
}

export async function GET() {
    const demos = await prisma.demo.findMany();
    return NextResponse.json(demos, { status: 200 });
}
