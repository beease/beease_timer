FROM node:latest

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

RUN npx run migrate

EXPOSE 8020

CMD ["npm", "start"]