#!/bin/bash

echo '@@ ./.env'
cat .env

echo '@@ ./src/app/config/vars.env.ts'
cat ./src/app/config/vars.env.ts

# find . -type d -name "node_modules" -prune -o -type f -name "*" -exec grep --color=auto -Hn "class" {} +
