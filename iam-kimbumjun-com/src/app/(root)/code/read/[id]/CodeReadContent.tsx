// src/app/code/read/page.tsx
import Code from '@/components/Code';
import FileDownloader from '@/components/file-manager/FileDownloader';
import VivCopyClipboard from '@/components/VivCopyClipboard';
import VivTitle from '@/components/VivTitle';
import { getLanguageName } from '@/data/category';
import { ICode } from '@/interfaces/i-code';
import { fetchCodeById } from '@/lib/fetchCodes';
import Image from 'next/image';
import { title } from 'process';
import { remark } from 'remark';
import html from 'remark-html';

// 마크다운을 HTML 로 변환하는 비동기 함수 (Server Component 내에서 직접 사용 가능)
async function markdownToHtml(markdown: string) {
    const result = await remark()
        .use(html) // remark 가 HTML 을 출력하도록 설정
        .process(markdown); // 마크다운 처리
    return result.toString(); // HTML 문자열 반환
}


export async function CodeReadContent({ id }: { id: number }) {
    const code: ICode | null = await fetchCodeById(Number(id)); // id를 숫자로 변환
    const codeTheme = 'min-light';
    if (!code) return <div>Code not found</div>;

    const markdownContentHtml = await markdownToHtml(code.markdown ?? '');
    const noteContentHtml = await markdownToHtml(code.note ?? '');

    return (

        <div className="flex flex-col w-full px-4 ml-2 items-center">

            {/* 제목, title */}
            <VivTitle title={`${code.id}. ${code.title}`} />
            <h4 className="text-slate-400 font-cute">{code.subTitle}</h4>

            {/* 작성일, 작성자, 수정일 */}
            <div className="w-full flex justify-evenly px-8 text-sm mb-4">
                <span className="text-slate-400 text-center">
                    <p className='text-xs text-amber-600'>작성일</p>
                    {new Date(code.created).toLocaleDateString()}
                </span>

                <span className="flex-1 text-slate-500 text-center">
                    <p className='text-xs text-amber-600'>작성</p>
                    {code.userName}
                </span>

                <span className="text-slate-400 text-center">
                    <p className='text-xs text-amber-600'>수정일</p>
                    {new Date(code.modified).toLocaleDateString()}
                </span>
            </div>

            <div className="min-w-full flex flex-col gap-4">

                {/* 노트, note */}
                {noteContentHtml && ( // 변환된 HTML이 있을 때만 렌더링
                    <div className="prose prose-sm
                                    lg:prose-base max-w-none
                                    mb-4 py-4
                                    border rounded-md
                                    border-slate-300
                                    px-8
                                    w-full
                                    bg-gray-50">
                        <div dangerouslySetInnerHTML={{ __html: noteContentHtml }} />

                        {/* 클립보드 복사 버튼 */}
                        <div className="flex justify-evenly my-4 items-center">
                            {code.note && (
                                <span className='text-sky-700 hover:text-red-400'>
                                    <VivCopyClipboard content={code.note} title='노트' />
                                </span>
                            )}
                        </div>

                    </div>
                )}

                {/* 코드, content */}
                {code.content && (
                    <div className="w-full
                                        h-auto
                                        border
                                        border-slate-300
                                        rounded-md
                                        py-4
                                        px-8
                                        overflow-scroll">
                        <VivTitle title='코드' fontColor='text-slate-400' />
                        <Code
                            code={code.content}
                            lang={getLanguageName(code.categoryId)}
                            theme={codeTheme}
                        />
                        {/* 클립보드 복사 버튼 */}
                        <div className="flex justify-evenly my-4 items-center">
                            {code.content && (
                                <span className='text-sky-700 hover:text-red-400'>
                                    <VivCopyClipboard content={code.content} title='코드' />
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* 보조코드, subContent */}
                {code.subContent && (
                    <div className="h-auto w-full
                                    border
                                    border-slate-300
                                    rounded-md
                                    py-4 px-8
                                    overflow-scroll">
                        <VivTitle title='보조코드' fontColor='text-slate-400' />
                        <Code
                            code={code.subContent}
                            lang={getLanguageName(code.categoryId)}
                            theme={codeTheme}
                        />

                        {/* 클립보드 복사 버튼 */}
                        <div className="flex justify-evenly my-4 items-center">
                            {code.subContent && (
                                <span className='text-sky-700 hover:text-red-400'>
                                    <VivCopyClipboard content={code.subContent} title='보조코드' />
                                </span>
                            )}
                        </div>
                    </div>
                )}


                {/* 결론, Conclusion */}
                {markdownContentHtml && ( // 변환된 HTML이 있을 때만 렌더링
                    <div className="prose
                                    prose-sm
                                    lg:prose-base
                                    max-w-none
                                    py-4 px-8
                                    border
                                    border-slate-300
                                    overflow-scroll
                                    rounded-md bg-gray-50">
                        <VivTitle title='CONCLUSION' fontColor='text-slate-400' />
                        <div dangerouslySetInnerHTML={{ __html: markdownContentHtml }} />
                        {/* 클립보드 복사 버튼 */}
                        <div className="flex justify-evenly my-4 items-center">
                            {code.markdown && (
                                <span className='text-sky-700 hover:text-red-400'>
                                    <VivCopyClipboard content={code.markdown} title='노트' />
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* attachImage */}
                {code.attachImageName && (
                    <div style={{ position: 'relative', width: '100%', overflow: 'scroll', display: 'flex', justifyContent: 'center' }}>
                        <Image
                            width={1024}
                            height={1024}
                            sizes="100vw"
                            quality={100}
                            style={{ objectFit: 'cover', borderRadius: '1em' }}
                            src={
                                !code.attachImageName
                                    ? `/images/no-image.svg`
                                    : `${process.env.NEXT_PUBLIC_API_URL}/images/Attach/${code.attachImageName}`
                            }
                            alt={code.title || ""}

                        />
                    </div>)}

                {/* attachFile download */}
                <div className="my-4">
                    {code.attachFileName && (<FileDownloader fileUrl={code.attachFileName} />)}
                </div>

                {/* 클립보드 복사 버튼 추가 */}
                <div className="flex justify-evenly my-4 items-center">
                    <span className='text-sky-700 hover:text-red-400'>
                        내용복사
                        <VivCopyClipboard content={code.content} /> {/* content만 복사 */}
                    </span>
                    <span className='text-sky-700 hover:text-red-800'>
                        전체복사
                        <VivCopyClipboard content={code} /> {/* 전체 복사 */}
                    </span>
                </div>

            </div>
        </div>
    )
}


/*
{code.attachFileName
                ? (<FileDownloader fileUrl={code.attachFileName} />)
                : (<p className='text-slate-400 text-xs text-center py-4'>첨부파일 없음</p>)

// priority={true}
import Image from 'next/image';
            // quality: 이미지 압축 품질 (1-100, 기본값 75). 원본 품질에 가깝게 하려면 100으로.
            // ... 컴포넌트 내부 ...
            // alt 텍스트 개선 priority: 페이지에서 중요한 이미지라면 true로 설정하여 먼저 로드
            <Image
                // unoptimized 사용 시 width, height, quality 등 최적화 관련 props는 의미 없어짐.
                // 하지만 layout shift 방지를 위해 width/height는 여전히 필요할 수 있음 (fill 모드에서는 불필요)
                // 여기서는 CSS로 크기를 제어하므로 fill과 유사하게 동작시키거나,
                // width/height를 제공하고 style로 오버라이드 할 수 있음.
                // 아래는 fill과 유사하게 동작시키는 예시 (부모 요소 필요)

                // fill 사용 예시
                // <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                //     <Image
                //         unoptimized={true}
                //         fill
                //         style={{ objectFit: 'cover' }}
                //         src={...}
                //         alt={...}
                //     />
                // </div>

                // width/height 사용 + style 오버라이드 예시 (CLS 방지 효과는 유지)
                width={1920} // 원본 또는 임의의 값 (CLS 방지용)
                height={1080} // 원본 또는 임의의 값 (CLS 방지용)
                style={{ width: '100%', height: 'auto' }} // 실제 크기는 CSS로
                unoptimized={true}
                src={
                    !code.attachImageName
                        ? `/images/no-image.svg`
                        : `${process.env.NEXT_PUBLIC_API_URL}/images/Attach/${code.attachImageName}`
                }
                alt={code.title || "Code Attachment Image"}
            />

    // width, height 대신 fill 사용
    // fill
    // sizes: 브라우저에게 다양한 뷰포트 너비에서 이미지가 얼마나 클지 알려줌.
    // '100vw'는 이미지가 항상 뷰포트 너비의 100%를 차지함을 의미.
    // style: object-fit 등으로 이미지 표시 방식 제어 (cover, contain 등)
    // 'contain'을 사용하면 이미지가 잘리지 않음
    // style={{ objectFit: 'contain', borderRadius: '1em' }} // 'contain'을 사용하면 이미지가 잘리지 않
            */

{/*
<div className="h-auto w-full relative">
    <Image
        width={4096}
        height={0}
        // quality={75}
        className='object-cover top-0 left-0 absolute'
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
*/}


{/* <div style={{ position: 'relative', width: '100%', overflow: 'scroll', aspectRatio: '16/9' }}> */ }
