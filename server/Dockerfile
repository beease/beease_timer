FROM node:17-alpine

WORKDIR /time_api

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8030


CMD ["npm", "start"]