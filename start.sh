#!/bin/bash

set -ex

/app/wait-for-it.sh db:3306
npx prisma migrate reset --force
exec npm run dev
