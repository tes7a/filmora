import 'dotenv/config';

import { defineConfig } from 'prisma/config';

const fallbackDbUrl =
  'postgresql://postgres:postgres@localhost:5433/filmora?schema=public';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx ts-node prisma/seed.ts',
  },
  datasource: {
    // Allow local tooling (hooks/CI/typecheck) to run even if DIRECT_URL is not explicitly set.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? fallbackDbUrl,
  },
});
