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

COPY start.sh ./

RUN chmod +x ./start.sh

EXPOSE 8020

CMD ["./start.sh"]