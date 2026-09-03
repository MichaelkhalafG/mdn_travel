import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// PRISMA_LOG=1 prints every query with its duration (perf debugging)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.PRISMA_LOG === "1"
        ? [{ emit: "stdout", level: "query" }]
        : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
