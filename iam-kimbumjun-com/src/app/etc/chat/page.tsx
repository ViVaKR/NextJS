import { Suspense } from 'react';
import Chat from './Chat';
import VivLoading from '@/components/VivLoading';
export default function CodeList() {
  return (
    <Suspense fallback={<VivLoading params={{ choice: 5 }} />}>
      <Chat />
    </Suspense>
  );
}
