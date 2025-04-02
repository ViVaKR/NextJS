'use client';

import katex from 'katex';
import 'katex/dist/katex.min.css';
import styles from './Home.module.css';
import React, { useEffect, useState } from 'react';
import { Cute_Font } from 'next/font/google'
import { Typography } from '@mui/material';


export async function getServerSideProps() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return {
      props: {
        publicIP: data.ip,
      },
    };
  } catch (error) {
    return {
      props: {
        publicIP: '0.0.0.0',
      },
    };
  }
}

const cute = Cute_Font({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

export default function Home() {
  const mathRef = React.useRef<HTMLDivElement>(null); // DOM 요소 참조
  const message = '인간이-이해하는-코드-조각..';
  const characters = Array.from(message);
  const [ip, setIp] = useState('0.0.0.0');
  const expression: string =
    'R_{\\mu\\nu} - \\frac{1}{2}Rg_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}';

  useEffect(() => {
    if (mathRef.current) {
      mathRef.current.innerHTML = ''; // 렌더링 전에 내용 비우기
      katex.render(expression, mathRef.current, {
        throwOnError: false,
        displayMode: true,
      });
    }

    const ipAddress = async () => {
      const result = await getServerSideProps();
      setIp(result.props.publicIP);
    }
    ipAddress();

  }, []);


  return (
    <div className="flex flex-col m-0 p-0 relative min-h-screen">
      <div
        className="relative
                    h-screen
                    sm:h-screen
                    overflow-hidden
                    bg-cover
                    bg-center
                    bg-robot
                    bg-no-repeat
                    pt-12
                    text-center
                    bg-teal-950/70">
        <div
          className="absolute
                    bottom-0
                    left-0
                    right-0
                    top-0
                    h-full
                    w-full
                    overflow-hidden
                  bg-teal-950/70
                    bg-fixed">
          <div className="flex flex-col h-full items-center justify-center">
            <div className="text-white">
              <main
                className={`${styles.mainText} mb-4 text-9xl
                relative
                flex
                max-xl:text-7xl text-slate-300
                ${cute.className} max-md:text-5xl font-extrabold`}>
                {/* 인간이 이해하는 코드 조각 */}
                {characters.map((char, index) => (
                  <span key={index}>
                    {char === '-' ? (
                      <span
                        style={{
                          display: 'inline-block',
                          width: '1ch',
                        }}></span>
                    ) : (
                      char
                    )}
                  </span>
                ))}
              </main>
            </div>
            {/* Math Container */}
            <div
              ref={mathRef}
              className="text-slate-400 text-xl"></div>

            <button
              type="button"
              className="text-slate-400 text-xl math-container"></button>

            <Typography sx={{ color: 'var(--color-red-100)', fontSize: '0.75em' }}>
              {ip}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
