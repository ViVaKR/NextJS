// src/app/(root)/api/subscribe/new/route.ts
export async function POST(req: Request) {
    try {
        const { email } = await req.json(); // 요청 본문 파싱
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subscribe/new`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ message: `서버 오류가 발생했습니다: ${e.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
