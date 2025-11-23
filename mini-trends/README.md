<div align="center">
  <img src="public/img/vegetable.png" alt="Tiny Inventory Management App Logo" width="200" height="200">
</div>

# 미니 재고관리 앱

이 프로젝트는 간단한 재고관리 시스템을 구현한 웹 애플리케이션입니다.

## 기술 스택

- Node.js
- Express
- MongoDB
- EJS (Embedded JavaScript templating)
- Bootstrap
- SweetAlert
- Docker & Docker Compose
- Nginx
- HTTPS (GoGetSSL)

## 주요 기능
- 재고 항목 추가, 조회, 수정, 삭제 (CRUD)
- 사용자 인증 및 권한 관리

## 배포 및 인프라 구조

### Docker 및 Docker Compose
<div align="center">
  <img src="https://blog.kakaocdn.net/dn/bx4IXv/btrZCqx0B0f/4wlJeMZqNPpAF6UpUnNDVK/img.jpg" alt="Docker compose image" width="200" height="200">
</div>

- 윈도우 환경에서 Docker Compose를 사용하여 애플리케이션 빌드
- 빌드된 Docker 이미지를 Docker Hub에 업로드
- 우분투 서버에서 Docker Compose를 사용하여 애플리케이션 실행
- 환경 변수 관리를 위해 두 개의 Docker Compose 파일 사용

### Nginx 웹 서버
<div align="center">
  <img src="https://blog.kakaocdn.net/dn/k9XzT/btqCMnyJfA4/BOB5x2OnIXDpGPCepCS141/img.png" alt="Kakao Blog Image" width="200" height="200">
</div>

- HTTP 및 HTTPS 트래픽 관리
- 우분투 서버에 직접 설치 및 구성 (Docker 컨테이너 외부에서 관리)

### SSL/TLS
<div align="center">
  <img src="https://asset.sslcert.co.kr/images/logo/GOGETSSL_Logo_2.png" alt="GoGetSSL Logo" width="200" height="100">
</div>

- GoGetSSL에서 구매한 유료 SSL 인증서 사용
- HTTPS를 통한 보안 연결 제공

