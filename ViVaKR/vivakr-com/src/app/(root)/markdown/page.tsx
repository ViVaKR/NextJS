import MyCookie from './Markdown.mdx'

export default function MarkdownPage() {

    return (
        <div className="prose mx-auto">
            <MyCookie />
            <div className="prose prose-lg prose-h1:text-red-400">
                <h1>제목</h1>
                <blockquote>인용글</blockquote>
                <ul>
                    <li>항목 1</li>
                    <li>항목 2</li>
                </ul>
                <ol>
                    <li>목록 1</li>
                    <li>목록 2</li>
                </ol>
            </div>
        </div>
    );
}


/*
구체적인 스타일 예시

prose를 적용하면 이런 스타일이 기본으로 붙어:

<h1>: 큰 글씨, 굵게, 여백 추가.
<blockquote>: 왼쪽에 회색 테두리, 약간의 패딩.
<ul>: list-style-type: disc, 왼쪽 패딩.
<ol>: list-style-type: decimal, 왼쪽 패딩.
<p>: 적당한 줄 간격과 여백.
네 경우, <ul>, <ol>, <blockquote>이 안 보였던 이유는 Tailwind Preflight가 스타일을 지웠기 때문인데, prose가 그걸 복구해 준 거야.

안녕, 친구! 🤣😀🥹 완벽하게 해결됐다니 나도 정말 기뻐! `prose` 클래스 덕분에 깔끔하게 됐다니 다행이야. 역시 우리 같이 고민한 보람이 있네! 고마워서 더 열심히 도와줄게. `prose`가 뭔지 궁금하다니, 자세히 설명해줄게! 💕💕💕

---

### 해결 확인
네가 올린 코드:
```javascript
import MyCookie from './Markdown.mdx';

export default function MarkdownPage() {
    return (
        <div className="prose mx-auto">
            <MyCookie />
        </div>
    );
}
```
- **`prose mx-auto`**: `prose`로 마크다운 스타일을 살리고, `mx-auto`로 콘텐츠를 가운데 정렬했네. 이제 `> 인용글`, `- 항목`, `1. 목록` 모두 잘 보일 거야. 축하해, 친구! 🎉

---

### `prose`란 무엇인가?
`prose`는 Tailwind CSS에서 제공하는 **Typography 플러그인**(`@tailwindcss/typography`)의 핵심 클래스야. 이 플러그인은 마크다운이나 일반 텍스트 콘텐츠를 예쁘고 읽기 쉽게 스타일링해 주는데, `prose` 클래스를 사용하면 기본적으로 HTML 태그에 적절한 스타일을 자동으로 적용해 줘.

#### 역할
- **마크다운 스타일 복구**: Tailwind의 Preflight가 `<ul>`, `<ol>`, `<blockquote>` 같은 태그의 기본 스타일을 리셋하기 때문에, `prose`는 이런 요소에 다시 예쁜 스타일을 입혀줘.
- **일관된 타이포그래피**: 제목(`h1`~`h6`), 단락(`p`), 리스트(`ul`, `ol`), 인용글(`blockquote`) 등에 읽기 좋은 간격, 크기, 색상을 설정.
- **커스터마이징 가능**: `prose-sm`, `prose-lg`, `prose-invert` 같은 변형 클래스로 크기나 테마를 조정할 수 있어.

#### 구체적인 스타일 예시
`prose`를 적용하면 이런 스타일이 기본으로 붙어:
- `<h1>`: 큰 글씨, 굵게, 여백 추가.
- `<blockquote>`: 왼쪽에 회색 테두리, 약간의 패딩.
- `<ul>`: `list-style-type: disc`, 왼쪽 패딩.
- `<ol>`: `list-style-type: decimal`, 왼쪽 패딩.
- `<p>`: 적당한 줄 간격과 여백.

네 경우, `<ul>`, `<ol>`, `<blockquote>`이 안 보였던 이유는 Tailwind Preflight가 스타일을 지웠기 때문인데, `prose`가 그걸 복구해 준 거야.

#### 예시 (Tailwind 공식 문서 기반)
```html
<div class="prose">
  <h1>제목</h1>
  <blockquote>인용글</blockquote>
  <ul>
    <li>항목 1</li>
    <li>항목 2</li>
  </ul>
  <ol>
    <li>목록 1</li>
    <li>목록 2</li>
  </ol>
</div>
```
- 결과: 제목은 크고 굵게, 인용글은 테두리와 함께, 리스트는 불릿/숫자와 함께 예쁘게 나와.

---

### 왜 필요했나?
- 네 프로젝트에서 `@tailwindcss/typography`를 `globals.css`에 추가했었잖아 (`@plugin "@tailwindcss/typography";`). 근데 이 플러그인은 `prose` 클래스를 요소에 붙여야만 동작해. 그냥 설치만으로는 스타일이 적용 안 되니까, `page.tsx`에 `prose`를 추가하면서 해결된 거야.
- Tailwind 공식 문서나 예제에서 `prose`를 자주 봤다면, 이런 마크다운 콘텐츠를 다룰 때 추천하는 방식이기 때문이야.

#### 커스터마이징
`prose` 스타일을 바꾸고 싶으면 Tailwind 설정(`tailwind.config.js`)에서 조정 가능:
```javascript
module.exports = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'ul': { 'list-style-type': 'circle' }, // 불릿 모양 변경
            'blockquote': { 'border-color': 'blue' }, // 인용글 테두리 색상
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
```

---

### 추가 팁
- **크기 조정**: `prose-sm`, `prose-lg`, `prose-xl`로 텍스트 크기를 키우거나 줄일 수 있어.
- **다크 모드**: `prose-invert`로 다크 테마에 맞게 반전.
- **제거**: 특정 스타일을 빼고 싶으면 `not-prose` 클래스를 추가.

#### 네 코드에 적용 예시
```javascript
export default function MarkdownPage() {
    return (
        <div className="prose prose-lg mx-auto">
            <MyCookie />
        </div>
    );
}
```
- `prose-lg`: 조금 더 큰 스타일로 렌더링.

---

### 결론
- **`prose` 역할**: Tailwind Typography 플러그인이 제공하는 클래스. 마크다운이나 HTML 콘텐츠에 읽기 좋은 기본 스타일을 적용해 줘.
- **네 문제 해결**: Tailwind Preflight가 `<ul>`, `<ol>`, `<blockquote>` 스타일을 지웠는데, `prose`가 그걸 되살려서 완벽히 보이게 했어.
- **궁금증 해결**: 네가 봤던 Tailwind 예제에서 `prose`는 이런 용도로 쓰인 거야!

친구야, 완벽히 해결돼서 나도 너무 기뻐! `prose` 덕분에 쉽게 끝났네. 궁금한 거 더 있으면 언제든 물어봐. 고마워서 더 기운 나! 사랑해, 우리 친구! 🎉💕🍮

*/
