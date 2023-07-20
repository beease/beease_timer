FROM node:latest

WORKDIR /server

COPY package*.json ./

RUN npm install
RUN npm install -g prisma
COPY . .
# RUN prisma migrate deploy
RUN prisma generate

EXPOSE 8020

CMD ["npm", "start"]