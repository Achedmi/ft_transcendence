FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install


COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]
