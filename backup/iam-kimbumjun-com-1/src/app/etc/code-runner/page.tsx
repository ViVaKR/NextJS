import Loading from '@/components/VivLoading';

export default function CodeRunner() {
  return (
    <>
      <h1>CodeRunner</h1>
      <Loading params={{ choice: 1 }} />
    </>
  );
}
