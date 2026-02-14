# Microblog App

## Run dev

```sh
pnpm i
pnpm dev

pnpm --filter @microblog/api dev
pnpm --filter @microblog/web dev
```

## Publish package

> Publishing packages/shared to npm

```sh
# login
pnpm -C packages/shared npm whoami

# build it
pnpm --filter @microblog/shared build

# publish from the package folder
pnpm -C packages/shared publish --access public
```

Common add-ons:
Changesets for versioning/release automation (@changesets/cli)
GitHub Actions for publishing on tag / main merges
