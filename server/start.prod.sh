#!/bin/sh

# if [ ! -d "/app/prisma/migrations" ] #checks whether a given file exist and is a directory
# then
	npm run prisma:dev:deploy && # One & means runs in the background
	node dist/src/main.js # && it executes only if cp -r worked 
# else
# 	npx prisma generate &
# 	node dist/src/main.js
# fi

