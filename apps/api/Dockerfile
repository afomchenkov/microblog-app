FROM node:20-bullseye

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python-is-python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

# Copy workspace manifests first for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
# If api depends on internal packages, copy their package.json too:
COPY packages ./packages
COPY apps ./apps

RUN pnpm config set ignore-scripts false

# Install api workspace + its workspace deps
RUN pnpm --filter ./apps/api... install --frozen-lockfile

# If you use pnpm v10 allow-build config, keep it in repo root:
# pnpm-workspace.yaml should include onlyBuiltDependencies: [better-sqlite3]

# Force native build (Linux)
ENV npm_config_build_from_source=true
RUN pnpm --filter ./apps/api rebuild better-sqlite3 --loglevel=debug

WORKDIR /app/apps/api
RUN node -e "require('better-sqlite3'); console.log('better-sqlite3 OK')"

WORKDIR /app
RUN pnpm build:api

WORKDIR /app/apps/api
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
