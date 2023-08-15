#!/bin/sh

npx prisma db seed
npm run start:migrate:dev
