'use client'
import Image from 'next/image';

// imageStyle은 이미지의 *보이는* 스타일을 결정합니다.
// width, height는 Next.js가 이미지의 종횡비와 최적화를 위해 사용합니다.
// const imageStyle = {
//   borderRadius: '50%',
//   border: '1px solid #fff',
//   // 여기에 width: '100px', height: 'auto'를 그대로 두면,
//   // Next.js가 이미지의 intrinsic size를 파악한 후,
//   // 이 CSS가 최종적으로 보이는 크기를 100px로 조절하게 됩니다.
//   // Next.js의 width/height와 CSS의 width/height는 다른 목적을 가집니다.
//   // 여기서는 CSS로 최종 크기를 100px로 만들고 싶으므로, 유지해도 좋습니다.
//   // 또는 CSS를 제거하고, Image 컴포넌트에 className을 줘서 조절하는 방법도 있습니다.
//   width: '100px',
//   height: 'auto',
// };
const imageUrl = '/images/viv.webp';

export default function Effect() {

  return (
    <div
      className="flex flex-col gap-4 h-dvh w-full p-4">

      {/* ⚠️ 중요: fill을 사용할 때는 부모 요소에 'position: relative'를 반드시 부여해야 합니다! */}
      {/* 그리고 부모 요소가 Image가 차지할 '크기'를 가지고 있어야 합니다. */}
      <div>
        <Image
          src={`/images/viv.webp`}
          width={1024}
          height={1024}
          // style={imageStyle}
          className='w-[100px] h-auto border border-white rounded-full object-cover'

          // 이미지 로딩 우선 순위 .. 이 이미지는 다른 이미지보다 먼저 로드되어야 할때 true
          // 기본값 : false, 기본적으로 lazy loading 이 적용됨
          priority={true}
          quality={100}
          alt='Picture'
        />
      </div>

      {/* 이 예시에서는 부모 요소를 100px x 100px 원형 컨테이너로 설정 */}
      <div className="relative w-[100px] h-[100px] rounded-full border border-white overflow-hidden">
        <Image
          src={imageUrl}
          fill={true}        // 👈 fill prop 사용!

          // (max-width: 768px) 100vw:
          // 조건: 뷰포트(화면) 너비가 768px 이하일 때 (모바일 기기 등)
          // 예상 이미지 너비: 이미지는 뷰포트 너비의 **100%**를 차지할 것이다.
          // 의미: 작은 화면에서는 이미지가 화면을 꽉 채울 것이라고 브라우저에 알려주는 거야.
          // (max-width: 1200px) 50vw:
          // 조건: 뷰포트 너비가 768px 초과이고 1200px 이하일 때 (태블릿 또는 작은 데스크톱)
          // 예상 이미지 너비: 이미지는 뷰포트 너비의 **50%**를 차지할 것이다.
          // 의미: 중간 크기 화면에서는 이미지가 화면의 절반을 차지할 것이라고 알려주는 거야.
          // 33vw:
          // 조건: 앞선 두 조건 (768px 이하, 1200px 이하) 모두 해당하지 않을 때 (즉, 뷰포트 너비가 1200px 초과일 때, 큰 데스크톱)
          // 예상 이미지 너비: 이미지는 뷰포트 너비의 **33%**를 차지할 것이다.
          // 의미: 큰 화면에서는 이미지가 화면의 대략 3분의 1을 차지할 것이라고 알려주는 거야.
          // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

          sizes='100px'
          // width, height props는 fill={true}일 때는 사용하지 않습니다.

          className='object-cover' // 이미지가 부모 요소를 채우면서 종횡비 유지 (잘릴 수 있음)
          // 'object-contain'은 이미지를 모두 표시하되 여백이 생길 수 있음
          // 'object-fill'은 이미지를 늘여서 채우므로 뭉개질 수 있음 (주의)

          priority={true} // 이 이미지가 페이지의 주요 이미지라면 설정
          quality={100}   // 이미지 품질 조절 (1~100)
          alt='Picture from Web URI'
        />
      </div>
      {/* <Image
        src='/images/viv.webp'
        style={imageStyle}
        // width={500}
        // height={500}
        // fill={true}
        priority={true}
        quality={100}
        // className='w-48 h-auto drop-shadow-lg/75 drop-shadow-sky-800'
        // loading='lazy'
        // onLoad={event => console.log("Image loaded", event.isTrusted)}
        alt='Picture' /> */}

      <div className="flex gap-4 bg-white h-48 justify-around p-4">

        <div
          className="size-24 bg-sky-500 text-white
          drop-shadow-xs/50
          flex-row-center"></div>

        <div
          className="size-24 border-none bg-indigo-500 text-white
          drop-shadow-lg drop-shadow-indigo-500/50
          flex-row-center"></div>

        <div
          className="size-24 border-none bg-red-500 text-white
          drop-shadow-lg drop-shadow-[0_35px_35px_rgba(0, 0, 0, 0.25)]
          flex-row-center"></div>

      </div>

    </div>
  )
}
