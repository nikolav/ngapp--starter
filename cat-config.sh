#!/bin/bash

echo '@@ ./.env'
cat .env

echo '@@ ./src/app/config/vars.env.ts'
cat ./src/app/config/vars.env.ts

echo '@@ ./src/app/config/vars.env.development.ts'
cat ./src/app/config/vars.env.development.ts

echo '@@ ./src/app/config/vars.env.production.ts'
cat ./src/app/config/vars.env.production.ts

# find src -type d \( -name "node_modules" -o -name "dist" \) -prune -o -type f -name "*" -exec grep --color=auto -Hn "TOKEN" {} +
