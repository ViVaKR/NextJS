'use client';

import { Box, Button, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import styles from './CodeRunner.module.css'; // 스타일 파일 생성 필요
export default function CodeRunner() {
  const [title] = useState('Code Runner');
  const [script, setScript] = useState(
    "#! /usr/bin/env zsh\n\necho 'Hello World'"
  ); // 초기 스크립트
  const [scriptOutput, setScriptOutput] = useState<string>(''); // 실행 결과
  const runnerUrl = 'https://runner.kimbumjun.com'; // 실행 서버 URL
  const scriptInputRef = useRef<HTMLTextAreaElement>(null); // TextField 참조
  // 컴포넌트 마운트 시 초기 실행 (ngAfterViewInit 대체)
  useEffect(() => {
    runScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 스크립트 실행 (fetch로 변환)
  const runScript = async () => {
    try {
      const response = await fetch(runnerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script }), // 요청 본문
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setScriptOutput(data.output); // 응답에서 output 추출
    } catch (error: any) {
      setScriptOutput(error.message); // 에러 메시지 출력
    }
  };

  // 스크립트 초기화 및 포커스
  const clearScript = () => {
    setScript('#! /usr/bin/env zsh\n\n');
    setScriptOutput('');
    if (scriptInputRef.current) {
      scriptInputRef.current.focus(); // 포커스 이동
    }
  };

  // 클립보드 복사 (추가 기능)
  const copyScript = async () => {
    try {
      await navigator.clipboard.writeText(script);
      alert('스크립트가 클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('복사 실패:', err);
      alert('복사 실패!');
    }
  };
  // 탭 키로 공백 4개 추가 (Angular의 indent 로직 대체)
  return (
    <div className={styles.codeRunnerContainer}>
      <h3 className="text-center text-slate-400">{title}</h3>
      <Box
        component="form"
        noValidate
        autoComplete="off">
        <TextField
          label="Script Input"
          multiline
          fullWidth
          rows={10}
          value={script}
          onChange={(e) => setScript(e.target.value)}
          inputRef={scriptInputRef} // ref 연결
          variant="outlined"
          color="primary"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              fontFamily: 'monospace',
              fontSize: '16px',
            },
            '& .MuiInputLabel-root': {
              color: '#aaa',
            },
          }}
        />
      </Box>
      <div className={styles.buttonGroup}>
        <Button
          onClick={clearScript}
          variant="outlined"
          color="secondary"
          className="mt-4 mr-2">
          Clear
        </Button>
        <Button
          onClick={copyScript}
          variant="outlined"
          color="success"
          className="mt-4">
          Copy
        </Button>
        <Button
          onClick={runScript}
          variant="contained"
          color="primary"
          className="mt-4 mr-2">
          Run
        </Button>
      </div>
      <pre className={styles.output}>
        <code>{scriptOutput}</code>
      </pre>
    </div>
  );
}
