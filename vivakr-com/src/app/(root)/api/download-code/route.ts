import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { fileTypeFromFile } from "file-type";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("fileUrl");

    if (!fileUrl) {
        return NextResponse.json(
            { message: "fileUrl 파라미터가 필요합니다." },
            { status: 400 }
        );
    }

    try {
        // 환경 변수에서 기본 경로를 가져오거나, fallback으로 사용자 홈 디렉토리 사용
        const basePath = process.env.FILE_STORAGE_PATH || path.join(process.env.HOME || process.env.USERPROFILE || "", "Temp");
        const filePath = path.join(basePath, "FileData", "Files", "Code", fileUrl);
        try {
            await fs.access(filePath);
        } catch {
            return NextResponse.json(
                { message: "파일을 찾을 수 없습니다." },
                { status: 404 }
            );
        }

        // 파일 읽기
        const fileBuffer = await fs.readFile(filePath);
        const fileName = path.basename(filePath);

        // MIME 타입 결정
        const fileType = await fileTypeFromFile(filePath);
        const contentType = fileType?.mime || "application/octet-stream";

        // Content-Disposition에 유니코드 파일명 안전하게 인코딩
        const encodedFileName = encodeURIComponent(fileName);
        const disposition = `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`;

        // 응답 헤더 설정
        const headers = new Headers();
        headers.set("Content-Disposition", disposition);
        headers.set("Content-Type", contentType);

        // NextResponse로 파일 반환
        return new NextResponse(fileBuffer, {
            status: 200,
            headers,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: `내부 서버 오류: ${(err as Error).message}` },
            { status: 500 }
        );
    }
}
