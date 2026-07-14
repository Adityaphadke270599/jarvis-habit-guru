import { PrismaClient } from "@prisma/client";

/* Single Prisma client instance for the whole process.
 * Modules import `db` from here — never `new PrismaClient()` themselves. */

export const db = new PrismaClient({
  log: process.env.NODE_ENV === "production" ? ["warn", "error"] : ["query", "warn", "error"],
});
