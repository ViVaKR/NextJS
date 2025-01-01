import { comments } from "./data";
import { type NextRequest } from "next/server";

// export async function GET() {
//     return Response.json(comments);
// }

// GET All or Filtered
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams; //new URL(request.url).searchParams;
    const query = searchParams.get('query');
    const filteredComments = query
        ? comments.filter((comment) => comment.text.includes(query))
        : comments;
    return Response.json(filteredComments);
}

// POST
export async function POST(request: Request) {
    const comment = await request.json();
    const newComment = {
        id: comments.length + 1,
        text: comment.text,
    }
    comments.push(newComment);

    // return new Response(JSON.stringify(newComment), {
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     status: 201
    // })
    return Response.json(newComment, { status: 201 });
}

/*
// HTTP 응답 상태 코드를 나타내며, 각각의 의미는 다음과 같습니다:

// 201 Created: 요청이 성공적으로 처리되었으며, 새로운 리소스가 생성되었음을 나타냅니다. 주로 POST 요청에 사용됩니다.
// 200 OK: 요청이 성공적으로 처리되었음을 나타냅니다. 주로 GET 요청에 사용되며, 리소스가 성공적으로 반환되었음을 의미합니다.

// 따라서, 새로운 리소스를 생성하는 요청(예: 새로운 댓글을 추가하는 POST 요청)에는 status: 201을 사용하는 것이 적절합니다.
// 반면, 단순히 데이터를 반환하는 요청(예: 기존 댓글을 가져오는 GET 요청)에는 status: 200을 사용하는 것이 일반적입니다.
*/
