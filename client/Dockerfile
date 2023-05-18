FROM node:18-alpine

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps


COPY . .

# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]