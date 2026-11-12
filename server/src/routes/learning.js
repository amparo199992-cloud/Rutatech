// Acciones de aprendizaje (requieren sesión): completar lecciones, responder
// ejercicios y quizzes, checklist, proyectos y panel del usuario.
import { Router } from "express";
import { z } from "zod";
import { parseJson, prisma, toJson } from "../db.js";
import { badRequest, notFound } from "../lib/errors.js";
import { currentStreak, evaluateBadges, levelFor, motivationFor, POINTS, publicUser, recordActivity } from "../lib/gamification.js";
import { countedModules, getUserProgress, QUIZ_PASS_RATIO } from "../lib/progress.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
// Solo estas rutas exigen sesión; cualquier otra sigue de largo y termina en 404.
const PRIVATE = /^\/(lessons\/[^/]+\/complete|exercises\/\d+\/check|modules\/[^/]+\/(quiz|checklist)|projects\/[^/]+\/(submit|complete)|dashboard)$/;
router.use((req, res, next) => (PRIVATE.test(req.path) ? requireAuth(req, res, next) : next()));

// Respuesta común tras una acción: puntos, insignias nuevas y usuario actualizado.
async function afterAction(userId, pointsEarned = 0) {
  const progress = await getUserProgress(userId);
  const newBadges = await evaluateBadges(userId, progress);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return { pointsEarned, newBadges, user: publicUser(user) };
}

router.post("/lessons/:slug/complete", async (req, res) => {
  const lesson = await prisma.lesson.findUnique({ where: { slug: req.params.slug } });
  if (!lesson) throw notFound("Esa lección no existe.");
  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: req.userId, lessonId: lesson.id } },
  });
  if (existing) return res.json({ alreadyCompleted: true, ...(await afterAction(req.userId)) });

  await prisma.lessonProgress.create({ data: { userId: req.userId, lessonId: lesson.id } });
  await recordActivity(req.userId, { type: "lesson", message: `Completaste la lección «${lesson.title}»`, points: POINTS.lesson });
  res.json({ alreadyCompleted: false, ...(await afterAction(req.userId, POINTS.lesson)) });
});

const normalize = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const normalizeOutput = (s) =>
  String(s ?? "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();

function checkAnswer(exercise, submitted) {
  const answer = parseJson(exercise.answer, {});
  switch (exercise.type) {
    case "choice":
      return { correct: Number(submitted) === answer.index, reveal: { index: answer.index } };
    case "fill": {
      const values = Array.isArray(submitted) ? submitted : [submitted];
      const blanks = answer.blanks ?? [];
      const perBlank = blanks.map((accepted, i) => accepted.map(normalize).includes(normalize(values[i])));
      return { correct: blanks.length > 0 && perBlank.every(Boolean), perBlank, reveal: { blanks: blanks.map((b) => b[0]) } };
    }
    case "output": {
      const accepted = (answer.accepted ?? []).map(normalizeOutput);
      return { correct: accepted.includes(normalizeOutput(submitted)), reveal: { output: answer.accepted?.[0] } };
    }
    case "challenge":
      // El código se ejecuta en el navegador (entorno aislado) y aquí solo se registra el resultado.
      return { correct: submitted?.passed === true, reveal: answer.solution ? { solution: answer.solution } : {} };
    default:
      throw badRequest("Tipo de ejercicio desconocido.");
  }
}

router.post("/exercises/:id/check", validate(z.object({ answer: z.any() })), async (req, res) => {
  const exercise = await prisma.exercise.findUnique({ where: { id: Number(req.params.id) }, include: { lesson: true } });
  if (!exercise) throw notFound("Ese ejercicio no existe.");

  const { correct, perBlank, reveal } = checkAnswer(exercise, req.body.answer);
  const previous = await prisma.exerciseResult.findUnique({
    where: { userId_exerciseId: { userId: req.userId, exerciseId: exercise.id } },
  });
  const attempts = (previous?.attempts ?? 0) + 1;
  const firstTimeCorrect = correct && !previous?.correct;

  await prisma.exerciseResult.upsert({
    where: { userId_exerciseId: { userId: req.userId, exerciseId: exercise.id } },
    create: { userId: req.userId, exerciseId: exercise.id, correct, attempts },
    update: { correct: correct || Boolean(previous?.correct), attempts },
  });

  let pointsEarned = 0;
  if (firstTimeCorrect) {
    pointsEarned = exercise.points;
    await recordActivity(req.userId, {
      type: "exercise",
      message: `Resolviste un ejercicio de «${exercise.lesson.title}»`,
      points: pointsEarned,
    });
  }
  const showSolution = correct || attempts >= 2;
  res.json({
    correct,
    perBlank,
    attempts,
    explanation: exercise.explanation,
    solution: showSolution ? reveal : null,
    hint: !correct && attempts < 2 ? "Inténtalo una vez más. Después del segundo intento verás la solución." : null,
    ...(await afterAction(req.userId, pointsEarned)),
  });
});

router.post("/modules/:slug/quiz", validate(z.object({ answers: z.array(z.number().int().min(-1)) })), async (req, res) => {
  const mod = await prisma.module.findUnique({
    where: { slug: req.params.slug },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!mod || mod.questions.length === 0) throw notFound("Este módulo no tiene quiz.");
  if (req.body.answers.length !== mod.questions.length) {
    throw badRequest(`Responde las ${mod.questions.length} preguntas antes de enviar.`);
  }

  const results = mod.questions.map((q, i) => ({
    questionId: q.id,
    selected: req.body.answers[i],
    correctIndex: q.correctIndex,
    correct: req.body.answers[i] === q.correctIndex,
    explanation: q.explanation,
  }));
  const score = results.filter((r) => r.correct).length;
  const total = results.length;
  const passed = score / total >= QUIZ_PASS_RATIO;

  const [alreadyPassed, alreadyPerfect] = await Promise.all([
    prisma.quizAttempt.findFirst({ where: { userId: req.userId, moduleId: mod.id, passed: true } }),
    prisma.quizAttempt.findFirst({ where: { userId: req.userId, moduleId: mod.id, score: total } }),
  ]);
  await prisma.quizAttempt.create({
    data: { userId: req.userId, moduleId: mod.id, score, total, passed, answers: toJson(req.body.answers) },
  });

  let points = 0;
  if (passed && !alreadyPassed) points += POINTS.quizPass;
  if (score === total && !alreadyPerfect) points += POINTS.quizPerfect;
  await recordActivity(req.userId, {
    type: "quiz",
    message: `${passed ? "Aprobaste" : "Intentaste"} el quiz de «${mod.title}» (${score}/${total})`,
    points,
  });

  res.json({
    score,
    total,
    passed,
    passPercent: Math.round(QUIZ_PASS_RATIO * 100),
    results,
    message: passed
      ? score === total
        ? "¡Perfecto! Dominas este módulo."
        : "¡Aprobaste! Revisa las explicaciones de lo que fallaste."
      : "Aún no apruebas. Repasa las lecciones y vuelve a intentarlo: cada intento cuenta.",
    ...(await afterAction(req.userId, points)),
  });
});

router.put("/modules/:slug/checklist", validate(z.object({ checked: z.array(z.number().int().min(0)).max(50) })), async (req, res) => {
  const mod = await prisma.module.findUnique({ where: { slug: req.params.slug } });
  if (!mod) throw notFound("Ese módulo no existe.");
  const max = parseJson(mod.checklist, []).length;
  const checked = [...new Set(req.body.checked.filter((i) => i < max))].sort((a, b) => a - b);
  await prisma.checklistProgress.upsert({
    where: { userId_moduleId: { userId: req.userId, moduleId: mod.id } },
    create: { userId: req.userId, moduleId: mod.id, checked: toJson(checked) },
    update: { checked: toJson(checked) },
  });
  res.json({ checked });
});

const submissionSchema = z.object({
  repoUrl: z
    .string({ error: "Pega el enlace de tu repositorio." })
    .trim()
    .url("Escribe un enlace completo, por ejemplo https://github.com/tu-usuario/mi-proyecto")
    .refine((url) => /^https:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+/i.test(url), "El enlace debe ser de un repositorio de GitHub: https://github.com/usuario/repositorio"),
  notes: z.string().trim().max(1000, "Máximo 1000 caracteres.").optional(),
});

router.post("/projects/:slug/submit", validate(submissionSchema), async (req, res) => {
  const project = await prisma.project.findUnique({ where: { slug: req.params.slug } });
  if (!project) throw notFound("Ese proyecto no existe.");
  const previous = await prisma.projectSubmission.findUnique({
    where: { userId_projectId: { userId: req.userId, projectId: project.id } },
  });
  const submission = await prisma.projectSubmission.upsert({
    where: { userId_projectId: { userId: req.userId, projectId: project.id } },
    create: { userId: req.userId, projectId: project.id, repoUrl: req.body.repoUrl, notes: req.body.notes },
    update: { repoUrl: req.body.repoUrl, notes: req.body.notes, submittedAt: new Date() },
  });
  const points = previous ? 0 : POINTS.projectSubmit;
  await recordActivity(req.userId, {
    type: "project",
    message: `${previous ? "Actualizaste" : "Entregaste"} el proyecto «${project.title}»`,
    points,
  });
  res.json({ submission, ...(await afterAction(req.userId, points)) });
});

router.post("/projects/:slug/complete", async (req, res) => {
  const project = await prisma.project.findUnique({ where: { slug: req.params.slug } });
  if (!project) throw notFound("Ese proyecto no existe.");
  const submission = await prisma.projectSubmission.findUnique({
    where: { userId_projectId: { userId: req.userId, projectId: project.id } },
  });
  if (!submission) throw badRequest("Primero entrega el enlace de tu repositorio.");
  if (submission.status === "completed") return res.json({ submission, ...(await afterAction(req.userId)) });

  const updated = await prisma.projectSubmission.update({
    where: { id: submission.id },
    data: { status: "completed", completedAt: new Date() },
  });
  await recordActivity(req.userId, { type: "project", message: `Marcaste como completado «${project.title}»`, points: POINTS.projectComplete });
  res.json({ submission: updated, ...(await afterAction(req.userId, POINTS.projectComplete)) });
});

// ───────────── Panel del usuario ─────────────

function buildRecommendations(user, progress, review, streak) {
  const tips = [];
  const pendingMinutes = (stage) =>
    countedModules(stage, user.specializationSlug)
      .flatMap((m) => m.lessons)
      .filter((l) => !progress.state.completedLessons.has(l.id))
      .reduce((n, l) => n + l.minutes, 0);
  const remainingMinutes = progress.structure
    .flatMap((stage) => countedModules(stage, user.specializationSlug))
    .flatMap((m) => m.lessons)
    .filter((l) => !progress.state.completedLessons.has(l.id))
    .reduce((n, l) => n + l.minutes, 0);
  const current = progress.stages.find((s) => !s.completed);

  if (streak === 0 && user.longestStreak > 0) {
    tips.push("Tu racha se reinició. Hoy basta con una lección corta para empezar una nueva.");
  } else if (streak >= 3) {
    tips.push(`Llevas ${streak} días seguidos estudiando. ¡No rompas la cadena!`);
  }
  if (review.length > 0) {
    tips.push(`Tienes ${review.length} tema(s) para repasar. Repasar antes de avanzar fija lo aprendido.`);
  }
  if (current && user.weeklyHours) {
    const stage = progress.structure.find((s) => s.id === current.id);
    const stageRemaining = stage ? pendingMinutes(stage) : 0;
    // Las lecciones son la teoría; calculamos ~3x de práctica adicional.
    const weeks = Math.max(1, Math.ceil((stageRemaining * 4) / 60 / user.weeklyHours));
    if (stageRemaining > 0) {
      tips.push(`Con ${user.weeklyHours} h por semana, terminarás la etapa «${current.title}» en unas ${weeks} semana(s), contando la práctica.`);
    }
  }
  const stage4 = progress.stages.find((s) => s.order === 4);
  if (!user.specializationSlug && stage4 && stage4.percent >= 50) {
    tips.push("Vas muy bien en desarrollo web: es buen momento para explorar las especializaciones y elegir la tuya.");
  }
  if (user.goal) tips.push(`Recuerda tu meta: «${user.goal}». Cada lección te acerca.`);
  if (remainingMinutes === 0) tips.push("¡Completaste todas las lecciones! Enfócate en tus proyectos y tu portafolio.");
  return tips.slice(0, 4);
}

router.get("/dashboard", async (req, res) => {
  const userId = req.userId;
  const [user, progress, activity, badges, owned, submissions, failedExercises, counts] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    getUserProgress(userId),
    prisma.activity.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.badge.findMany({ orderBy: { order: "asc" } }),
    prisma.userBadge.findMany({ where: { userId } }),
    prisma.projectSubmission.findMany({ where: { userId }, include: { project: true }, orderBy: { submittedAt: "desc" } }),
    prisma.exerciseResult.findMany({
      where: { userId, correct: false },
      include: { exercise: { include: { lesson: { select: { slug: true, title: true } } } } },
      take: 10,
    }),
    Promise.all([
      prisma.lessonProgress.count({ where: { userId } }),
      prisma.exerciseResult.count({ where: { userId, correct: true } }),
    ]),
  ]);

  // Repaso: quizzes reprobados o con menos de 80 %, y ejercicios sin resolver.
  const review = [];
  for (const stage of progress.structure) {
    for (const mod of stage.modules) {
      const best = progress.state.bestQuiz.get(mod.id);
      if (best && best.score / best.total < 0.8) {
        review.push({
          type: "quiz",
          title: `Quiz de «${mod.title}»`,
          detail: `Tu mejor resultado: ${best.score}/${best.total}`,
          href: `/modulos/${mod.slug}/quiz`,
        });
      }
    }
  }
  for (const r of failedExercises) {
    review.push({
      type: "exercise",
      title: `Ejercicio de «${r.exercise.lesson.title}»`,
      detail: `${r.attempts} intento(s) sin resolver`,
      href: `/lecciones/${r.exercise.lesson.slug}`,
    });
  }

  const inProgress = progress.stages
    .flatMap((s) => s.modules.map((m) => ({ ...m, stageTitle: s.title })))
    .filter((m) => m.started && !m.completed);

  const ownedById = new Map(owned.map((o) => [o.badgeId, o.earnedAt]));
  const streak = currentStreak(user);

  res.json({
    user: publicUser(user),
    level: levelFor(user.points),
    motivation: motivationFor(),
    overall: progress.overall,
    stages: progress.stages.map(({ modules, ...s }) => ({ ...s, modulesCount: modules.length })),
    inProgress,
    next: progress.next,
    review: review.slice(0, 8),
    recommendations: buildRecommendations(user, progress, review, streak),
    stats: {
      lessonsCompleted: counts[0],
      exercisesCorrect: counts[1],
      quizzesPassed: progress.state.passedModules.size,
      projectsSubmitted: submissions.length,
      projectsCompleted: submissions.filter((s) => s.status === "completed").length,
      streak,
      longestStreak: user.longestStreak,
      points: user.points,
    },
    badges: badges.map((b) => ({ ...b, earnedAt: ownedById.get(b.id) ?? null })),
    activity,
    projects: submissions.map((s) => ({
      slug: s.project.slug,
      title: s.project.title,
      repoUrl: s.repoUrl,
      status: s.status,
      submittedAt: s.submittedAt,
    })),
  });
});

export default router;
