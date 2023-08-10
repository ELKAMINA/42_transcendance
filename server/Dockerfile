# Stage 1 : Building the image

FROM node:18-alpine AS builder

WORKDIR /app/server

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install

COPY tsconfig*.json ./

COPY start.sh .

RUN chmod +x start.sh

COPY . .
# To add our source code into the image


EXPOSE 4001 
#Port inside the container. Only informational

RUN npm run build

# Stage 2 : Running the container (This is Runtime) 

FROM node:18-alpine

COPY --from=builder /app/server/node_modules ./node_modules
COPY --from=builder /app/server/package*.json ./
COPY --from=builder /app/server/tsconfig*.json ./
COPY --from=builder /app/server/dist ./dist
# 👇 copy prisma directory
COPY --from=builder /app/server/prisma ./prisma
COPY --from=builder /app/server/ ./

EXPOSE 4001 4003 4006 4010 5555

CMD ["sh", "./start.sh"]