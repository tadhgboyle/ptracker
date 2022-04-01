#!/bin/bash

set -ex

chmod +x /app/wait-for-it.sh
/app/wait-for-it.sh db:3306
npx prisma migrate reset --force
exec npm run dev
