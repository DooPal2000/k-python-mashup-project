# Node.js 18 버전을 기반 이미지로 사용
FROM node:18

# 컨테이너 내부의 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json과 package-lock.json을 컨테이너로 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 나머지 소스 코드를 컨테이너로 복사
COPY . .

# 3000번 포트 노출
EXPOSE 3000

# 환경 변수 설정
ENV NODE_ENV=production

# 컨테이너 실행 시 실행할 명령어
CMD [ "npm", "run", "start" ]