FROM node:latest

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run migrate

EXPOSE 8020

CMD ["npm", "start"]