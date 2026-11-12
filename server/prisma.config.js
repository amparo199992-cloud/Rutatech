// Configuración de Prisma 7 (la URL de la base de datos ya no va en schema.prisma).
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";

const here = path.dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(path.join(here, ".env"));
} catch {
  // Sin archivo .env: se usan las variables del sistema (normal en la nube).
}

function resolveUrl(url) {
  url = url.trim();
  if (/^postgres(ql)?:/.test(url)) {
    const u = new URL(url);
    u.searchParams.delete("channel_binding"); // Neon lo agrega; no hace falta
    url = u.toString();
  }
  // Las rutas SQLite relativas se resuelven desde la carpeta server/.
  if (url.startsWith("file:") && !path.isAbsolute(url.slice(5))) {
    return "file:" + path.resolve(here, url.slice(5));
  }
  return url;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: resolveUrl(process.env.DATABASE_URL || "file:./prisma/dev.db"),
  },
});
