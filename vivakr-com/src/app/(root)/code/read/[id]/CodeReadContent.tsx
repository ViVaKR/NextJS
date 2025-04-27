// src/app/code/read/CodeReadContent.tsx
import FileDownloader from '@/components/file-manager/FileDownloader';
import VivCopyClipboard from '@/components/VivCopyClipboard';
import VivTitle from '@/components/VivTitle';
import { getLanguageName } from '@/data/category';
import { fetchCodeById } from '@/lib/fetchCodes';
import Image from 'next/image';
import { Typography } from '@mui/material';
import Code from '@/components/Code'; // 서버 컴포넌트 유지
import DeleteButton from './DeleteButton'; // 클라이언트 컴포넌트로 분리
import UpdateButton from './UpdateButton';
import { Fira_Code } from 'next/font/google';
import { getMarkdownParser } from '@/lib/markdown';

const fira = Fira_Code({
    subsets: ['latin'],
    display: 'swap',
});

export default async function CodeReadContent({ params }: { params: Promise<{ id: string }> }) {

    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    // --- 데이터 페칭 에러 핸들링 추가 ---
    let code;
    try {
        code = await fetchCodeById(id);
    } catch (error) {
        console.error("Failed to fetch code:", error);
        // 사용자에게 보여줄 에러 메시지나 특정 페이지로 리다이렉트 고려
        return <Typography>코드를 불러오는 중 오류가 발생했습니다.</Typography>;
    }
    // --- 끝 ---

    if (!code)
        return <Typography>코드를 찾을 수 없습니다.</Typography>;

    // --- Shiki 초기화 로직 변경 ---
    const md = await getMarkdownParser(); // 분리된 함수 호출

    // 렌더링 전에 code.note와 code.markdown이 실제로 존재하는지 확인
    const noteHtml = code?.note ? md.render(code.note) : '';
    const markdownHtml = code?.markdown ? md.render(code?.markdown) : '';
    // --- 끝 ---

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
        '[&>pre]:bg-transparent [&>pre]:p-0', // prose가 pre 태그에 넣는 배경/패딩 제거 (Shiki가 관리하도록)
    ].join(' ');

    const markdownStyles = [
        'prose',
        'prose-sm',
        'lg:prose-base',
        'max-w-none',
        { fira },
        'mb-4',
        'py-4',
        'px-8',
        'w-full',
        'bg-gray-50',
        '[&>pre]:bg-transparent [&>pre]:p-0', // prose가 pre 태그에 넣는 배경/패딩 제거 (Shiki가 관리하도록)
    ].join(' ');

    // markdownStyles에 fira 폰트 적용 방식 수정 (클래스 이름 직접 사용)
    const markdownContainerStyles = [ // 클래스 이름 변경 (markdownStyles -> markdownContainerStyles)
        'prose', 'prose-sm', 'lg:prose-base', 'max-w-none',
        'mb-4', 'py-4', 'px-8', 'w-full', 'bg-gray-50',
        '[&>pre]:bg-transparent [&>pre]:p-0',
    ].join(' ');

    const contentStyles = [
        'w-full', 'h-auto', 'border', 'border-slate-300', 'rounded-md',
        'py-4', 'px-8', 'overflow-x-auto'
    ].join(' ');

    const SectionFooter = ({ children }: { children: React.ReactNode }) => (
        <div className="flex justify-evenly my-4 items-center">{children}</div>
    );

    return (
        <div className="flex flex-col w-full px-4 ml-2 h-auto items-center relative">
            <VivTitle title={`${code.id}. ${code.title}`} />
            <h4 className="text-slate-400">{code.subTitle}</h4>

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
                {/* Note 섹션  */}
                {code.note && noteHtml && (
                    <div className={proseStyles}>
                        {/* <div className={markdownStyles} dangerouslySetInnerHTML={{ __html: noteHtml }} /> */}
                        {/* dangerouslySetInnerHTML 적용 수정 */}
                        <div className={fira.className} dangerouslySetInnerHTML={{ __html: noteHtml }} />

                        <SectionFooter>
                            <span className="text-sky-700 hover:text-red-400">
                                <VivCopyClipboard content={code.note} title="노트" />
                            </span>
                        </SectionFooter>
                    </div>
                )}

                {/* 코드 섹션 */}
                {code.content && (
                    <div className={contentStyles}>
                        <VivTitle title="코드" fontColor="text-slate-400" />
                        <Code code={code.content}
                            lang={getLanguageName(code.categoryId)}
                        />
                        <SectionFooter>
                            <span className="text-sky-700 hover:text-red-400">
                                <VivCopyClipboard content={code.content} title="코드" />
                            </span>
                        </SectionFooter>
                    </div>
                )}

                {/* SubContent 섹션 */}
                {code.subContent && (
                    <div className={contentStyles}>
                        <VivTitle title="연관코드" fontColor="text-slate-400" />
                        <Code code={code.subContent}
                            lang={getLanguageName(code.categoryId)} />
                        <SectionFooter>
                            <span className="text-sky-700 hover:text-red-400">
                                <VivCopyClipboard content={code.subContent} title="연관코드" />
                            </span>
                        </SectionFooter>
                    </div>
                )}

                {code.markdown && markdownHtml && (
                    <div className={proseStyles}>
                        <div className={markdownContainerStyles}>
                            <VivTitle title="CONCLUSION" fontColor="text-slate-400" />
                            {/* <div className={`${fira.className}`} dangerouslySetInnerHTML={{ __html: markdownHtml }} /> */}
                            {/* markdownHtml을 직접 렌더링 */}
                            <div className={fira.className} dangerouslySetInnerHTML={{ __html: markdownHtml }} />
                            <SectionFooter>
                                <span className="text-sky-700 hover:text-red-400">
                                    <VivCopyClipboard content={code.markdown} title="결론" />
                                </span>
                            </SectionFooter>
                        </div>
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
            <div className='min-h-[50%]'></div>

        </div>
    );
}
