import { comments } from "../data";
import { redirect } from "next/navigation";

export async function GET(_request: Request, { params }: { params: { id: string } }) {

    if (parseInt(params.id) > comments.length) {
        return redirect("/comments");
    }
    const comment = comments.find((comment) => comment.id === parseInt(params.id));
    if (!comment) {
        return Response.json({ message: "Comment not found" }, { status: 404 });
    }
    return Response.json(comment);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const comment = comments.find((comment) => comment.id === parseInt(params.id));
    if (!comment) {
        return Response.json({ message: "Comment not found" }, { status: 404 });
    }
    const body = await request.json();
    const { text } = body;
    const index = comments.findIndex((comment) => comment.id === parseInt(params.id));
    comments[index].text = text;

    return Response.json(comments[index], { status: 200 });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
    const index = comments.findIndex((comment) => comment.id === parseInt(params.id));
    if (index === -1) {
        return Response.json({ message: "Comment not found" }, { status: 404 });
    }
    const deletedComment = comments[index];
    comments.splice(index, 1);
    return Response.json(comments, { status: 200 });
}
