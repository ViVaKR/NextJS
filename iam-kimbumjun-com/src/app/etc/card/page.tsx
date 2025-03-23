import VivCard from '@/components/VivCard';
import VivTitle from '@/components/VivTitle';

export default function Page() {
  return (
    <div className="flex flex-col w-full h-screen items-center justify-start">
      <VivTitle title="카드" />
      <VivCard />
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. In velit
        numquam, amet ea labore quasi temporibus nam ducimus dolore tempore
        tempora, deleniti praesentium. Neque ex, sed molestiae esse maiores
        tempora?
      </div>
    </div>
  );
}
