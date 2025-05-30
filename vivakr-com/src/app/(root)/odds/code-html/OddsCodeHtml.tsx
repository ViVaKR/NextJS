'use client'; // 클라이언트 컴포넌트로 지정

import VivTitle from '@/components/VivTitle';
import React, { useState, useEffect } from 'react'; // useState, useEffect 임포트
import { codeToHtml } from 'shiki';

const code = `'use client';
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function OddsAccordion() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div className="h-[80%]">
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}>
        {/*  */}
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          <Typography
            component="span"
            sx={{ width: '33%', flexShrink: 0 }}>
            General settings
          </Typography>
          <Typography
            component="span"
            sx={{ color: 'text.secondary' }}>
            I am an accordion
          </Typography>
        </AccordionSummary>
        {/*  */}
        <AccordionDetails>
          <Typography>
            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
            Aliquam eget maximus est, id dignissim quam.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header">
          <Typography
            component="span"
            sx={{ width: '33%', flexShrink: 0 }}>
            Users
          </Typography>
          <Typography
            component="span"
            sx={{ color: 'text.secondary' }}>
            You are currently not an owner
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat
            lectus, varius pulvinar diam eros in elit. Pellentesque convallis
            laoreet laoreet.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header">
          <Typography
            component="span"
            sx={{ width: '33%', flexShrink: 0 }}>
            Advanced settings
          </Typography>
          <Typography
            component="span"
            sx={{ color: 'text.secondary' }}>
            Filtering has been entirely disabled for whole web server
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === 'panel4'}
        onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header">
          <Typography
            component="span"
            sx={{ width: '33%', flexShrink: 0 }}>
            Personal data
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
`;

export default function OddsCodeHtml() {
  const [html, setHtml] = useState<string>(''); // HTML 상태 관리
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태 추가

  useEffect(() => {
    let isMounted = true; // 컴포넌트 마운트 상태 추적

    const generateHtml = async () => {
      try {
        const generatedHtml = await codeToHtml(code, {
          theme: 'min-light',
          lang: 'typescript',
        });
        if (isMounted) {
          // 컴포넌트가 여전히 마운트 상태일 때만 상태 업데이트
          setHtml(generatedHtml);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error generating HTML with Shiki:', error);
        if (isMounted) {
          setHtml('<p>Error loading code snippet.</p>'); // 오류 메시지 표시
          setIsLoading(false);
        }
      }
    };

    generateHtml();

    // 클린업 함수: 컴포넌트 언마운트 시 isMounted를 false로 설정
    return () => {
      isMounted = false;
    };
  }, []); // 빈 의존성 배열: 마운트 시 한 번만 실행

  return (
    <React.Fragment>
      <VivTitle title="Code To HTML" />
      {isLoading ? (
        // 로딩 중 표시 (스켈레톤 UI 등 사용 가능)
        <div
          className={`text-sm max-md:hidden min-w-md mx-4 rounded-2xl p-4 bg-gray-100`}>
          Loading code...
        </div>
      ) : (
        // 로딩 완료 후 HTML 표시
        <div
          className={`text-sm max-md:hidden min-w-md mx-4 rounded-2xl`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </React.Fragment>
  );
}
