import { config } from "../config.js";
import { prisma } from "../db.js";

export const POINTS = {
  lesson: 10,
  exercise: 5,
  quizPass: 20,
  quizPerfect: 10,
  projectSubmit: 40,
  projectComplete: 20,
};

export const LEVELS = [
  { name: "Novato", min: 0, description: "Estás dando tus primeros pasos." },
  { name: "Explorador", min: 150, description: "Ya conoces el terreno y tienes buenas bases." },
  { name: "Constructor", min: 500, description: "Construyes programas y proyectos propios." },
  { name: "Practicante", min: 1100, description: "Aplicas lo aprendido con soltura." },
  { name: "Especialista", min: 2000, description: "Dominas tu ruta y estás listo para el mercado." },
];

export function levelFor(points) {
  let index = 0;
  LEVELS.forEach((lvl, i) => {
    if (points >= lvl.min) index = i;
  });
  const current = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  const progress = next ? Math.round(((points - current.min) / (next.min - current.min)) * 100) : 100;
  return { name: current.name, description: current.description, min: current.min, next, progressToNext: progress };
}

// Día calendario (AAAA-MM-DD) en la zona horaria configurada.
export function dayKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: config.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function previousDay(key) {
  const d = new Date(`${key}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

// La racha sigue viva si estudiaste hoy o ayer.
export function currentStreak(user) {
  const today = dayKey();
  if (user.lastActiveDay === today || user.lastActiveDay === previousDay(today)) return user.streak;
  return 0;
}

export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio,
    goal: user.goal,
    weeklyHours: user.weeklyHours,
    specializationSlug: user.specializationSlug,
    points: user.points,
    level: levelFor(user.points),
    streak: currentStreak(user),
    longestStreak: user.longestStreak,
    studiedToday: user.lastActiveDay === dayKey(),
    createdAt: user.createdAt,
  };
}

// Registra una acción de estudio: suma puntos, actualiza la racha y el historial.
export async function recordActivity(userId, { type, message, points = 0 }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const today = dayKey();
  let { streak, longestStreak } = user;
  if (user.lastActiveDay !== today) {
    streak = user.lastActiveDay === previousDay(today) ? streak + 1 : 1;
    longestStreak = Math.max(longestStreak, streak);
  }
  const [updated] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points }, streak, longestStreak, lastActiveDay: today },
    }),
    prisma.activity.create({ data: { userId, type, message, points } }),
  ]);
  return updated;
}

// Reglas de insignias. El catálogo (nombre, icono) vive en la tabla Badge.
const RULES = {
  "primera-leccion": (s) => s.lessons >= 1,
  "diez-lecciones": (s) => s.lessons >= 10,
  "veinticinco-lecciones": (s) => s.lessons >= 25,
  "primer-quiz": (s) => s.quizzesPassed >= 1,
  "quiz-perfecto": (s) => s.perfectQuizzes >= 1,
  "diez-ejercicios": (s) => s.exercisesCorrect >= 10,
  "racha-3": (s) => s.longestStreak >= 3,
  "racha-7": (s) => s.longestStreak >= 7,
  "racha-30": (s) => s.longestStreak >= 30,
  "primer-proyecto": (s) => s.projectsSubmitted >= 1,
  "tres-proyectos": (s) => s.projectsSubmitted >= 3,
  "ruta-elegida": (s) => Boolean(s.specializationSlug),
};

export async function evaluateBadges(userId, progress) {
  const [user, lessons, passedQuizzes, perfect, exercisesCorrect, projectsSubmitted, badges, owned] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.lessonProgress.count({ where: { userId } }),
      prisma.quizAttempt.findMany({ where: { userId, passed: true }, select: { moduleId: true }, distinct: ["moduleId"] }),
      prisma.quizAttempt.count({ where: { userId, passed: true, score: { equals: prisma.quizAttempt.fields.total } } }),
      prisma.exerciseResult.count({ where: { userId, correct: true } }),
      prisma.projectSubmission.count({ where: { userId } }),
      prisma.badge.findMany(),
      prisma.userBadge.findMany({ where: { userId }, select: { badgeId: true } }),
    ]);

  const stats = {
    lessons,
    quizzesPassed: passedQuizzes.length,
    perfectQuizzes: perfect,
    exercisesCorrect,
    projectsSubmitted,
    longestStreak: user.longestStreak,
    specializationSlug: user.specializationSlug,
  };
  const completedStages = new Set((progress?.stages ?? []).filter((s) => s.completed).map((s) => s.slug));
  const ownedIds = new Set(owned.map((o) => o.badgeId));

  const earned = badges.filter((badge) => {
    if (ownedIds.has(badge.id)) return false;
    if (badge.code.startsWith("etapa-")) return completedStages.has(badge.code.slice(6));
    return RULES[badge.code]?.(stats) ?? false;
  });

  for (const badge of earned) {
    await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
    await prisma.activity.create({ data: { userId, type: "badge", message: `Ganaste la insignia «${badge.name}»` } });
  }
  return earned.map(({ code, name, description, icon }) => ({ code, name, description, icon }));
}

const MOTIVATION = [
  "Cada experto fue alguna vez principiante. ¡Sigue así!",
  "Quince minutos al día valen más que tres horas una vez al mes.",
  "Equivocarse es parte de aprender: cada error te enseña algo.",
  "No compares tu capítulo 1 con el capítulo 20 de otra persona.",
  "Lo que hoy parece difícil, mañana te parecerá obvio.",
  "Programar es resolver problemas pequeños, uno detrás de otro.",
  "La constancia le gana al talento cuando el talento no es constante.",
];

export function motivationFor(date = new Date()) {
  const day = Math.floor(date.getTime() / 86_400_000);
  return MOTIVATION[day % MOTIVATION.length];
}
