import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const demoData: Prisma.DemoCreateInput[] = [
    { name: 'Kim Bum Jun' },
    { name: '장길산' },
    { name: '임꺽정' },
    { name: '황초롱' },
    { name: '김가온' },
    { name: '송나린' },
    { name: '마다솜' },
    { name: '박라온' },
    { name: '홍보라' },
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
