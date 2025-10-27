// src/app/(root)/api/vhost
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const domain = req.headers.get('host');
    return NextResponse.json({ domain }, { status: 200 });
}
