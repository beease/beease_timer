FROM node:latest

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

RUN prisma migrate deploy
RUN prisma generate

EXPOSE 8020

CMD ["npm", "start"]