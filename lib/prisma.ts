import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

if (typeof window === "undefined") {
  const adapter = new PrismaBetterSqlite3({
    url: "file:./prisma/dev.db",
  });
  prismaInstance = globalForPrisma.prisma || new PrismaClient({ adapter });
} else {
  prismaInstance = new PrismaClient();
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
