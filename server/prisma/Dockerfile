FROM node:18-alpine
# this is a builder instruction. What base image we would yo use for our app

RUN npm install -g --unsafe-perm @prisma/cli --save-dev

RUN mkdir /app

WORKDIR /app

COPY . ./prisma/

CMD ["npm", "run", "prisma:dev:deploy"]