// Cálculo de progreso por módulo, etapa y ruta completa.
// Unidad de progreso: cada lección completada + el quiz aprobado del módulo.
import { prisma } from "../db.js";

export const QUIZ_PASS_RATIO = 0.6; // 3 de 5 respuestas correctas

export async function loadStructure() {
  return prisma.stage.findMany({
    orderBy: { order: "asc" },
    include: {
      modules: {
        where: { published: true },
        orderBy: { order: "asc" },
        include: {
          specialization: { select: { slug: true, title: true } },
          lessons: { orderBy: { order: "asc" }, select: { id: true, slug: true, title: true, minutes: true, order: true } },
          _count: { select: { questions: true } },
        },
      },
    },
  });
}

export async function loadUserState(userId) {
  if (!userId) return null;
  const [user, lessons, attempts] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { specializationSlug: true } }),
    prisma.lessonProgress.findMany({ where: { userId }, select: { lessonId: true } }),
    prisma.quizAttempt.findMany({ where: { userId }, select: { moduleId: true, score: true, total: true, passed: true } }),
  ]);
  const best = new Map();
  for (const a of attempts) {
    const prev = best.get(a.moduleId);
    if (!prev || a.score / a.total > prev.score / prev.total) best.set(a.moduleId, a);
  }
  return {
    specializationSlug: user?.specializationSlug ?? null,
    completedLessons: new Set(lessons.map((l) => l.lessonId)),
    bestQuiz: best,
    passedModules: new Set(attempts.filter((a) => a.passed).map((a) => a.moduleId)),
  };
}

export function moduleProgress(mod, state) {
  const hasQuiz = (mod._count?.questions ?? 0) > 0;
  const lessonsTotal = mod.lessons.length;
  const lessonsDone = state ? mod.lessons.filter((l) => state.completedLessons.has(l.id)).length : 0;
  const quizPassed = state ? state.passedModules.has(mod.id) : false;
  const best = state?.bestQuiz.get(mod.id);
  const units = lessonsTotal + (hasQuiz ? 1 : 0);
  const done = lessonsDone + (quizPassed ? 1 : 0);
  return {
    lessonsTotal,
    lessonsDone,
    hasQuiz,
    quizPassed,
    bestScore: best ? { score: best.score, total: best.total } : null,
    units,
    done,
    percent: units ? Math.round((done / units) * 100) : 0,
    completed: units > 0 && done === units,
    started: done > 0,
  };
}

// Módulos que cuentan para el usuario: en la etapa de especialización solo cuenta la ruta elegida.
export function countedModules(stage, specializationSlug) {
  if (!stage.isSpecialization) return stage.modules;
  return stage.modules.filter((m) => m.specialization?.slug === specializationSlug);
}

export function computeProgress(structure, state) {
  const spec = state?.specializationSlug ?? null;
  let totalUnits = 0;
  let doneUnits = 0;

  const stages = structure.map((stage) => {
    const modules = countedModules(stage, spec).map((m) => ({ id: m.id, slug: m.slug, title: m.title, ...moduleProgress(m, state) }));
    let units = modules.reduce((n, m) => n + m.units, 0);
    const done = modules.reduce((n, m) => n + m.done, 0);
    const needsChoice = stage.isSpecialization && !spec;
    if (needsChoice) {
      // Sin ruta elegida estimamos el tamaño medio de una especialización.
      const tracks = new Map();
      for (const m of stage.modules) {
        const key = m.specialization?.slug ?? "general";
        tracks.set(key, (tracks.get(key) ?? 0) + moduleProgress(m, null).units);
      }
      units = tracks.size ? Math.round([...tracks.values()].reduce((a, b) => a + b, 0) / tracks.size) : 0;
    }
    totalUnits += units;
    doneUnits += done;
    return {
      id: stage.id,
      slug: stage.slug,
      order: stage.order,
      title: stage.title,
      isSpecialization: stage.isSpecialization,
      needsChoice,
      units,
      done,
      percent: units ? Math.round((done / units) * 100) : 0,
      completed: units > 0 && done === units && !needsChoice,
      modules,
    };
  });

  return {
    stages,
    overall: { units: totalUnits, done: doneUnits, percent: totalUnits ? Math.round((doneUnits / totalUnits) * 100) : 0 },
  };
}

// Siguiente paso recomendado: primera lección pendiente, luego el quiz del módulo.
export function nextStep(structure, state) {
  const spec = state?.specializationSlug ?? null;
  for (const stage of structure) {
    if (stage.isSpecialization && !spec) {
      return { type: "specialization", stage: { slug: stage.slug, title: stage.title } };
    }
    for (const mod of countedModules(stage, spec)) {
      for (const lesson of mod.lessons) {
        if (!state?.completedLessons.has(lesson.id)) {
          return {
            type: "lesson",
            stage: { slug: stage.slug, title: stage.title },
            module: { slug: mod.slug, title: mod.title },
            lesson: { slug: lesson.slug, title: lesson.title, minutes: lesson.minutes },
          };
        }
      }
      if (mod._count.questions > 0 && !state?.passedModules.has(mod.id)) {
        return { type: "quiz", stage: { slug: stage.slug, title: stage.title }, module: { slug: mod.slug, title: mod.title } };
      }
    }
  }
  return { type: "done" };
}

export async function getUserProgress(userId) {
  const [structure, state] = await Promise.all([loadStructure(), loadUserState(userId)]);
  return { structure, state, ...computeProgress(structure, state), next: nextStep(structure, state) };
}
