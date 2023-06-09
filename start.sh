#!/bin/bash

# Start Docker Compose
docker-compose up &

# Wait for Docker containers to initialize (adjust the sleep time as needed)
sleep 10

# Change directory to 'server' and start migration
cd server
npm run start:migrate:dev &

# Change directory to 'client' and start the client
# cd ../client
# npm run start
