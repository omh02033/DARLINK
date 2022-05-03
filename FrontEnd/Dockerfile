FROM node:14.15.1-alpine3.12
ARG BACK_URL

ENV REACT_APP_BACK_URL=${BACK_URL}

# 빌드된 산출물을 실행시키기 위해 필요한 serve 모듈
RUN npm install -g serve

# 작업 공간
WORKDIR /usr/src/app

# 빌드된 산출물 도커 이미지로 복사
RUN mkdir ./build
COPY ./build ./build

# 실행 명령어
ENTRYPOINT ["serve", "-s", "build"]
