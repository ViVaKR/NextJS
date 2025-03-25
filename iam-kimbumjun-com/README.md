# NEXT.js

## Run

```bash


pnpm dev
pnpm add --save-dev eslint-config-prettier
npm install @mui/icons-material @mui/material @emotion/styled @emotion/react
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

pnpm add @mui/material
pnpm add @emotion/react
pnpm add @emotion/styled

pnpm add @mui/icons-material
pnpm @mui/material
pnpm @emotion/styled
pnpm @emotion/react

pnpm add @mui/utils
pnpm @next/mdx @mdx-js/loader @mdx-js/react @types/mdx

pnpm install prisma --save-dev
pnpm install tsx --save-dev
pnpm install @prisma/extension-accelerate
pnpx prisma init
pnpx prisma migrate dev --name init

pnpx prisma db seed
pnpx prisma studio

openssl rand -base64 129 | tr -d '\n' | pbcopy
```

## Top-level folders

- app : App Router
- pages : Pages Router
- public : Static assets to be served
- src : Optional application source folder

## Top-level files

- next.config.js
- package.json
- instrumentation.ts
- middleware.ts : Next.js request middleware
- env : Environment variables
- env.local
- en.production
- env.development :
- eslintrc.json : Configuration file for ESLint
- gitignore
- next-env.d.ts : TypeScript declaration file for Next.js
- tsconfig.js ; Configuration file for TypeScript
- jsconfig.json : Configuration file for JavaScript

## Routin Files

- layout
- page
- loading : Loading UI
- not-found : Not found UI
- error : Error UI
- global-error
- template
- default : Parallel route fallback page

## Nested routes

- folder
- folder/folder : nested route segment

## Getting Started



## Root (`/`, **app/**)

## Dynamic routes

**[folder]**
**[...folder]**
**[[...folder]]**

---

## Route Groups and private folders

**(folder)**
**_folder**

---

## Parallel and Intercepted Routes

**folder**
**(.)folder**
**(..)folder**
**(..)(..)folder**
**(...)folder**

## Component hierarchy

- layout.js
- template.js
- error.js
- loading.js
- not-found.js
- page.js ro nested layout.js

## 병렬라우팅

- 동일 경로에서 여러 독립적인 콘텐츠를 동시에 렌더링하기 위해 설계됨
- 주요 목적
    - 복잡한 UI 분리
    - 단일 페이지에서 서로 다른 섹션(예:메뉴, 콘텐츠, 통계)을 독립적으로 관리.
    - 새로 고침 없이 동적 업데이트
    - 클라이언트 측 내비게이션으로 색션별 콘텐츠를 빠르게 전환.
    - 모듈와와 재사용성
    - 각 슬록(@folder)을 별도 파일로 분리해 코드 유지 보수성 상승
    - 상태유지
    - 페이지 이동없이 특정 섹션만 갱신하며 나머지 유지 가능

## Create Database (postgreSQL)

```bash
$ docker exec -it viv-postgres psql -U postgres

postgres=# create user bj with password 'Password<!>long';
postgres=# create database bj owner bj;
postgres=# grant all privileges on database bj to bj;
```

## Code First ORM (Prisma)

```bash
#
npm install prisma --save-dev
npm install @prisma/client
npx prisma init

#
# 개발 시에는 db push 사용
npx prisma db push

# 변경사항이 확정되면 SQL 추출
npx prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma.backup \
  --to-schema-datasource prisma/schema.prisma \
  --script > migration.sql

#
# 1. SQL 마이그레이션 파일만 생성
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > migrations/init.sql

# 2. 생성된 SQL 파일을 DBA나 권한 있는 관리자가 실행

# 3. 마이그레이션 기록 생성
npx prisma migrate resolve --applied init
pnpx prisma db push
```

## Hook

<pre>
 [ 훅의 핵심 개념 ]
- 함수형 프로그래밍: 클래스 없이 함수로 상태와 로직을 관리.
- 재사용성: 커스텀 훅으로 로직을 모듈화.
- 규칙: 훅은 컴포넌트 최상위에서만 호출해야 해(조건문, 반복문 안에서 호출 금지).

</pre>

>- useState

```tsx
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0); // 초기값 0

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}
```

>- useEffect

```tsx
'use client';
import { useState, useEffect } from 'react';

export default function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  return <div>{data ? data.message : '로딩 중...'}</div>;
}
```

>- useContext

```tsx
'use client';
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

function ThemedComponent() {
  const theme = useContext(ThemeContext);
  return <div>현재 테마: {theme}</div>;
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedComponent />
    </ThemeProvider>
  );
}
```

>- useReducer

```tsx
'use client';
import { useReducer } from 'react';

type State = { count: number };
type Action = { type: 'increment' } | { type: 'decrement' };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>카운트: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>증가</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>감소</button>
    </div>
  );
}
```

>- custom

```tsx
'use client';
import { useState, useEffect } from 'react';

function useFetch(url: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}

export default function DataComponent() {
  const { data, loading } = useFetch('/api/data');
  return <div>{loading ? '로딩 중...' : data.message}</div>;
}
```

>- 예시

```tsx
// app/page.tsx
import ClientComponent from '@/components/ClientComponent';

export async function getServerSideProps() {
  const initialData = await fetch('https://api.example.com/data').then(res => res.json());
  return { props: { initialData } };
}

export default function Page({ initialData }) {
  return <ClientComponent initialData={initialData} />;
}

// components/ClientComponent.tsx
'use client';
import { useState } from 'react';

export default function ClientComponent({ initialData }) {
  const [data, setData] = useState(initialData);
  return <div>{data.message}</div>;
}
```

## 카테고리

```csv
DisplayName, Name, Alias
------------------------
Angular HTML	angular-html
Angular TypeScript	angular-ts
Apache Conf	apache
AppleScript	applescript
AsciiDoc	asciidoc	adoc
Assembly	asm
Batch File	bat	batch
C	c
CMake	cmake
COBOL	cobol
CoffeeScript	coffee	coffeescript
C++	cpp	c++
C#	csharp	c#cs
CSS	css
CSV	csv
Dart	dart
Dockerfile	docker	dockerfile
Fluent	fluent	ftl
F#	fsharp	f#fs
Git Commit Message	git-commit
Git Rebase Message	git-rebase
Go	go
Ruby Haml	haml
HTML	html
HTML (Derivative)	html-derivative
HTTP	http
INI	ini	properties
Java	java
JavaScript	javascript	js
JSON	json
JSON5	json5
JSON with Comments	jsonc
JSON Lines	jsonl
JSX	jsx
Julia	julia	jl
Kotlin	kotlin	ktkts
LaTeX	latex
Less	less
LLVM IR	llvm
Log file	log
Lua	lua
Luau	luau
Makefile	make	makefile
Markdown	markdown	md
MATLAB	matlab
MDC	mdc
MDX	mdx
Mermaid	mermaid	mmd
MIPS Assembly	mipsasm	mips
Nginx	nginx
Pascal	pascal
Perl	perl
PHP	php
PL/SQL	plsql
PowerQuery	powerquery
PowerShell	powershell	psps1
Prisma	prisma
Protocol Buffer 3	proto	protobuf
Pug	pug	jade
Python	python	py
R	r
ASP.NET Razor	razor
Windows Registry Script	reg
RegExp	regexp	regex
Ruby	ruby	rb
Rust	rust	rs
SAS	sas
Sass	sass
Scala	scala
Scheme	scheme
SCSS	scss
Shell	shellscript	bashshshellzsh
Shell Session	shellsession	console
SQL	sql
SSH Config	ssh-config
Swift	swift
TOML	toml
TSV	tsv
TSX	tsx
TypeScript	typescript	ts
Visual Basic	vb	cmd
Vim Script	viml	vimvimscript
Vue	vue
Vue HTML	vue-html
WebAssembly	wasm
XML	xml
YAML	yaml	yml
Zig	zig
```

```tsx
  /*
      --> Suspense란?
      React.Suspense는 React에서 비동기 작업(예: 데이터 페칭, 코드 스플리팅)을 처리할 때 컴포넌트가 준비될 때까지 대기하고, 그동안 대체 UI(즉, fallback)를 보여주는 기능을 제공해. Next.js에서도 많이 활용되는데, 특히 서버 사이드 렌더링(SSR)과 클라이언트 사이드 렌더링(CSR)을 조화롭게 다룰 때 유용해.
*/

```
