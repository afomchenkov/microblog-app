FROM node:20-bullseye

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

RUN corepack enable
RUN corepack prepare pnpm@10.0.0 --activate
RUN pnpm -w install --frozen-lockfile
RUN pnpm -w rebuild better-sqlite3
RUN pnpm build:api

WORKDIR /app/apps/api
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
