// src/app/code/read/CodeReadContent.tsx
import FileDownloader from '@/components/file-manager/FileDownloader';
import VivCopyClipboard from '@/components/VivCopyClipboard';
import VivTitle from '@/components/VivTitle';
import { getLanguageName } from '@/data/category';
import { fetchCodeById } from '@/lib/fetchCodes';
import Image from 'next/image';
import { remark } from 'remark';
import html from 'remark-html';
import { Typography } from '@mui/material';
import Code from '@/components/Code'; // 서버 컴포넌트 유지
import DeleteButton from './DeleteButton'; // 클라이언트 컴포넌트로 분리
import UpdateButton from './UpdateButton';

async function markdownToHtml(markdown: string) {
    const result = await remark().use(html).process(markdown);
    return result.toString();
}

export default async function CodeReadContent({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    const code = await fetchCodeById(id);

    if (!code) {
        return <Typography>코드를 찾을 수 없습니다.</Typography>;
    }

    const noteHtml = code.note ? await markdownToHtml(code.note) : '';
    const markdownHtml = code.markdown ? await markdownToHtml(code.markdown) : '';
    const codeTheme = 'everforest-dark'; // theme 수정

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
        <div className="flex flex-col w-full px-4 ml-2 items-center">
            <VivTitle title={`${code.id}. ${code.title}`} />
            <h4 className="text-slate-400 font-cute">{code.subTitle}</h4>

            <div className="w-full flex justify-evenly px-8 text-sm mb-4">
                <span className="text-slate-400 text-center">
                    <p className="text-xs text-amber-600">작성일</p>
                    {new Date(code.created).toLocaleDateString()}
                </span>
                <span className="flex-1 text-slate-500 text-center">
                    <p className="text-xs text-amber-600">작성</p>
                    {code.userName}
                </span>
                <span className="text-slate-400 text-center">
                    <p className="text-xs text-amber-600">수정일</p>
                    {new Date(code.modified).toLocaleDateString()}
                </span>
            </div>

            <div className="min-w-full flex flex-col gap-4">
                {code.note && noteHtml && (
                    <div className={proseStyles}>
                        <div dangerouslySetInnerHTML={{ __html: noteHtml }} />
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
                        <Code code={code.content} lang={getLanguageName(code.categoryId)} theme={codeTheme} />
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
                        <Code code={code.subContent} lang={getLanguageName(code.categoryId)} theme={codeTheme} />
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
                        <VivCopyClipboard content={JSON.stringify(code)} title="전체 데이터" />
                    </span>
                </div>

                <div className="flex justify-evenly items-center gap-4 mb-48">
                    <DeleteButton codeId={code.id} userId={code.userId} />
                    <UpdateButton codeId={code.id} userId={code.userId} />
                </div>
            </div>
        </div>
    );
}
