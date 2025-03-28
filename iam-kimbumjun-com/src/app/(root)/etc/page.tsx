'use client'
import * as React from 'react';
import VivTitle from '@/components/VivTitle';
import { VivDialogResult } from '@/components/VivDialogResult';
import { Button, Stack, TextField } from '@mui/material';
import { DialogsProvider } from '@toolpad/core/useDialogs';
// import { useLocalStorageState } from '@toolpad/core/useLocalStorageState';
// import { useSession } from '@toolpad/core/useSession';

export default function EtcPage() {
  const [name, setName] = React.useState<string | null>(null); // 결과 저장 상태
  // const [value, setValue] = useLocalStorageState('user', 'Initial Value');
  // const session = useSession();

  return (
    <div className="flex flex-col w-full px-8 min-h-screen">
      <VivTitle title="잡동사니" />
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

        <Stack direction={`column`} spacing={2}>
          {/* Local Storage */}
          {/* <TextField
            label="당신의 이름"
            value={value || ''}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            multiline
            sx={{ mt: 2 }}
          /> */}
          {/* <Button onClick={() => setValue(null)}>Get User</Button> */}
        </Stack>
      </DialogsProvider>
    </div>
  );
}
