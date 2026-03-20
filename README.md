# Filmora Monorepo

Monorepo for Filmora products:

- `apps/api` - NestJS API
- `apps/web` - Next.js web client
- `apps/docs` - Next.js admin/docs app (can be replaced with Refine admin)
- `packages/ui` - shared UI components
- `packages/eslint-config` - shared eslint configs
- `packages/typescript-config` - shared tsconfig presets

## Requirements

- Node.js 22+
- pnpm 9+
- Docker (for local Postgres)

## Install

```bash
pnpm install
```

## Environment

1. Copy root env:

```bash
cp .env.example .env
```

2. API-specific env (optional, if you prefer local app env):

```bash
cp apps/api/.env.example apps/api/.env
```

Local DB in Docker is exposed on `localhost:5433`.

## Local development

Start database:

```bash
docker compose up -d
```

Run all apps in dev mode:

```bash
pnpm dev
```

Run separately:

```bash
pnpm dev:api
pnpm dev:web
pnpm dev:admin
```

## Quality checks

```bash
pnpm format:check
pnpm lint
pnpm check-types
pnpm build
```

## Git hooks (Husky)

Pre-commit runs:

- branch name check (`feat/*`, `fix/*`, `refactor/*`, `chore/*`, `docs/*`, `test/*`)
- `lint-staged`
- `pnpm check-types`
- `pnpm format:check`

Commit message hook runs `commitlint` with allowed commit types:

- `feat`
- `fix`
- `refactor`
- `chore`
- `docs`
- `test`

Commit message examples:

- `feat: add recommendations endpoint`
- `fix: correct pagination in admin films`

## CI

Root workflow: `.github/workflows/ci.yml`

Pipeline steps:

1. install deps
2. format check
3. lint
4. type check
5. build

## Notes for upcoming Refine admin app

When you add Refine admin, create `apps/admin` and then:

1. Add scripts (`dev`, `build`, `lint`, `check-types`) in `apps/admin/package.json`.
2. Update `pnpm dev:admin` script in root `package.json` to `--filter=./apps/admin`.
3. Add app-level env vars with `NEXT_PUBLIC_` prefix when needed.
