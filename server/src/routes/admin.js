// Panel de administración: CRUD genérico de contenido, usuarios y estadísticas.
// La configuración de cada entidad (ENTITIES) también la usa el frontend para
// dibujar los formularios, así hay una sola fuente de verdad.
import { Router } from "express";
import { z } from "zod";
import { parseJson, prisma } from "../db.js";
import { badRequest, notFound } from "../lib/errors.js";
import { levelFor } from "../lib/gamification.js";
import { requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(requireAdmin);

const LEVEL_OPTIONS = ["principiante", "intermedio", "avanzado"];

// Tipos de campo: text, textarea, markdown, number, boolean, select, list (string[]), json, relation
export const ENTITIES = {
  stages: {
    model: "stage",
    label: "Etapas",
    orderBy: { order: "asc" },
    columns: ["order", "title", "duration"],
    fields: [
      { name: "slug", label: "Identificador (slug)", type: "text", required: true },
      { name: "order", label: "Orden", type: "number", required: true },
      { name: "title", label: "Título", type: "text", required: true },
      { name: "subtitle", label: "Subtítulo", type: "text" },
      { name: "description", label: "Descripción", type: "textarea", required: true },
      { name: "duration", label: "Duración", type: "text", required: true },
      { name: "icon", label: "Icono (emoji)", type: "text" },
      { name: "isSpecialization", label: "Es la etapa de especialización", type: "boolean" },
    ],
  },
  specializations: {
    model: "specialization",
    label: "Especializaciones",
    orderBy: { order: "asc" },
    columns: ["order", "title", "duration"],
    fields: [
      { name: "slug", label: "Identificador (slug)", type: "text", required: true },
      { name: "order", label: "Orden", type: "number", required: true },
      { name: "title", label: "Título", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea", required: true },
      { name: "duration", label: "Duración estimada", type: "text", required: true },
      { name: "icon", label: "Icono (emoji)", type: "text" },
      { name: "skills", label: "Habilidades (una por línea)", type: "list" },
      { name: "technologies", label: "Tecnologías (una por línea)", type: "list" },
      { name: "roles", label: "Roles laborales (uno por línea)", type: "list" },
      { name: "projectIdeas", label: "Ideas de proyectos (una por línea)", type: "list" },
      { name: "resources", label: "Recursos (JSON: [{title, url, lang}])", type: "json" },
    ],
  },
  modules: {
    model: "module",
    label: "Módulos",
    orderBy: [{ stageId: "asc" }, { order: "asc" }],
    columns: ["order", "title", "level", "stageId"],
    filter: "stageId",
    fields: [
      { name: "slug", label: "Identificador (slug)", type: "text", required: true },
      { name: "stageId", label: "Etapa", type: "relation", relation: "stages", required: true },
      { name: "specializationId", label: "Especialización (solo etapa 5)", type: "relation", relation: "specializations" },
      { name: "order", label: "Orden", type: "number", required: true },
      { name: "title", label: "Título", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea", required: true },
      { name: "duration", label: "Duración estimada", type: "text", required: true },
      { name: "level", label: "Nivel", type: "select", options: LEVEL_OPTIONS, required: true },
      { name: "objectives", label: "Objetivos (uno por línea)", type: "list" },
      { name: "checklist", label: "Checklist de dominio (uno por línea)", type: "list" },
      { name: "resources", label: "Recursos (JSON: [{title, url, lang}])", type: "json" },
      { name: "published", label: "Publicado", type: "boolean", default: true },
    ],
  },
  lessons: {
    model: "lesson",
    label: "Lecciones",
    orderBy: [{ moduleId: "asc" }, { order: "asc" }],
    columns: ["order", "title", "minutes", "moduleId"],
    filter: "moduleId",
    fields: [
      { name: "slug", label: "Identificador (slug)", type: "text", required: true },
      { name: "moduleId", label: "Módulo", type: "relation", relation: "modules", required: true },
      { name: "order", label: "Orden", type: "number", required: true },
      { name: "title", label: "Título", type: "text", required: true },
      { name: "summary", label: "Resumen", type: "text" },
      { name: "minutes", label: "Minutos estimados", type: "number", required: true },
      { name: "content", label: "Contenido (Markdown)", type: "markdown", required: true },
    ],
  },
  exercises: {
    model: "exercise",
    label: "Ejercicios",
    orderBy: [{ lessonId: "asc" }, { order: "asc" }],
    columns: ["order", "type", "prompt", "lessonId"],
    filter: "lessonId",
    fields: [
      { name: "key", label: "Clave única", type: "text", required: true },
      { name: "lessonId", label: "Lección", type: "relation", relation: "lessons", required: true },
      { name: "order", label: "Orden", type: "number", required: true },
      { name: "type", label: "Tipo", type: "select", options: ["choice", "fill", "output", "challenge"], required: true },
      { name: "prompt", label: "Enunciado", type: "textarea", required: true },
      {
        name: "data",
        label: "Datos públicos (JSON)",
        type: "json",
        help: 'choice: {"options": [..]} · fill: {"code": "texto con ___", "language": "python"} · output: {"code": "...", "language": "python"} · challenge: {"language": "python|javascript", "functionName": "...", "starter": "...", "tests": [{"args": [..], "expected": ..}]}',
      },
      {
        name: "answer",
        label: "Respuesta privada (JSON)",
        type: "json",
        help: 'choice: {"index": 0} · fill: {"blanks": [["opción aceptada", "otra"]]} · output: {"accepted": ["salida"]} · challenge: {"solution": "código de ejemplo"}',
      },
      { name: "explanation", label: "Explicación", type: "textarea", required: true },
      { name: "points", label: "Puntos", type: "number", default: 5 },
    ],
  },
  questions: {
    model: "quizQuestion",
    label: "Preguntas de quiz",
    orderBy: [{ moduleId: "asc" }, { order: "asc" }],
    columns: ["order", "question", "moduleId"],
    filter: "moduleId",
    fields: [
      { name: "key", label: "Clave única", type: "text", required: true },
      { name: "moduleId", label: "Módulo", type: "relation", relation: "modules", required: true },
      { name: "order", label: "Orden", type: "number", required: true },
      { name: "question", label: "Pregunta", type: "textarea", required: true },
      { name: "options", label: "Opciones (una por línea)", type: "list", required: true },
      { name: "correctIndex", label: "Índice de la respuesta correcta (0 = primera)", type: "number", required: true },
      { name: "explanation", label: "Explicación", type: "textarea", required: true },
    ],
  },
  projects: {
    model: "project",
    label: "Proyectos",
    orderBy: { order: "asc" },
    columns: ["order", "title", "difficulty"],
    filter: "stageId",
    fields: [
      { name: "slug", label: "Identificador (slug)", type: "text", required: true },
      { name: "stageId", label: "Etapa", type: "relation", relation: "stages" },
      { name: "specialization", label: "Slug de especialización (opcional)", type: "text" },
      { name: "order", label: "Orden", type: "number", required: true },
      { name: "title", label: "Título", type: "text", required: true },
      { name: "summary", label: "Resumen", type: "textarea", required: true },
      { name: "difficulty", label: "Dificultad", type: "select", options: LEVEL_OPTIONS, required: true },
      { name: "estimatedHours", label: "Horas estimadas", type: "number" },
      { name: "technologies", label: "Tecnologías (una por línea)", type: "list" },
      { name: "steps", label: "Pasos (uno por línea)", type: "list" },
      { name: "criteria", label: "Criterios de evaluación (uno por línea)", type: "list" },
      { name: "improvements", label: "Ideas para mejorarlo (una por línea)", type: "list" },
    ],
  },
  resources: {
    model: "resource",
    label: "Recursos",
    orderBy: [{ order: "asc" }],
    columns: ["order", "title", "language", "level"],
    fields: [
      { name: "order", label: "Orden", type: "number" },
      { name: "title", label: "Título", type: "text", required: true },
      { name: "provider", label: "Proveedor", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea", required: true },
      { name: "url", label: "Enlace (https://...)", type: "text", required: true },
      { name: "level", label: "Nivel recomendado", type: "text", required: true },
      { name: "language", label: "Idioma", type: "text", required: true },
      { name: "category", label: "Categoría", type: "text", required: true },
      { name: "free", label: "Gratuito", type: "boolean", default: true },
    ],
  },
};

function getEntity(name) {
  const entity = ENTITIES[name];
  if (!entity) throw notFound("Entidad desconocida.");
  return entity;
}

function serialize(entity, row) {
  const out = { ...row };
  for (const f of entity.fields) {
    if (f.type === "list") out[f.name] = parseJson(row[f.name], []);
    if (f.type === "json") out[f.name] = parseJson(row[f.name], f.name === "resources" ? [] : {});
  }
  return out;
}

// Convierte y valida el cuerpo según la configuración de campos.
function parseInput(entity, body, { partial }) {
  const data = {};
  const errors = {};
  for (const f of entity.fields) {
    let value = body[f.name];
    const missing = value === undefined || value === null || value === "";
    if (missing) {
      if (partial && value === undefined) continue;
      if (f.required) {
        errors[f.name] = "Este campo es obligatorio.";
        continue;
      }
      if (f.type === "relation" || f.type === "text" || f.type === "textarea") data[f.name] = null;
      if (f.type === "list") data[f.name] = "[]";
      if (f.type === "boolean") data[f.name] = f.default ?? false;
      if (f.type === "number" && f.default !== undefined) data[f.name] = f.default;
      continue;
    }
    switch (f.type) {
      case "number":
      case "relation": {
        const n = Number(value);
        if (!Number.isInteger(n)) errors[f.name] = "Debe ser un número entero.";
        else data[f.name] = n;
        break;
      }
      case "boolean":
        data[f.name] = value === true || value === "true";
        break;
      case "select":
        if (!f.options.includes(value)) errors[f.name] = `Valor no permitido. Opciones: ${f.options.join(", ")}`;
        else data[f.name] = value;
        break;
      case "list": {
        const list = Array.isArray(value) ? value : String(value).split("\n");
        data[f.name] = JSON.stringify(list.map((s) => String(s).trim()).filter(Boolean));
        break;
      }
      case "json":
        try {
          data[f.name] = JSON.stringify(typeof value === "string" ? JSON.parse(value) : value);
        } catch {
          errors[f.name] = "JSON inválido. Revisa comillas y comas.";
        }
        break;
      default:
        data[f.name] = String(value);
    }
  }
  if (data.url && !/^https:\/\//.test(data.url)) errors.url = "El enlace debe empezar por https://";
  if (Object.keys(errors).length) throw badRequest("Revisa los campos marcados.", errors);
  return data;
}

// ───────────── Rutas ─────────────

router.get("/schema", (_req, res) => {
  res.json({
    entities: Object.fromEntries(
      Object.entries(ENTITIES).map(([key, e]) => [key, { label: e.label, columns: e.columns, filter: e.filter ?? null, fields: e.fields }])
    ),
  });
});

// Opciones para los selectores de relaciones.
router.get("/options", async (_req, res) => {
  const [stages, specializations, modules, lessons] = await Promise.all([
    prisma.stage.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true, order: true } }),
    prisma.specialization.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true } }),
    prisma.module.findMany({ orderBy: [{ stageId: "asc" }, { order: "asc" }], select: { id: true, title: true, stageId: true } }),
    prisma.lesson.findMany({ orderBy: [{ moduleId: "asc" }, { order: "asc" }], select: { id: true, title: true, moduleId: true } }),
  ]);
  res.json({
    stages: stages.map((s) => ({ id: s.id, label: `${s.order}. ${s.title}` })),
    specializations: specializations.map((s) => ({ id: s.id, label: s.title })),
    modules: modules.map((m) => ({ id: m.id, label: m.title, parentId: m.stageId })),
    lessons: lessons.map((l) => ({ id: l.id, label: l.title, parentId: l.moduleId })),
  });
});

router.get("/stats", async (_req, res) => {
  const weekAgo = new Date(Date.now() - 7 * 86_400_000);
  const [users, newUsers, activeUsers, lessonsDone, attempts, submissions, modules, lessons, topModules] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.activity.findMany({ where: { createdAt: { gte: weekAgo } }, select: { userId: true }, distinct: ["userId"] }),
    prisma.lessonProgress.count(),
    prisma.quizAttempt.findMany({ select: { score: true, total: true, passed: true } }),
    prisma.projectSubmission.count(),
    prisma.module.count(),
    prisma.lesson.count(),
    prisma.lessonProgress.groupBy({ by: ["lessonId"], _count: { lessonId: true }, orderBy: { _count: { lessonId: "desc" } }, take: 5 }),
  ]);
  const lessonTitles = await prisma.lesson.findMany({
    where: { id: { in: topModules.map((t) => t.lessonId) } },
    select: { id: true, title: true },
  });
  const titleById = new Map(lessonTitles.map((l) => [l.id, l.title]));
  const avg = attempts.length ? Math.round((attempts.reduce((n, a) => n + a.score / a.total, 0) / attempts.length) * 100) : 0;
  res.json({
    users,
    newUsers,
    activeUsers: activeUsers.length,
    lessonsCompleted: lessonsDone,
    quizAttempts: attempts.length,
    quizPassRate: attempts.length ? Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100) : 0,
    averageQuizScore: avg,
    projectSubmissions: submissions,
    content: { modules, lessons },
    topLessons: topModules.map((t) => ({ title: titleById.get(t.lessonId) ?? "—", completions: t._count.lessonId })),
  });
});

router.get("/users", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  const users = await prisma.user.findMany({
    where: q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }] } : {},
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { _count: { select: { lessonProgress: true, projectSubmissions: true, badges: true } } },
  });
  const totalLessons = await prisma.lesson.count();
  res.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      points: u.points,
      level: levelFor(u.points).name,
      lessonsCompleted: u._count.lessonProgress,
      progressPercent: totalLessons ? Math.round((u._count.lessonProgress / totalLessons) * 100) : 0,
      projects: u._count.projectSubmissions,
      badges: u._count.badges,
      specializationSlug: u.specializationSlug,
      lastActiveDay: u.lastActiveDay,
      createdAt: u.createdAt,
    })),
  });
});

router.patch("/users/:id", validate(z.object({ role: z.enum(["USER", "ADMIN"]) })), async (req, res) => {
  const id = Number(req.params.id);
  if (id === req.userId && req.body.role !== "ADMIN") throw badRequest("No puedes quitarte tu propio rol de administrador.");
  const user = await prisma.user.update({ where: { id }, data: { role: req.body.role } });
  res.json({ user: { id: user.id, role: user.role } });
});

router.get("/:entity", async (req, res) => {
  const entity = getEntity(req.params.entity);
  const where = {};
  if (entity.filter && req.query[entity.filter]) where[entity.filter] = Number(req.query[entity.filter]);
  const rows = await prisma[entity.model].findMany({ where, orderBy: entity.orderBy });
  res.json({ items: rows.map((r) => serialize(entity, r)) });
});

router.get("/:entity/:id", async (req, res) => {
  const entity = getEntity(req.params.entity);
  const row = await prisma[entity.model].findUnique({ where: { id: Number(req.params.id) } });
  if (!row) throw notFound();
  res.json({ item: serialize(entity, row) });
});

router.post("/:entity", async (req, res) => {
  const entity = getEntity(req.params.entity);
  const row = await prisma[entity.model].create({ data: parseInput(entity, req.body ?? {}, { partial: false }) });
  res.status(201).json({ item: serialize(entity, row) });
});

router.put("/:entity/:id", async (req, res) => {
  const entity = getEntity(req.params.entity);
  const row = await prisma[entity.model].update({
    where: { id: Number(req.params.id) },
    data: parseInput(entity, req.body ?? {}, { partial: true }),
  });
  res.json({ item: serialize(entity, row) });
});

router.delete("/:entity/:id", async (req, res) => {
  const entity = getEntity(req.params.entity);
  await prisma[entity.model].delete({ where: { id: Number(req.params.id) } });
  res.json({ ok: true });
});

export default router;
