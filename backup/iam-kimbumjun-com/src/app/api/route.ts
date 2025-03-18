export const dynamic = 'force-static'

//http://localhost:3000/api
export async function GET() {
    return Response.json({
        id: 1, name: "Hello, World"
    })
}
