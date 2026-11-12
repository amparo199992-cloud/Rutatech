import fs from "node:fs";
import path from "node:path";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { config } from "./config.js";
import { prisma } from "./db.js";
import { HttpError } from "./lib/errors.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import learningRoutes from "./routes/learning.js";
import userRoutes from "./routes/users.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1); // detrás del proxy de Render/Railway
  app.disable("x-powered-by");

  // Política de seguridad estricta para la app...
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          fontSrc: ["'self'", "data:"],
          connectSrc: ["'self'"],
          frameSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      originAgentCluster: false,
    })
  );
  app.use(compression());
  if (config.corsOrigins.length) {
    app.use(cors({ origin: config.corsOrigins, credentials: true }));
  }
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  // Defensa CSRF: toda petición que modifica datos debe ser JSON. Los formularios
  // de otros sitios no pueden enviar JSON sin pasar por CORS.
  app.use("/api", (req, _res, next) => {
    const type = String(req.headers["content-type"] ?? "");
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && !type.startsWith("application/json")) {
      return next(new HttpError(415, "Las peticiones deben enviarse como JSON."));
    }
    next();
  });

  app.get("/api/health", async (_req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, time: new Date().toISOString() });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api", contentRoutes);
  app.use("/api", learningRoutes);
  app.use("/api", (_req, _res, next) => next(new HttpError(404, "Ruta de la API no encontrada.")));

  // SEO: sitemap generado desde la base de datos.
  app.get("/sitemap.xml", async (_req, res) => {
    const [stages, modules, lessons, projects, specs] = await Promise.all([
      prisma.stage.findMany({ select: { slug: true } }),
      prisma.module.findMany({ where: { published: true }, select: { slug: true } }),
      prisma.lesson.findMany({ select: { slug: true } }),
      prisma.project.findMany({ select: { slug: true } }),
      prisma.specialization.findMany({ select: { slug: true } }),
    ]);
    const urls = [
      "/", "/ruta", "/modulos", "/proyectos", "/recursos", "/especializaciones",
      ...stages.map((s) => `/etapas/${s.slug}`),
      ...modules.map((m) => `/modulos/${m.slug}`),
      ...lessons.map((l) => `/lecciones/${l.slug}`),
      ...projects.map((p) => `/proyectos/${p.slug}`),
      ...specs.map((s) => `/especializaciones/${s.slug}`),
    ];
    res.type("application/xml").send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
        .map((u) => `  <url><loc>${config.siteUrl}${u}</loc></url>`)
        .join("\n")}\n</urlset>`
    );
  });

  // En producción, el mismo servidor entrega el frontend compilado (un solo servicio).
  if (fs.existsSync(config.clientDist)) {
    // ...y una política propia para el entorno aislado donde corre el código de los retos.
    app.get(["/sandbox.html", "/sandbox-runner.js"], (_req, res, next) => {
      res.setHeader(
        "Content-Security-Policy",
        "default-src 'none'; script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' blob: https://cdn.jsdelivr.net; " +
          "worker-src blob:; connect-src 'self' https://cdn.jsdelivr.net; style-src 'unsafe-inline'; frame-ancestors 'self'"
      );
      // El iframe aislado tiene origen opaco: necesita poder cargar su propio script.
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    });
    // Pyodide autoalojado (opcional): copia los archivos del paquete npm "pyodide" a client/public/pyodide.
    app.use("/pyodide", (_req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      next();
    }, express.static(path.join(config.clientDist, "pyodide"), { maxAge: "30d" }));
    app.use("/assets", express.static(path.join(config.clientDist, "assets"), { immutable: true, maxAge: "1y" }));
    app.use(express.static(config.clientDist, { index: false, maxAge: "1h" }));
    app.get("/{*splat}", (_req, res) => res.sendFile(path.join(config.clientDist, "index.html")));
  }

  // Manejo de errores centralizado con mensajes claros en español.
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ error: err.message, fields: err.details });
    }
    if (err?.type === "entity.parse.failed") {
      return res.status(400).json({ error: "El cuerpo de la petición no es JSON válido." });
    }
    if (err?.code === "P2002") {
      return res.status(409).json({ error: "Ya existe un registro con ese valor único (slug, clave o correo)." });
    }
    if (err?.code === "P2025") {
      return res.status(404).json({ error: "El registro no existe." });
    }
    if (err?.code === "P2003") {
      return res.status(400).json({ error: "La relación indicada no existe (revisa la etapa, módulo o lección)." });
    }
    console.error(err);
    res.status(500).json({ error: "Ocurrió un error inesperado. Inténtalo de nuevo en un momento." });
  });

  return app;
}
