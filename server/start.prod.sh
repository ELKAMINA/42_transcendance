#!/bin/sh

# if [ ! -d "/app/prisma/migrations" ] #checks whether a given file exist and is a directory
# then
	# npm run prisma:dev:deploy && # One & means runs in the background
	npx prisma migrate deploy 
	npx prisma generate
	npx prisma db seed
	node dist/src/main.js 
# else
# 	npx prisma generate &
# 	node dist/src/main.js
# fi

