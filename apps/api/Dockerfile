FROM node:20-bullseye

# Native build toolchain for better-sqlite3
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    python3 python-is-python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY apps/api/package*.json ./apps/api/

COPY packages ./packages
COPY apps/api ./apps/api

WORKDIR /app/apps/api

ENV npm_config_build_from_source=true
ENV npm_config_fallback_to_build=true

RUN npm install

RUN node -e "require('better-sqlite3'); console.log('better-sqlite3 OK')"

RUN npm run build:npm

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
