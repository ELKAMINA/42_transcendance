#===================== Stage 1 : Building the image for production =====================

FROM node:19-alpine AS builder

WORKDIR /app

RUN apk update && \
    apk add openssl

COPY package*.json ./

COPY prisma ./prisma/

COPY tsconfig*.json ./

COPY start.prod.sh .

RUN chmod +x start.prod.sh

COPY . .
# To add our source code into the image

#for installing only production dependencies(and not dev dependencies)
RUN npm ci 

COPY --chown=node:node . .

USER node


#===================== Stage 2 : Running the container (This is Runtime) =====================

FROM node:19-alpine

WORKDIR /app

COPY --chown=node:node --from=builder /app/node_modules ./node_modules

COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/ ./

RUN npm run build

CMD ["sh", "./start.prod.sh"]