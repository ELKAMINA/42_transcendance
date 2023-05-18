# This is a multi-stage Dockefile

FROM node:18-alpine AS builder

# These are Build steps : Kikou *****

# this is a builder instruction 


WORKDIR /app
# This instructs Docker to use this path as the default location for all subsequent commands. This way we do not have to type out full file paths but can use relative paths based on the working directory. All commands RUN/COPY are executed inside this directory

COPY ["package.json", "package-lock.json*", "./"]
COPY prisma ./prisma/

RUN npm install


COPY tsconfig*.json ./

COPY . .
# TO add our source code into the image

# ********** Kikouu

RUN npm run build

# Stage 2: This stage is used to run our application. It Copies from our builder image only files and folders required to run the Nest app.
FROM node:18-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/dist ./dist
# 👇 copy prisma directory
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/ ./

EXPOSE 4001

CMD ["npm", "run", "start:migrate:dev"]
# CMD is not executed during the build steps of your Docker image, rather than during executing the Docker container (docker run ... or docker-compose up).