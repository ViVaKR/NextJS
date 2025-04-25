import VivTitle from "@/components/VivTitle"

export default function UnAuthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-baseline">
      <VivTitle title="허가되지 않은 사용자" />
      <p className="text-center text-red-400 text-xl">허가되지 않은 사용자 입니다.</p>
    </div>
  );
}
