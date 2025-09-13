# 베이스 이미지 설정
FROM jupyter/base-notebook:python-3.9.12

# pip 관련 패키지 업그레이드
RUN pip install --upgrade pip setuptools wheel

# 요구사항 복사 및 설치
COPY requirements.txt /opt/app/requirements.txt
RUN pip install --no-cache-dir -r /opt/app/requirements.txt

# 작업 디렉토리 설정 (Jupyter 노트북 기본 경로)
WORKDIR /home/jovyan/work
