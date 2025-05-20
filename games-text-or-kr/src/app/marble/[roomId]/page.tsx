import VivMarble from '@/components/game-marble/VivMarble';
import { NextPage } from 'next';
import { notFound } from 'next/navigation';

// Props 타입 정의
type Props = {
    params: Promise<{ roomId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 비동기 페이지 컴포넌트
const MarbleRoomPage: NextPage<Props> = async ({ params, searchParams }) => {
    // params와 searchParams를 비동기적으로 처리
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    // roomId가 유효하지 않을 경우 404 처리
    if (!resolvedParams.roomId) return notFound();

    // playerId를 안전하게 추출
    const playerId = typeof resolvedSearchParams?.playerId === 'string' && !isNaN(Number(resolvedSearchParams.playerId))
        ? Number(resolvedSearchParams.playerId)
        : null;

    return (
        <div className="w-full min-h-screen bg-slate-100 p-8">
            {playerId !== null
                ? (<VivMarble roomId={resolvedParams.roomId} playerId={playerId} />)
                : (<div className="text-red-500">플레이어 ID가 유효하지 않습니다.</div>)}
        </div>
    );
};

export default MarbleRoomPage;
