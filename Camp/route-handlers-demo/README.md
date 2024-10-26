This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

##### Headers in Route Handlers

- Request Headers
    - first
    - second

1. User-Agent : which identifies the browser and operation sytem to the server.

   1. ### Request Headers

#### User-Agent

- **의미**: User-Agent 헤더는 클라이언트(브라우저 또는 기타 애플리케이션)가 서버에 자신을 식별하기 위해 사용하는 문자열입니다.
- **용도**: 서버는 이 정보를 사용하여 클라이언트의 브라우저 종류, 버전, 운영 체제 등을 파악할 수 있습니다. 이를 통해 서버는 클라이언트에 맞는 최적화된 콘텐츠를 제공할 수 있습니다.
- **예시**:

  ```plaintext
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3
  ```

#### Accept

- **의미**: Accept 헤더는 클라이언트가 처리할 수 있는 콘텐츠 유형을 서버에 알리는 데 사용됩니다.
- **용도**: 서버는 이 정보를 사용하여 클라이언트가 요청한 리소스를 적절한 형식으로 반환할 수 있습니다. 예를 들어, 클라이언트가 HTML, JSON, XML 등의 형식을 요청할 수 있습니다.
- **예시**:

  ```plaintext
  Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
  모든 종류의 MINE : */*
  ```

#### Authorization

- **의미**: Authorization 헤더는 클라이언트가 서버에 자신을 인증하기 위해 사용하는 헤더입니다.
- **용도**: 서버는 이 정보를 사용하여 클라이언트의 신원을 확인하고, 요청된 리소스에 대한 접근 권한을 부여할 수 있습니다. 주로 토큰 기반 인증이나 기본 인증 방식이 사용됩니다.
- **예시**:

  ```plaintext
  Authorization: Bearer <token>
  ```

이와 같이 각 헤더는 클라이언트와 서버 간의 통신에서 중요한 역할을 합니다. 추가로 궁금한 사항이 있으면 언제든지 말씀해 주세요!
2. Accept : which indicates the content types like text, video, or image formats that the client can process.
3. Authorization : header used by the client to authenticate itself to the server
   1. Authorization: Bearer <token>
   2. 클라이언트가 서버에게 자신을 인증하기 위해 사용하는 헤더
   3. 서버는 이 정보를 사용하여 클라이언트의 신원을 확인하고, 요청된 리소스에 대한 접근 권한을 부여할 수 있습니다. 주로 토큰 기반 인증이나 기본 인증 방식이 사용됨.

- Response Headers
    - These are sent from the server to the client,.
    - They provide information about the server and the data being sent in the response.

1. Content-Type
2.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
