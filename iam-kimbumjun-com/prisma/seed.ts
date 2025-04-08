import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const demoData: Prisma.DemoCreateInput[] = [
    { name: 'Kim Bum Jun' },
    { name: '장길산' },
    { name: '임꺽정' },
]

export async function main() {
    for (const demo of demoData) {
        await prisma.demo.create({ data: demo })
    }
}

main();

/*

--> pnpx prisma db seed
--> pnpx prisma studio
*/
