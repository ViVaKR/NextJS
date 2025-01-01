import { NextRequest, NextResponse } from "next/server";
import { comments } from "../data";
import { redirect } from "next/navigation";

type Params = {
    params: {
        id: string;
    };
};

export async function GET(request: NextRequest, { params }: Params) {
    const { id } = params;

    if (parseInt(id) > comments.length) {
        return redirect("/comments");
    }
    const comment = comments.find((comment) => comment.id === parseInt(id));
    if (!comment) {
        return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }
    return NextResponse.json(comment);
}

export async function PATCH(request: NextRequest, { params }: Params) {
    const { id } = params;
    const comment = comments.find((comment) => comment.id === parseInt(id));
    if (!comment) {
        return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }
    const body = await request.json();
    const { text } = body;
    const index = comments.findIndex((comment) => comment.id === parseInt(id));
    comments[index].text = text;

    return NextResponse.json(comments[index], { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: Params) {
    const { id } = params;
    const index = comments.findIndex((comment) => comment.id === parseInt(id));
    if (index === -1) {
        return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }
    const deletedComment = comments[index];
    comments.splice(index, 1);

    return NextResponse.json(deletedComment, { status: 200 });
}
