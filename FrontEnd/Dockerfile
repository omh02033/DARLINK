FROM node:12

WORKDIR /usr/src/app

COPY yarn.lock ./
COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 3001

CMD ["yarn", "start"]