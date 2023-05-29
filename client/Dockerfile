FROM node:18-alpine

RUN mkdir /app

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps


COPY . .

# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
# # => Build the container
# FROM node:18-alpine as build

# # RUN mkdir /app/client

# WORKDIR /app/client

# COPY package*.json ./

# RUN npm install --legacy-peer-deps

# COPY . .

# RUN npm run build

# # EXPOSE 3000

# # CMD ["npm", "run", "start"]

# # => Run container
# FROM nginx:alpine

# COPY --from=build /app/client/build /usr/share/nginx/html

# RUN rm /etc/nginx/conf.d/default.conf

# COPY  nginx/nginx.conf /etc/nginx/conf.d

# EXPOSE 80

# # Start Nginx server
# CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]