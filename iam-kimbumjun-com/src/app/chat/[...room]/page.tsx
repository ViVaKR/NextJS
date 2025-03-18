export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ room?: string[] }>;
}) {
  const { room } = await params;
  return (
    <>
      <h1>ChatRoomPage</h1>
      <p>{room ? room.join(', ') : 'No Room'}</p>
    </>
  );
}
