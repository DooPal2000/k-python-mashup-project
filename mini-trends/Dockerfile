# Node.js 22 기반 이미지
FROM node:22

# Corepack 활성화 (Node 22는 기본 활성화되어 있지만 안전하게 명시)
RUN corepack enable

# pnpm 버전 고정 (선택)
RUN corepack prepare pnpm@latest --activate

# 작업 디렉토리 생성
WORKDIR /usr/src/app

# package.json과 pnpm-lock.yaml 복사
COPY package.json pnpm-lock.yaml ./

# 의존성 설치 (생산 환경)
RUN pnpm install --frozen-lockfile

# 나머지 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 환경 변수
ENV NODE_ENV=production

# 실행 명령
CMD ["pnpm", "start"]