import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {

    if (req.method === 'POST') {
        const user = await prisma.user.create({
            data: { id: 1, name: 'CSharp' },
        });
        res.status(200).json(user);
    } else {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    }
}
// ls -R /Users/vivakr/WebProjects/KR-OR-TEXT/NEXTJS/iam-kimbumjun-com
// curl -X POST http://localhost:3000/api/user
// curl http://localhost:3000/api/user

/*
# 관리자
psql -U postgres
CREATE DATABASE client1_db;
CREATE USER client1 WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE client1_db TO client1;
GRANT ALL PRIVILEGES ON SCHEMA public TO client1;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO client1;

echo "DATABASE_URL=\"postgresql://postgres:admin_password@localhost:5432/client1_db?schema=public\"" > .env
npx prisma migrate dev --name init

# 클라이언트
echo "DATABASE_URL=\"postgresql://client1:secure_password@localhost:5432/client1_db?schema=public\"" > .env
npx prisma db push

*/
