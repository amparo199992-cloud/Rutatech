// Contenido público: cualquiera puede leer la ruta, módulos y lecciones.
// Si hay sesión, las respuestas incluyen el progreso del usuario.
import { Router } from "express";
import { parseJson, prisma } from "../db.js";
import { notFound } from "../lib/errors.js";
import { LEVELS } from "../lib/gamification.js";
import { computeProgress, loadStructure, loadUserState, moduleProgress, nextStep } from "../lib/progress.js";
import { authOptional } from "../middleware/auth.js";

const router = Router();
router.use(authOptional);

const projectSummary = (p) => ({
  slug: p.slug,
  title: p.title,
  summary: p.summary,
  difficulty: p.difficulty,
  estimatedHours: p.estimatedHours,
  technologies: parseJson(p.technologies, []),
  specialization: p.specialization,
  stage: p.stage ? { slug: p.stage.slug, title: p.stage.title, order: p.stage.order } : null,
});

export const serializeSpecialization = (s) => ({
  slug: s.slug,
  order: s.order,
  title: s.title,
  description: s.description,
  duration: s.duration,
  icon: s.icon,
  skills: parseJson(s.skills, []),
  technologies: parseJson(s.technologies, []),
  roles: parseJson(s.roles, []),
  projectIdeas: parseJson(s.projectIdeas, []),
  resources: parseJson(s.resources, []),
});

router.get("/meta", async (_req, res) => {
  const badges = await prisma.badge.findMany({ orderBy: { order: "asc" } });
  res.json({ levels: LEVELS, badges });
});

router.get("/roadmap", async (req, res) => {
  const [structure, state, projects] = await Promise.all([
    loadStructure(),
    loadUserState(req.userId),
    prisma.project.findMany({ orderBy: { order: "asc" }, where: { stageId: { not: null } }, include: { stage: true } }),
  ]);
  const progress = computeProgress(structure, state);
  const stages = structure.map((stage, i) => ({
    slug: stage.slug,
    order: stage.order,
    title: stage.title,
    subtitle: stage.subtitle,
    description: stage.description,
    duration: stage.duration,
    icon: stage.icon,
    isSpecialization: stage.isSpecialization,
    progress: state ? progress.stages[i] : null,
    modules: (stage.isSpecialization && state?.specializationSlug
      ? stage.modules.filter((m) => m.specialization?.slug === state.specializationSlug)
      : stage.modules
    ).map((m) => ({
      slug: m.slug,
      title: m.title,
      duration: m.duration,
      level: m.level,
      lessonsCount: m.lessons.length,
      specialization: m.specialization,
      progress: state ? moduleProgress(m, state) : null,
    })),
    projects: projects.filter((p) => p.stageId === stage.id && !p.specialization).map(projectSummary),
  }));
  res.json({
    stages,
    overall: state ? progress.overall : null,
    next: state ? nextStep(structure, state) : null,
    specializationSlug: state?.specializationSlug ?? null,
  });
});

router.get("/stages/:slug", async (req, res) => {
  const stage = await prisma.stage.findUnique({
    where: { slug: req.params.slug },
    include: {
      modules: {
        where: { published: true },
        orderBy: { order: "asc" },
        include: { lessons: { select: { id: true } }, specialization: { select: { slug: true, title: true } }, _count: { select: { questions: true } } },
      },
      projects: { orderBy: { order: "asc" }, include: { stage: true } },
    },
  });
  if (!stage) throw notFound("Esa etapa no existe.");
  const state = await loadUserState(req.userId);
  const specializations = stage.isSpecialization
    ? (await prisma.specialization.findMany({ orderBy: { order: "asc" } })).map(serializeSpecialization)
    : [];
  res.json({
    stage: {
      slug: stage.slug,
      order: stage.order,
      title: stage.title,
      subtitle: stage.subtitle,
      description: stage.description,
      duration: stage.duration,
      icon: stage.icon,
      isSpecialization: stage.isSpecialization,
    },
    modules: stage.modules.map((m) => ({
      slug: m.slug,
      title: m.title,
      description: m.description,
      duration: m.duration,
      level: m.level,
      lessonsCount: m.lessons.length,
      specialization: m.specialization,
      progress: state ? moduleProgress(m, state) : null,
    })),
    projects: stage.projects.map(projectSummary),
    specializations,
    specializationSlug: state?.specializationSlug ?? null,
  });
});

router.get("/specializations", async (_req, res) => {
  const list = await prisma.specialization.findMany({ orderBy: { order: "asc" } });
  res.json({ specializations: list.map(serializeSpecialization) });
});

router.get("/specializations/:slug", async (req, res) => {
  const spec = await prisma.specialization.findUnique({
    where: { slug: req.params.slug },
    include: {
      modules: {
        where: { published: true },
        orderBy: { order: "asc" },
        include: { lessons: { select: { id: true } }, _count: { select: { questions: true } } },
      },
    },
  });
  if (!spec) throw notFound("Esa especialización no existe.");
  const [state, projects] = await Promise.all([
    loadUserState(req.userId),
    prisma.project.findMany({ where: { specialization: spec.slug }, orderBy: { order: "asc" }, include: { stage: true } }),
  ]);
  res.json({
    specialization: serializeSpecialization(spec),
    modules: spec.modules.map((m) => ({
      slug: m.slug,
      title: m.title,
      description: m.description,
      duration: m.duration,
      level: m.level,
      lessonsCount: m.lessons.length,
      progress: state ? moduleProgress(m, state) : null,
    })),
    projects: projects.map(projectSummary),
    chosen: state?.specializationSlug === spec.slug,
  });
});

router.get("/modules", async (req, res) => {
  const { stage, level, q } = req.query;
  const modules = await prisma.module.findMany({
    where: {
      published: true,
      ...(stage ? { stage: { slug: String(stage) } } : {}),
      ...(level ? { level: String(level) } : {}),
    },
    orderBy: [{ stage: { order: "asc" } }, { order: "asc" }],
    include: {
      stage: { select: { slug: true, title: true, order: true } },
      specialization: { select: { slug: true, title: true } },
      lessons: { select: { id: true, minutes: true } },
      _count: { select: { questions: true } },
    },
  });
  const state = await loadUserState(req.userId);
  const term = q ? String(q).toLowerCase() : "";
  res.json({
    modules: modules
      .filter((m) => !term || `${m.title} ${m.description}`.toLowerCase().includes(term))
      .map((m) => ({
        slug: m.slug,
        title: m.title,
        description: m.description,
        duration: m.duration,
        level: m.level,
        stage: m.stage,
        specialization: m.specialization,
        lessonsCount: m.lessons.length,
        minutes: m.lessons.reduce((n, l) => n + l.minutes, 0),
        progress: state ? moduleProgress(m, state) : null,
      })),
  });
});

async function findNextModule(mod) {
  const sameStage = await prisma.module.findFirst({
    where: {
      stageId: mod.stageId,
      published: true,
      order: { gt: mod.order },
      ...(mod.specializationId ? { specializationId: mod.specializationId } : {}),
    },
    orderBy: { order: "asc" },
    select: { slug: true, title: true },
  });
  if (sameStage) return sameStage;
  const nextStage = await prisma.stage.findFirst({
    where: { order: { gt: mod.stage.order } },
    orderBy: { order: "asc" },
    include: { modules: { where: { published: true, specializationId: null }, orderBy: { order: "asc" }, take: 1, select: { slug: true, title: true } } },
  });
  if (!nextStage) return null;
  if (nextStage.isSpecialization) return { slug: null, title: "Elige tu especialización", stageSlug: nextStage.slug };
  return nextStage.modules[0] ?? null;
}

router.get("/modules/:slug", async (req, res) => {
  const mod = await prisma.module.findUnique({
    where: { slug: req.params.slug },
    include: {
      stage: true,
      specialization: { select: { slug: true, title: true } },
      lessons: { orderBy: { order: "asc" }, select: { id: true, slug: true, title: true, summary: true, minutes: true, order: true } },
      _count: { select: { questions: true } },
    },
  });
  if (!mod || !mod.published) throw notFound("Ese módulo no existe.");
  const state = await loadUserState(req.userId);
  const checklist = req.userId
    ? await prisma.checklistProgress.findUnique({ where: { userId_moduleId: { userId: req.userId, moduleId: mod.id } } })
    : null;
  res.json({
    module: {
      slug: mod.slug,
      title: mod.title,
      description: mod.description,
      duration: mod.duration,
      level: mod.level,
      objectives: parseJson(mod.objectives, []),
      checklist: parseJson(mod.checklist, []),
      resources: parseJson(mod.resources, []),
      quizQuestions: mod._count.questions,
      stage: { slug: mod.stage.slug, title: mod.stage.title, order: mod.stage.order },
      specialization: mod.specialization,
    },
    lessons: mod.lessons.map((l) => ({
      slug: l.slug,
      title: l.title,
      summary: l.summary,
      minutes: l.minutes,
      completed: state ? state.completedLessons.has(l.id) : false,
    })),
    progress: state ? moduleProgress(mod, state) : null,
    checklistChecked: parseJson(checklist?.checked, []),
    nextModule: await findNextModule(mod),
  });
});

router.get("/modules/:slug/quiz", async (req, res) => {
  const mod = await prisma.module.findUnique({
    where: { slug: req.params.slug },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!mod) throw notFound("Ese módulo no existe.");
  // Nunca enviamos la respuesta correcta antes de que el usuario responda.
  res.json({
    module: { slug: mod.slug, title: mod.title },
    questions: mod.questions.map((q) => ({ id: q.id, question: q.question, options: parseJson(q.options, []) })),
  });
});

export function publicExercise(ex, result) {
  return {
    id: ex.id,
    type: ex.type,
    prompt: ex.prompt,
    data: parseJson(ex.data, {}),
    points: ex.points,
    result: result ? { correct: result.correct, attempts: result.attempts, explanation: result.correct ? ex.explanation : null } : null,
  };
}

router.get("/lessons/:slug", async (req, res) => {
  const lesson = await prisma.lesson.findUnique({
    where: { slug: req.params.slug },
    include: {
      exercises: { orderBy: { order: "asc" } },
      module: {
        include: {
          stage: { select: { slug: true, title: true } },
          lessons: { orderBy: { order: "asc" }, select: { id: true, slug: true, title: true, minutes: true } },
          _count: { select: { questions: true } },
        },
      },
    },
  });
  if (!lesson) throw notFound("Esa lección no existe.");
  const state = await loadUserState(req.userId);
  const results = req.userId
    ? await prisma.exerciseResult.findMany({ where: { userId: req.userId, exerciseId: { in: lesson.exercises.map((e) => e.id) } } })
    : [];
  const byExercise = new Map(results.map((r) => [r.exerciseId, r]));
  const siblings = lesson.module.lessons;
  const index = siblings.findIndex((l) => l.id === lesson.id);
  const next = siblings[index + 1];

  res.json({
    lesson: {
      slug: lesson.slug,
      title: lesson.title,
      summary: lesson.summary,
      content: lesson.content,
      minutes: lesson.minutes,
      completed: state ? state.completedLessons.has(lesson.id) : false,
    },
    exercises: lesson.exercises.map((ex) => publicExercise(ex, byExercise.get(ex.id))),
    module: {
      slug: lesson.module.slug,
      title: lesson.module.title,
      stage: lesson.module.stage,
      hasQuiz: lesson.module._count.questions > 0,
      lessons: siblings.map((l) => ({ slug: l.slug, title: l.title, minutes: l.minutes, completed: state ? state.completedLessons.has(l.id) : false })),
    },
    previous: index > 0 ? { slug: siblings[index - 1].slug, title: siblings[index - 1].title } : null,
    next: next
      ? { type: "lesson", slug: next.slug, title: next.title }
      : lesson.module._count.questions > 0
        ? { type: "quiz", slug: lesson.module.slug, title: `Quiz: ${lesson.module.title}` }
        : { type: "module", slug: lesson.module.slug, title: lesson.module.title },
  });
});

router.get("/projects", async (req, res) => {
  const projects = await prisma.project.findMany({ orderBy: [{ order: "asc" }], include: { stage: true } });
  const submissions = req.userId ? await prisma.projectSubmission.findMany({ where: { userId: req.userId } }) : [];
  const byProject = new Map(submissions.map((s) => [s.projectId, s]));
  res.json({
    projects: projects.map((p) => ({ ...projectSummary(p), status: byProject.get(p.id)?.status ?? null })),
  });
});

router.get("/projects/:slug", async (req, res) => {
  const p = await prisma.project.findUnique({ where: { slug: req.params.slug }, include: { stage: true } });
  if (!p) throw notFound("Ese proyecto no existe.");
  const submission = req.userId
    ? await prisma.projectSubmission.findUnique({ where: { userId_projectId: { userId: req.userId, projectId: p.id } } })
    : null;
  res.json({
    project: {
      ...projectSummary(p),
      steps: parseJson(p.steps, []),
      criteria: parseJson(p.criteria, []),
      improvements: parseJson(p.improvements, []),
    },
    submission,
  });
});

router.get("/resources", async (_req, res) => {
  const resources = await prisma.resource.findMany({ orderBy: [{ order: "asc" }, { title: "asc" }] });
  res.json({ resources });
});

export default router;
