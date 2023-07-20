FROM node:alpine

WORKDIR /server

COPY package*.json ./

COPY prisma ./prisma/

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

# COPY
COPY . .

RUN npm install

RUN npx prisma generate

EXPOSE 8020

CMD npm start