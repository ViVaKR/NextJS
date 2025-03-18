export default function VivTitle({
  title,
  fontColor,
}: {
  title: string;
  fontColor?: string;
}) {
  return (
    <div
      className={`${
        fontColor ?? 'text-sky-800'
      } w-full text-center text-3xl my-4 font-cute`}>
      {title}
    </div>
  );
}
