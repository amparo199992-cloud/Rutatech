// Conexión a la base de datos con Prisma 7 + adaptadores de controlador.
// Elige el adaptador según DATABASE_URL: "file:" → SQLite, "postgres..." → PostgreSQL.
import { PrismaClient } from "@prisma/client";
import { config } from "./config.js";

async function createAdapter(url) {
  if (url.startsWith("file:")) {
    const { PrismaBetterSqlite3 } = await import("@prisma/adapter-better-sqlite3");
    return new PrismaBetterSqlite3({ url });
  }
  const { PrismaPg } = await import("@prisma/adapter-pg");
  return new PrismaPg({ connectionString: url });
}

export const prisma = new PrismaClient({ adapter: await createAdapter(config.databaseUrl) });

// Utilidades para los campos JSON guardados como texto.
export function parseJson(value, fallback) {
  if (value == null || value === "") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export const toJson = (value) => JSON.stringify(value ?? null);
