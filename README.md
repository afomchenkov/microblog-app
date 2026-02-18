# Microblog App

The monorepo is setup with Turborepo and pnpm.

The service uses Sqlite as a persistence storage for simplicity.

TODO:

```txt
- Connect proper persistence PostgreSQL/MySQl etc.
- Migrate UI to components library support, integrate Tailwind
- If app does not have specific requirements, migrate to Next.js
- Update the design and the layout of the UI columns
```

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

- Navigate to UI: `http://localhost:5173`
- API: `http://localhost:8081/api/v1`

<img width="982" height="608" alt="Screenshot 2026-02-18 at 12 42 25" src="https://github.com/user-attachments/assets/7979e303-b4d7-4fdd-b9b4-0a802838ba1e" />
