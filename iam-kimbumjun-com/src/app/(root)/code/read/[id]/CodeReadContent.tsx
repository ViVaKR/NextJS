// src/app/code/read/page.tsx
import Code from '@/components/Code';
import VivTitle from '@/components/VivTitle';
import { getLanguageName } from '@/data/category';
import { ICode } from '@/interfaces/i-code';
import { fetchCodeById } from '@/lib/fetchCodes';
import Image from 'next/image';
import React from 'react';

export async function CodeReadContent({ id }: { id: number }) {
    const code: ICode | null = await fetchCodeById(Number(id)); // id를 숫자로 변환
    if (!code) return <div>Code not found</div>;

    return (
        <div className="flex flex-col w-full px-4 ml-2 items-center h-screen">
            <VivTitle title={`${code.id}. ${code.title}`} />
            <h4 className="text-slate-400 font-cute">{code.subTitle}</h4>

            {/* info */}
            <div className="w-full flex justify-evenly px-8">
                <span className="text-slate-400">
                    {new Date(code.created).toLocaleDateString()}
                </span>

                <span className="flex-1 text-slate-400 text-center">
                    {code.userName}
                </span>

                <span className="text-slate-400">
                    {new Date(code.modified).toLocaleDateString()}
                </span>
            </div>

            {/* code */}
            <div className="min-w-full flex flex-col">
                <div className="w-full h-auto">
                    {/* content */}
                    <Code
                        code={code.content}
                        lang={getLanguageName(code.categoryId)}
                        theme="min-light"
                    />
                </div>
                {/* subContent */}
                <div className="h-auto w-full">
                    <Code
                        code={code.subContent ?? '연관된 코드는 없습니다.'}
                        lang="tsx"
                        theme="everforest-dark"
                    />
                </div>
                {/* note */}
                <div className="h-auto w-full">
                    <Code
                        code={code.note ?? '코드설명은 없습니다.'}
                        lang="markdown"
                        theme="everforest-dark"
                    />
                </div>

                {/* markdown */}
                <div className="h-auto w-full">
                    <Code
                        code={code.markdown ?? 'README 내용은 없습니다.'}
                        lang="markdown"
                        theme="everforest-dark"
                    />
                </div>
                <div className="h-auto w-full">
                    <Image
                        width={500}
                        height={500}
                        style={{ width: '100vw', height: 'auto' }}
                        src={
                            code.attachImageName === null ||
                                code.attachImageName === '' ||
                                code.attachImageName === undefined
                                ? `/images/no-image.svg`
                                : `${process.env.NEXT_PUBLIC_API_URL}/images/Attach/${code.attachImageName}`
                        }
                        alt="-"
                    />
                </div>
            </div>
        </div>
    );
}
