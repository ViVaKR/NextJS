import VivTitle from "@/components/VivTitle";
import BlueMarble from "./BlueMarble";

export default function BlueMablePage() {

    return (
        <>
            <VivTitle title="푸른구슬의 전설" />
            <div className="w-full min-h-screen bg-slate-100 p-8">
                {/* <p>게임 준비중 곧 새로운 모습으로 뵙겠습니다...</p> */}
                {/* <VivBlueMarble /> */}
                <BlueMarble />
            </div>
        </>
    );
}
