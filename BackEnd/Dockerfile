FROM node:12

WORKDIR /usr/src/app

COPY package-lock.json ./
COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm build

CMD ["npm", "start"]