export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params // 'a', 'b', or 'c'
    return Response.json(slug);
}
