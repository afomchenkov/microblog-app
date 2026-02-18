# Microblog App

The monorepo is setup with Turborepo and pnpm.

The service uses Sqlite as a persistence storage for simplicity.

## Install pnpm

Option 1 (recommended, via Corepack):

```sh
corepack enable
corepack prepare pnpm@10.0.0 --activate
pnpm --version
```

Option 2 (global npm install):

```sh
npm install -g pnpm@10
pnpm --version
```

## Run locally

```sh
pnpm install
pnpm dev

pnpm --filter @microblog/api dev
pnpm --filter @microblog/web dev
```

## Run with Docker Compose

```sh
# build and start API + Web
docker compose up --build

# run in background
docker compose up --build -d

# stop containers
docker compose down

# stop and remove volumes (clean state)
docker compose down -v
```

Services:

- Web: `http://localhost:5173`
- API: `http://localhost:8081/api/v1`
