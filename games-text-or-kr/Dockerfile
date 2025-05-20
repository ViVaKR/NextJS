FROM node:slim AS builder

# 작업 디렉토리 설정
WORKDIR /app

# pnpm 설치 (Node 이미지에 기본 포함 안됨)
RUN npm install -g pnpm

# +++ OpenSSL 설치 추가 +++
# node:slim (Debian 기반) 이미지에 OpenSSL 개발 라이브러리 설치
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

# 의존성 파일 먼저 복사 (캐싱 활용)
COPY package.json pnpm-lock.yaml ./

# 프로덕션 의존성 포함 모든 의존성 설치
# pnpm fetch 만으로도 가능하지만, install 이 더 확실할 수 있음
RUN pnpm install --frozen-lockfile

# 나머지 소스 코드 복사
COPY . .

# 프로덕션 빌드 실행 (standalone output 생성)
RUN pnpm build

# ---- Stage 2: Production Runner ----
# 동일한 Node.js Alpine 버전을 런타임 환경으로 사용
FROM node:slim AS runner

# +++ 런타임용 OpenSSL 라이브러리 설치 (필요한 경우) +++
# Prisma Client 런타임이 OpenSSL을 필요로 할 수 있음
RUN apt-get update && apt-get install -y libssl3 && rm -rf /var/lib/apt/lists/*
# Debian 12(Bookworm) 기반 slim은 libssl3, 이전 버전은 libssl1.1

# 작업 디렉토리 설정
WORKDIR /app

# 프로덕션 환경임을 명시 (Next.js 최적화)
ENV NODE_ENV=production
# 컨테이너 내부에서 실행될 포트 (기본값 3000)
# ENV PORT=3000

# 빌드 스테이지에서 필요한 파일만 복사
# standalone 빌드 결과물 복사
COPY --from=builder /app/.next/standalone ./
# public 폴더 내용 복사 (있다면)
COPY --from=builder /app/public ./public
# static 빌드 결과물 복사
COPY --from=builder /app/.next/static ./.next/static

# 어플리케이션이 사용할 포트 노출 (기본 3000)
EXPOSE 3000

# 컨테이너 시작 시 실행될 명령어 (standalone 서버 실행)
CMD ["node", "server.js"]
