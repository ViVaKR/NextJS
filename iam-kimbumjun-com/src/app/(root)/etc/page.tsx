'use client'
import * as React from 'react';
import VivTitle from '@/components/VivTitle';
import { VivDialogResult } from '@/components/VivDialogResult';
import { Stack, TextField } from '@mui/material';
import { DialogsProvider } from '@toolpad/core/useDialogs';

export default function EtcPage() {
  const [name, setName] = React.useState<string | null>(null); // 결과 저장 상태

  return (
    <div className="flex flex-col w-full px-8 min-h-screen">
      <VivTitle title="Dialog Box" />

      {/* 다이얼로그 박스를 띄워 값을 리턴 받는 로직 */}
      <DialogsProvider>
        <VivDialogResult
          title='이름 입력'
          contentText='당신의 이름은 무엇입니까?'
          onResult={(result) => setName(result)}
        />

        {/* 결과 반영 */}
        <TextField
          label="당신의 이름"
          value={name || ''}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />

      </DialogsProvider>
    </div>
  );
}
