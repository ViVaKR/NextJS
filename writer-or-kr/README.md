# Writer.Or.Kr

## Start

```bash
    brew link --overwrite pnpm
    npm list -g
    ncu -g
    corepack enable pnpm
    npx create-next-app@latest writer-or-kr --use-pnpm --api
    pnpm dev
```

## .env

- NEXT_PUBLIC_ 접두가가 붙은 공개 API 엔드포인드
- 민감하지 않은 정보, 모든 환경에 공통으로 적용되는 기본값
- Git Commit OK.

## .env.local

## 라우팅

- [slug], [...slug], [[...slug]]
- (group) : 그룹
- _lib : 라우팅할 수 없는 폴더, 안전한 장소

- 파일
    - layout
    - page
    - loading
    - not-found
    - error
    - global-error
    - route
    - template
    - default
