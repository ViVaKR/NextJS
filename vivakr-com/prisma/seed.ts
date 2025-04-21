import { PrismaClient, Prisma } from "@/app/generated/prisma/client";

const prisma = new PrismaClient();

const demoData: Prisma.CodeCreateInput[] = [
    { title: 'Hello, World' },
    { title: 'Fine Thanks And You?' },
];

async function main() {
    try {
        for (const demo of demoData) {
            const result = await prisma.code.create({
                data: demo
            });
        }
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
/*

--> pnpx prisma db seed
--> pnpx prisma studio


*/
