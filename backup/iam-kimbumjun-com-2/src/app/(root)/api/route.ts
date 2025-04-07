export const dynamic = 'force-static'

//https://localhost:41086/api
export async function GET() {
    return Response.json({
        id: 1, name: "Hello, World"
    })
}
