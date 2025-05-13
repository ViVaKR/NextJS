import VivBlueMarble from "@/components/VivBlueMarble";
import VivTitle from "@/components/VivTitle";

export default function Home() {
    return (
        <div className="w-full min-h-screen bg-slate-100 p-8">
            <VivTitle title="푸른구슬의 전설" />
            <VivBlueMarble />
        </div>
    );
}
