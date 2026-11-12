// Cambia el proveedor de base de datos del esquema Prisma.
// Uso: node scripts/switch-provider.js postgresql | sqlite
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const target = process.argv[2];
if (!["postgresql", "sqlite"].includes(target)) {
  console.error("Uso: node scripts/switch-provider.js postgresql|sqlite");
  process.exit(1);
}

const schemaPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../prisma/schema.prisma");
const schema = fs.readFileSync(schemaPath, "utf8");
const updated = schema.replace(
  /(datasource db \{\s*provider\s*=\s*)"(sqlite|postgresql)"/,
  `$1"${target}"`
);
fs.writeFileSync(schemaPath, updated);
console.log(`✔ Proveedor cambiado a "${target}". Ahora ejecuta: npm run db:generate`);
if (target === "postgresql") {
  console.log('  Recuerda definir DATABASE_URL="postgresql://usuario:clave@host:5432/rutatech"');
}
