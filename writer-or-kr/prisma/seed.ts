// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const demo1 = await prisma.memo.create({
        data: {
            title: 'Hello, World',
        },
    });

    console.log('Database seeded successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
