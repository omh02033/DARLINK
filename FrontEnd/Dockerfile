FROM node:14.15.1-alpine3.12
ARG BACK_URL

RUN npm install -g serve

WORKDIR /usr/src/app

COPY package-lock.json ./
COPY package.json ./

RUN npm install

COPY . .

RUN REACT_APP_BACK_URL=${BACK_URL} \ 
  npm run build

EXPOSE 3000

ENTRYPOINT ["serve", "-s", "build"]
