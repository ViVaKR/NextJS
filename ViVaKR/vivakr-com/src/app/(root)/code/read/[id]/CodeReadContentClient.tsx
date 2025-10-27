'use client';
import FileDownloader from '@/components/file-manager/FileDownloader';
import VivCopyClipboard from '@/components/VivCopyClipboard';
import VivTitle from '@/components/VivTitle';
import { getLanguageName } from '@/data/category';
import Image from 'next/image';
import { Typography, Box } from '@mui/material';
import Code from '@/components/Code';
import DeleteButton from './DeleteButton';
import UpdateButton from './UpdateButton';
import MarkdownIt from 'markdown-it';
import ScrollButtons from '@/components/ScrollButtons';
import { ICode } from '@/interfaces/i-code';
import { useRef } from 'react';

interface CodeReadContentClientProps {
    code: ICode;
    md: MarkdownIt;
}

export default function CodeReadContentClient({ code, md }: CodeReadContentClientProps) {

    const scrollContainerRef = useRef<HTMLElement | null>(null);
    // const codeTheme = 'everforest-dark';

    const noteHtml = md && code?.note ? md.render(code.note) : '';
    const markdownHtml = md && code?.markdown ? md.render(code.markdown) : '';

    const proseStyles = [
        'prose',
        'prose-sm',
        'lg:prose-base',
        'max-w-none',
        'mb-4',
        'py-4',
        'border',
        'rounded-md',
        'border-slate-300',
        'px-8',
        'w-full',
        'bg-gray-50',
        '[&>pre]:bg-transparent [&>pre]:p-0',
    ].join(' ');

    const markdownStyles = [
        'prose',
        'prose-sm',
        'lg:prose-base',
        'max-w-none',
        'mb-4',
        'py-4',
        'px-8',
        'w-full',
        'bg-gray-50',
        '[&>pre]:bg-transparent [&>pre]:p-0',
    ].join(' ');

    const contentStyles = [
        'w-full',
        'h-auto',
        'border',
        'border-slate-300',
        'rounded-md',
        'py-4',
        'px-8',
        'overflow-scroll',
    ].join(' ');

    const SectionFooter = ({ children }: { children: React.ReactNode }) => (
        <div className="flex justify-evenly my-4 items-center">{children}</div>
    );

    return (
        <Box
            component="section"
            ref={scrollContainerRef}
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                px: 4,
                ml: 2,
                height: '100vh', // 스크롤 가능하도록 고정 높이
                overflowY: 'auto', // 세로 스크롤 활성화
                position: 'relative',
            }}
        >
            <VivTitle title={`${code.id}. ${code.title}`} />
            <h4 className="text-slate-400 font-cute">{code.subTitle}</h4>

            <div className="w-full flex justify-evenly px-8 text-sm mb-4">
                <span className="text-slate-400 text-center">
                    <p className="text-xs text-amber-600">작성일</p>
                    {code.created ? (new Date(code.created).toLocaleDateString()) : ''}
                </span>
                <span className="flex-1 text-slate-500 text-center">
                    <p className="text-xs text-amber-600">작성</p>
                    {code.userName}
                </span>
                <span className="text-slate-400 text-center">
                    <p className="text-xs text-amber-600">수정일</p>
                    {code.modified ? (new Date(code.modified).toLocaleDateString()) : ''}
                </span>
            </div>

            <div className="min-w-full flex flex-col gap-4">
                {code.note && noteHtml && (
                    <div className={proseStyles}>
                        <div className={`${markdownStyles} poppins`} dangerouslySetInnerHTML={{ __html: noteHtml }} />
                        <SectionFooter>
                            <span className="text-sky-700 hover:text-red-400">
                                <VivCopyClipboard content={code.note} title="노트" />
                            </span>
                        </SectionFooter>
                    </div>
                )}

                {code.content && (
                    <div className={contentStyles}>
                        <VivTitle title="코드" fontColor="text-slate-400" />
                        <Code code={code.content} lang={getLanguageName(code.categoryId)}
                        // theme={codeTheme}
                        />
                        <SectionFooter>
                            <span className="text-sky-700 hover:text-red-400">
                                <VivCopyClipboard content={code.content} title="코드" />
                            </span>
                        </SectionFooter>
                    </div>
                )}

                {code.subContent && (
                    <div className={contentStyles}>
                        <VivTitle title="보조코드" fontColor="text-slate-400" />
                        <Code code={code.subContent} lang={getLanguageName(code.categoryId)}
                        // theme={codeTheme}
                        />
                        <SectionFooter>
                            <span className="text-sky-700 hover:text-red-400">
                                <VivCopyClipboard content={code.subContent} title="보조코드" />
                            </span>
                        </SectionFooter>
                    </div>
                )}

                {code.markdown && markdownHtml && (
                    <div className={proseStyles}>
                        <VivTitle title="CONCLUSION" fontColor="text-slate-400" />
                        <div dangerouslySetInnerHTML={{ __html: markdownHtml }} />
                        <SectionFooter>
                            <span className="text-sky-700 hover:text-red-400">
                                <VivCopyClipboard content={code.markdown} title="결론" />
                            </span>
                        </SectionFooter>
                    </div>
                )}

                {code.attachImageName && (
                    <Image
                        width={768}
                        height={500}
                        sizes="100%"
                        style={{ objectFit: 'contain', borderRadius: '1.5em', width: '100%' }}
                        src={`${process.env.NEXT_PUBLIC_API_URL}/images/Attach/${code.attachImageName}`}
                        alt={code.title || 'Code Attachment Image'}
                        quality={100}
                    />
                )}

                {code.attachFileName && (
                    <div className="my-4 border border-dashed rounded-full">
                        <FileDownloader fileUrl={code.attachFileName} />
                    </div>
                )}

                <div className="flex justify-evenly my-4 items-center">
                    <span className="text-sky-700 hover:text-red-800">
                        <VivCopyClipboard content={JSON.stringify(code)} title="전체 데이터 복사" />
                    </span>
                </div>

                <div className="flex justify-evenly items-center gap-4 mb-48">
                    <DeleteButton codeId={code.id} userId={code.userId} />
                    <UpdateButton codeId={code.id} userId={code.userId} />
                </div>
            </div>

            <ScrollButtons scrollableRef={scrollContainerRef} />
            <div className="min-h-screen w-full" /> {/* 스크롤 테스트용 여백 */}
        </Box>
    );
}
