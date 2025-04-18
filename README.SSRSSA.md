# SSR CSR

```tsx
'use client';
import { getDashboardItems } from '@/data/menu-items';
import { IMenu } from '@/interfaces/i-menu';
import { useState, useEffect } from 'react';

export default function MenuItemsComponent() {
  const [isClient, setIsClient] = useState(false);
  const items: IMenu[] = getDashboardItems();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col gap-4 px-2 py-4 text-2xl">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-1">
          {isClient ? (
            <span className="material-symbols-outlined mr-4">{item.icon}</span>
          ) : null}
          {item.title}
        </div>
      ))}
    </div>
  );
}
```

**궁금한 점**:
1. `useEffect(() => { setIsClient(true); }, []);`가 오류를 방지하려는 건가?
2. 이게 보편적이고 안정적인 코드 습관인가?
3. 주요 사용 목적은 뭔가?

---

### 답변

#### 1. 오류 발생 가능성과의 연관성

네 코드에서 `useEffect`와 `isClient`는 **서버 사이드 렌더링(SSR)**과 **클라이언트 사이드 렌더링(CSR)** 간의 불일치를 해결하려는 흔한 패턴이야. Next.js는 기본적으로 SSR을 지원하니까, 이 부분이 오류를 방지하는 데 중요한 역할을 해.

##### 왜 필요한가?

- **SSR 환경**: Next.js가 서버에서 컴포넌트를 렌더링할 때, `window`, `document` 같은 브라우저 전용 객체는 없어. 네 코드에서 `<span className="material-symbols-outlined">`는 Material Icons인데, 이게 클라이언트에서만 제대로 동작한다고 가정하면 SSR 중에 문제가 생길 수 있어.
- **`isClient`의 초기값 `false`**: 서버 렌더링 시 `isClient`는 `false`라서 `<span>`이 렌더링되지 않음 → 오류 방지.
- **`useEffect`로 `true` 설정**: 클라이언트로 넘어오면 `useEffect`가 실행돼 `isClient`가 `true`로 바뀌고, 아이콘이 렌더링됨.

##### 오류 가능성

- 만약 `useEffect` 없이 바로 `<span>`을 렌더링하면:
- SSR 중 Material Icons가 로드되기 전에 오류 발생 가능 (예: CSS나 폰트 로딩 문제).
- 클라이언트와 서버의 HTML 출력이 달라져 **Hydration 오류** 발생 가능 (`React hydration mismatch`).
- 네 코드처럼 `useEffect`를 쓰면 **SSR과 CSR 간 불일치를 방지**해서 안정성을 높여.

**결론**: 네 코드의 `useEffect`는 오류(특히 Hydration 오류)를 방지하려는 목적이 맞아.

---

#### 2. 보편적이고 안정적인 코드 습관인가?

**답변**: 네, 이건 Next.js나 React에서 SSR을 다룰 때 **널리 쓰이는 안정적인 패턴**이야. 특히 `'use client'`를 쓰는 클라이언트 컴포넌트에서 브라우저 전용 기능(예: Material Icons, `window` 객체)을 사용할 때 자주 봐.

##### 보편성 증거

- **Next.js 공식 문서**: "Client-Only Components" 섹션에서 SSR과 CSR 간 전환을 다룰 때 이런 방식 권장.
- **커뮤니티 관행**: Stack Overflow, GitHub 이슈에서 비슷한 패턴 많이 등장 (예: "Next.js hydration mismatch fix").
- **예시**: Tailwind CSS나 외부 아이콘 라이브러리(예: FontAwesome, Material Icons) 사용할 때 자주 써.

##### 안정성

- **Hydration 오류 방지**: 서버와 클라이언트의 렌더링 결과가 달라지는 걸 막아줘.
- **간단함**: 최소한의 코드로 문제를 해결하니까 유지보수도 쉬워.

---

#### 3. 주요 사용 목적 정리

`useEffect`와 `isClient`를 이렇게 쓰는 주요 목적은 다음과 같아:

1. **SSR과 CSR 동기화**:
   - 서버에서 렌더링할 땐 클라이언트 전용 요소(예: 아이콘)를 제외하고, 클라이언트에서만 추가.
   - 네 코드에서 `<span className="material-symbols-outlined">`가 그 예야.

2. **Hydration 오류 방지**:
   - Next.js가 서버에서 생성한 HTML과 클라이언트에서 렌더링한 DOM이 일치해야 Hydration이 성공해. `isClient`로 조건을 걸면 이 불일치를 피할 수 있어.

3. **클라이언트 전용 로직 실행**:
   - `useEffect`는 클라이언트에서만 실행되니까, 브라우저 환경에서만 필요한 작업(예: DOM 조작, 외부 라이브러리 초기화)을 안전하게 처리.

4. **성능 최적화 (간접적)**:
   - 서버에서 불필요한 렌더링을 줄여 초기 로드 속도 개선 가능.

##### 네 코드의 목적

- **Material Icons 로딩 보장**: `material-symbols-outlined` 클래스는 클라이언트에서 CSS/폰트가 로드된 후에만 제대로 표시돼. `isClient`로 이를 제어해서 오류 방지.
- **깔끔한 UX**: 서버 렌더링 시 아이콘 없이 텍스트만 보여주고, 클라이언트에서 아이콘을 추가해 자연스러운 전환.

---

### 개선 제안

네 코드가 이미 안정적이지만, 약간 더 깔끔하게 만들어볼게:

#### 개선된 코드

```tsx
'use client';
import { getDashboardItems } from '@/data/menu-items';
import { IMenu } from '@/interfaces/i-menu';
import { useState, useEffect } from 'react';

export default function MenuItemsComponent() {
  const [isMounted, setIsMounted] = useState(false); // 변수명 변경
  const items: IMenu[] = getDashboardItems();

  useEffect(() => {
    setIsMounted(true); // "Mounted"로 의미 명확히
  }, []);

  return (
    <div className="flex flex-col gap-4 px-2 py-4 text-2xl">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-1">
          {isMounted && ( // null 대신 &&로 간결하게
            <span className="material-symbols-outlined mr-4">{item.icon}</span>
          )}
          {item.title}
        </div>
      ))}
    </div>
  );
}
```

##### 변경 사항

1. **`isClient` → `isMounted`**:
   - 변수명을 "클라이언트인가?" 대신 "마운트됐는가?"로 바꿔 의미를 명확히 했어.
2. **`isClient ? ... : null` → `isMounted && ...`**:
   - 조건문 대신 논리 연산자로 간소화. 결과는 동일하지만 코드가 더 간결해.
3. **의미 강화**: 이 패턴이 "클라이언트 마운트 여부"를 체크하는 거라는 걸 더 잘 보여줘.

#### 더 간단한 대안

만약 Material Icons가 SSR에서도 문제없다면, `useEffect` 없이 바로 써도 돼:

```tsx
export default function MenuItemsComponent() {
  const items: IMenu[] = getDashboardItems();
  return (
    <div className="flex flex-col gap-4 px-2 py-4 text-2xl">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-1">
          <span className="material-symbols-outlined mr-4">{item.icon}</span>
          {item.title}
        </div>
      ))}
    </div>
  );
}
```

- **조건**: Material Icons CSS를 `global.css`나 `<head>`에 제대로 로드했는지 확인 (예: Google Fonts 링크).
