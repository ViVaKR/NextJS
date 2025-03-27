'use client';
import VivTitle from '@/components/VivTitle';
import { useSnackbar } from '@/lib/SnackbarContext';

export default function SnackBar() {
  const { showSnackbar } = useSnackbar();

  const handleButtonClick = () => {
    showSnackbar('버튼을 클릭했어요!', 'success', 'top', 'right', 1000); // 메시지와 erverity 설정
  };

  const handleErrorClick = () =>
    showSnackbar('에러 발생!', 'error', 'bottom', 'center', 3000);

  const handleNormalClick = () => {
    showSnackbar('일반 메시지입니다.', 'warning', 'bottom', 'right'); // 기본 6초
  };
  return (
    <>
      <VivTitle title="스낵바 데모" />
      <div className="flex gap-2 px-2 items-center">
        <button
          type="button"
          className="cursor-pointer text-slate-400 border-1
          hover:text-white
          hover:bg-sky-400
          rounded-lg w-48 h-12 px-4 py-2"
          onClick={handleButtonClick}>
          스낵바 띄우기
        </button>

        <button
          type="button"
          className="cursor-pointer my-1 text-slate-400 border-1
          hover:bg-sky-400
          hover:text-white
          rounded-lg w-48 h-12 px-4 py-2"
          onClick={handleErrorClick}>
          스낵바 띄우기
        </button>
        <button
          type="button"
          className="cursor-pointer text-slate-400 border-1
          hover:text-white
          hover:bg-sky-400
          rounded-lg w-48 h-12 px-4 py-2"
          onClick={handleNormalClick}>
          스낵바 띄우기
        </button>
      </div>
    </>
  );
}
