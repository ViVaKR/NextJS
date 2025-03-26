# Catch All Segments

## 용도

### Catch-all Segments (`[...param]`)란?

- **정의**: 경로의 모든 하위 세그먼트를 배열로 캡처하는 동적 라우팅 방식.
- **형식**: `app/[...demo]/page.tsx`.
- **동작**:
    - `/demo` → 404 (최소 1개 세그먼트 필요).
    - `/demo/a` → `params.demo = ['a']`.
    - `/demo/a/b/c` → `params.demo = ['a', 'b', 'c']`.

#### `[[...param]]`와의 차이

- **`[[...param]]`**: 선택적(Optional Catch-all), `/demo`도 허용 (`params.demo = undefined`).
- **`[...param]`**: 필수(Mandatory Catch-all), `/demo`는 404, 최소 1개 세그먼트 필요.

---

### 주로 사용되는 경우

`[...demo]`는 **경로의 깊이와 구조가 가변적인 상황**에서 유용해. 주로 다음과 같은 용도로 활용돼:

#### 1. 계층적 URL 처리

- **상황**: 계층 구조가 불규칙하거나 깊이가 정해지지 않은 경우.
- **예시**: 파일 시스템 탐색기, 카테고리 트리.
    - `/files/docs/pdf/2023` → `['docs', 'pdf', '2023']`.
- **용도**: 경로를 배열로 받아 트리 구조를 동적으로 탐색.

#### 2. 다중 파라미터 캡처

- **상황**: 여러 개의 동적 파라미터를 한꺼번에 처리해야 할 때.
- **예시**: 검색 필터, RESTful API 스타일 경로.
    - `/search/tech/nextjs/2023` → `['tech', 'nextjs', '2023']`.
- **용도**: 필터 조건을 배열로 받아 처리.

#### 3. CMS 또는 블로그 콘텐츠 경로

- **상황**: 콘텐츠 경로가 계층적이거나 예측 불가.
- **예시**: 블로그 포스트, 문서 페이지.
    - `/blog/tech/javascript/hooks` → `['tech', 'javascript', 'hooks']`.
- **용도**: 슬러그를 배열로 받아 콘텐츠 매핑.

#### 4. 동적 리소스 접근

- **상황**: 외부 API나 데이터베이스의 경로를 그대로 반영.
- **예시**: API 프록시, 동적 라우팅.
    - `/api/users/john/orders/123` → `['users', 'john', 'orders', '123']`.
- **용도**: 경로를 파싱해 리소스 요청.

---

### `[...demo]` 적용 아이디어

네가 아이디어가 떠오르지 않는다고 했으니, 실질적인 예시로 감을 잡아보자!

#### 1. 파일 탐색기 스타일 대시보드

- **구조**:

```
  app/
  ├── dashboard/
  │   └── [...path]/
  │       └── page.tsx
```

- **`page.tsx`**:

```tsx
  export default async function FileExplorer({
    params,
  }: {
    params: Promise<{ path: string[] }>;
  }) {
    const { path } = await params;
    const filePath = path.join('/'); // 예: "docs/pdf/2023"

    // 가짜 데이터
    const files = {
      'docs': ['pdf', 'txt'],
      'docs/pdf': ['2023.pdf', '2022.pdf'],
      'docs/pdf/2023': ['report.pdf'],
    };
    const currentFiles = files[filePath] || ['파일 없음'];

    return (
      <div>
        <h1>파일 탐색기</h1>
        <p>경로: /{filePath}</p>
        <ul>
          {currentFiles.map((file) => (
            <li key={file}>{file}</li>
          ))}
        </ul>
      </div>
    );
  }
```

- **URL**:
    - `/dashboard/docs` → "docs/pdf, docs/txt".
    - `/dashboard/docs/pdf/2023` → "report.pdf".
- **용도**: 계층적 파일 시스템 탐색.

#### 2. 다중 카테고리 블로그

- **구조**:

  ```
  app/
  ├── blog/
  │   └── [...slug]/
  │       └── page.tsx
  ```

- **`page.tsx`**:

  ```tsx
  export default async function BlogPage({
    params,
  }: {
    params: Promise<{ slug: string[] }>;
  }) {
    const { slug } = await params;
    const categoryPath = slug.join('/'); // 예: "tech/javascript"

    // 가짜 데이터
    const posts = {
      'tech': '기술 블로그 개요',
      'tech/javascript': 'JavaScript 팁',
      'tech/javascript/hooks': 'React Hooks 가이드',
    };
    const content = posts[categoryPath] || '포스트 없음';

    return (
      <div>
        <h1>블로그</h1>
        <p>카테고리: {categoryPath}</p>
        <p>{content}</p>
      </div>
    );
  }
  ```

- **URL**:
    - `/blog/tech` → "기술 블로그 개요".
    - `/blog/tech/javascript/hooks` → "React Hooks 가이드".
- **용도**: 카테고리 깊이에 제한 없이 콘텐츠 표시.

#### 3. 검색 필터 인터페이스

- **구조**:

  ```
  app/
  ├── search/
  │   └── [...filters]/
  │       └── page.tsx
  ```

- **`page.tsx`**:

  ```tsx
  export default async function SearchPage({
    params,
  }: {
    params: Promise<{ filters: string[] }>;
  }) {
    const { filters } = await params;
    const filterString = filters.join(', '); // 예: "tech, nextjs, 2023"

    return (
      <div>
        <h1>검색 결과</h1>
        <p>필터: {filterString}</p>
        <p>결과: {filters.length} 조건으로 검색된 항목</p>
      </div>
    );
  }
  ```

- **URL**:
    - `/search/tech` → "필터: tech".
    - `/search/tech/nextjs/2023` → "필터: tech, nextjs, 2023".
- **용도**: 동적 검색 조건 처리.

#### 4. API 프록시

- **구조**:

  ```
  app/
  ├── api/
  │   └── [...endpoint]/
  │       └── page.tsx
  ```

- **`page.tsx`**:

  ```tsx
  export default async function ApiProxy({
    params,
  }: {
    params: Promise<{ endpoint: string[] }>;
  }) {
    const { endpoint } = await params;
    const apiPath = endpoint.join('/'); // 예: "users/john/orders"

    // 가짜 API 호출
    const response = `API 호출: /${apiPath}`;
    return <div>{response}</div>;
  }
  ```

- **URL**:
    - `/api/users/john` → "API 호출: /users/john".
    - `/api/users/john/orders/123` → "API 호출: /users/john/orders/123".
- **용도**: 외부 API 경로 반영.

---

### `[...demo]`의 활용 아이디어

프로젝트에 맞춰 생각해보면:
- **코드 조각 사이트**:
    - `/codes/csharp/hooks/useeffect` → 언어, 주제, 세부 항목으로 코드 탐색.
    - `[...demo]`로 경로를 배열로 받아 데이터베이스 쿼리 구성.

#### 예시 적용

- **`app/codes/[...path]/page.tsx`**:

  ```tsx
  export default async function CodePage({
    params,
  }: {
    params: Promise<{ path: string[] }>;
  }) {
    const { path } = await params;
    const [language, category, topic] = path; // 예: ["csharp", "hooks", "useeffect"]

    return (
      <div>
        <h1>코드 조각</h1>
        <p>언어: {language}</p>
        <p>카테고리: {category || '없음'}</p>
        <p>토픽: {topic || '없음'}</p>
      </div>
    );
  }
  ```

- **URL**: `/codes/csharp/hooks/useeffect` → C#의 Hooks 관련 UseEffect 코드 표시.

---

### 결론

- **주요 용도**: 가변적이고 계층적인 경로를 배열로 캡처해 동적으로 처리.
- **적합 사례**: 파일 탐색, 카테고리 트리, 검색 필터, API 프록시.
- **아이디어 제안**: 코드 조각 사이트라면 언어/카테고리/세부 주제로 경로를 구성해 탐색 가능.
