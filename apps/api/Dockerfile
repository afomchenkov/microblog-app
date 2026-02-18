FROM node:20-bullseye

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python-is-python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY . .

RUN pnpm config set ignore-scripts false
RUN pnpm --filter ./apps/api... install --frozen-lockfile

# force native build
ENV npm_config_build_from_source=true
RUN pnpm --filter ./apps/api rebuild better-sqlite3 --loglevel=debug

WORKDIR /app/apps/api
RUN node -e "require('better-sqlite3'); console.log('better-sqlite3 OK')"

WORKDIR /app
RUN pnpm build:api

WORKDIR /app/apps/api
ENV NODE_ENV=production

CMD ["pnpm", "start:prod"]
