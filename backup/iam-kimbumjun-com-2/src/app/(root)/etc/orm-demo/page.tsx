import prisma from '@/lib/prisma'
import VivTitle from '@/components/VivTitle';

export default async function DemoDataPage() {

    const demos = await prisma.demo.findMany();

    return (
        <div className='flex flex-col justify-baseline items-center'>
            <VivTitle title='Demo Data ORM(prisma)' />
            <div className="min-h-screen bg-gray-50">
                <ol className="list-decimal list-inside font-noto]">
                    {demos.map((user) => (
                        <li key={user.id} className="mb-2">
                            {user.name}
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
