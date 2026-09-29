# Dapursari IMS

Inventory Management System for Dapursari kitchen and warehouse operations.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js (`apps/web`) |
| Backend | NestJS (`apps/api`) |
| Database | Neon (PostgreSQL) |
| ORM | Prisma (`packages/database`) |
| Shared | `@dapursari/types`, ESLint & TypeScript configs |
| Package manager | pnpm workspaces |

## Repository structure

```text
dapursari-ims/
├── apps/
│   ├── web/                 # Next.js application
│   └── api/                 # NestJS API
├── packages/
│   ├── database/            # Prisma schema, migrations, client
│   ├── types/               # Shared TypeScript contracts
│   ├── eslint-config/
│   └── typescript-config/
├── docs/
│   └── modul-proyek.md      # Product module requirements
├── pnpm-workspace.yaml
└── package.json
```

## Prerequisites

- Node.js 20+ (22 recommended)
- pnpm 9+
- Neon PostgreSQL database and connection string

## Getting started

```bash
pnpm install

cp .env.example .env
cp .env.example packages/database/.env
# Set DATABASE_URL in both files

pnpm db:generate
pnpm db:migrate
pnpm types:build
pnpm dev
```

| Service | URL |
| --- | --- |
| Web | http://localhost:3000 |
| API | http://localhost:4000 |
| Health check | http://localhost:4000/health |

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start web and API in parallel |
| `pnpm --filter @dapursari/web dev` | Start frontend only |
| `pnpm --filter @dapursari/api dev` | Start backend only |
| `pnpm build` | Build workspace packages and apps |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:migrate` | Run Prisma migrations (dev) |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm types:build` | Build shared types package |

## Environment

Copy `.env.example` and provide at least:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
PORT=4000
CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Keep secrets out of git. `.env` files are ignored by default.

## IDE notes

Open the **repository root** in the editor so workspace TypeScript and ESLint resolve correctly.

Recommended extensions: ESLint, Prettier, Prisma, Tailwind CSS.

Workspace settings under `.vscode/` configure format-on-save and monorepo ESLint working directories.

## Package management

Use pnpm only in this repository. Do not mix with npm or yarn lockfiles.

```bash
pnpm add <package> --filter @dapursari/web
pnpm add <package> --filter @dapursari/api
```

## Documentation

- [Module requirements](./docs/modul-proyek.md)
