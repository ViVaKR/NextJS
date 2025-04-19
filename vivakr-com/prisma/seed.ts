import { PrismaClient, Prisma } from "@/app/generated/prisma/client";

const prisma = new PrismaClient();

const demoData: Prisma.CodeCreateInput[] = [
    { title: 'Hello, World' },
    { title: 'Fine Thanks And You?' },
];

async function main() {
    try {
        console.log('Starting seed...');
        for (const demo of demoData) {
            const result = await prisma.code.create({
                data: demo
            });
            console.log(`Created Code with id: ${result.id}, title: ${result.title}`);
        }
        console.log('Seed completed successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        console.log('Prisma client disconnected.');
    }
}

main();
/*

--> pnpx prisma db seed
--> pnpx prisma studio


*/
