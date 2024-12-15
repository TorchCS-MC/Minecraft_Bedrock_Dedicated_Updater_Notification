FROM node:22.12-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

CMD ["node", "index.js"]
