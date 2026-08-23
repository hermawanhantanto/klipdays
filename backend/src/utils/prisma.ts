import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client.js';

// Supabase pooled connection (Session Pooler); migrations use DIRECT_URL via prisma.config.ts.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? '',
});

/**
 * Shared Prisma client instance backed by the PostgreSQL driver adapter.
 * Import this instead of constructing new `PrismaClient` instances.
 */
export const prisma = new PrismaClient({ adapter });
