import path from "node:path";
import { fileURLToPath } from "node:url";

export const SERVER_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

try {
  process.loadEnvFile(path.join(SERVER_ROOT, ".env"));
} catch {
  // En la nube las variables llegan del entorno, no de un archivo.
}

const env = process.env;
const isProd = env.NODE_ENV === "production";

let jwtSecret = env.JWT_SECRET;
if (!jwtSecret || jwtSecret.startsWith("cambia-este")) {
  if (isProd) {
    throw new Error("JWT_SECRET es obligatorio en producción. Define uno largo y aleatorio.");
  }
  jwtSecret = "solo-desarrollo-no-usar-en-produccion";
  console.warn("⚠  JWT_SECRET no definido: usando un secreto de desarrollo.");
}

function resolveDatabaseUrl(url) {
  if (url.startsWith("file:")) {
    const file = url.slice(5);
    return "file:" + (path.isAbsolute(file) ? file : path.resolve(SERVER_ROOT, file));
  }
  return url;
}

export const config = {
  isProd,
  port: Number(env.PORT || 4000),
  databaseUrl: resolveDatabaseUrl(env.DATABASE_URL || "file:./prisma/dev.db"),
  jwtSecret,
  jwtExpiresDays: 7,
  clientUrl: (env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, ""),
  siteUrl: (env.SITE_URL || env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, ""),
  corsOrigins: (env.CORS_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean),
  cookieSameSite: (env.COOKIE_SAMESITE || "lax").toLowerCase(),
  timezone: env.APP_TIMEZONE || "America/Bogota",
  smtp: {
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 587),
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.MAIL_FROM || "RutaTech <no-responder@rutatech.local>",
  },
  clientDist: path.resolve(SERVER_ROOT, "../client/dist"),
};
