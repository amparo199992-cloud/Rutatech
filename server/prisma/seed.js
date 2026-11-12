// Carga los datos iniciales: etapas, módulos, lecciones, ejercicios, quizzes,
// proyectos, especializaciones, recursos, insignias y la cuenta administradora.
// Es idempotente: puedes ejecutarlo varias veces sin duplicar datos ni borrar el progreso.
import bcrypt from "bcryptjs";
import { config } from "../src/config.js";
import { prisma } from "../src/db.js";
import badges from "./content/badges.js";
import { loadLessons } from "./content/helpers.js";
import projects from "./content/projects.js";
import resources from "./content/resources.js";
import stage1 from "./content/stage1.js";
import stage2 from "./content/stage2.js";
import stage3 from "./content/stage3.js";
import stage4 from "./content/stage4.js";
import stage5, { specializations } from "./content/stage5.js";
import stage6 from "./content/stage6.js";

const STAGES = [
  [stage1, "stage1.md"],
  [stage2, "stage2.md"],
  [stage3, "stage3.md"],
  [stage4, "stage4.md"],
  [stage5, "stage5.md"],
  [stage6, "stage6.md"],
];

const json = (v) => JSON.stringify(v ?? []);

function validate() {
  const problems = [];
  for (const [stage, file] of STAGES) {
    const texts = loadLessons(file);
    for (const mod of stage.modules) {
      if (mod.quiz.length !== 5) problems.push(`${mod.slug}: el quiz debe tener 5 preguntas (tiene ${mod.quiz.length})`);
      mod.quiz.forEach((qq, i) => {
        if (qq.correctIndex < 0 || qq.correctIndex >= qq.options.length) problems.push(`${mod.slug} pregunta ${i + 1}: índice correcto fuera de rango`);
      });
      for (const lesson of mod.lessons) {
        if (!texts[lesson.key]) problems.push(`Falta el contenido de la lección ${lesson.key} en ${file}`);
        for (const ex of lesson.exercises ?? []) {
          if (ex.type === "choice" && (ex.answer.index < 0 || ex.answer.index >= ex.data.options.length)) problems.push(`${lesson.key}: ejercicio con índice inválido`);
          if (ex.type === "fill" && (ex.data.code.match(/___/g)?.length ?? 0) !== ex.answer.blanks.length) problems.push(`${lesson.key}: la cantidad de ___ no coincide con las respuestas`);
        }
      }
    }
  }
  if (problems.length) {
    console.error("❌ El contenido tiene problemas:\n - " + problems.join("\n - "));
    process.exit(1);
  }
}

async function seedSpecializations() {
  const ids = {};
  for (const s of specializations) {
    const data = {
      order: s.order,
      title: s.title,
      description: s.description,
      duration: s.duration,
      icon: s.icon,
      skills: json(s.skills),
      technologies: json(s.technologies),
      roles: json(s.roles),
      projectIdeas: json(s.projectIdeas),
      resources: json(s.resources),
    };
    const row = await prisma.specialization.upsert({ where: { slug: s.slug }, create: { slug: s.slug, ...data }, update: data });
    ids[s.slug] = row.id;
  }
  return ids;
}

async function seedStages(specIds) {
  const stageIds = {};
  let counts = { modules: 0, lessons: 0, exercises: 0, questions: 0 };

  for (const [stage, file] of STAGES) {
    const texts = loadLessons(file);
    const stageData = {
      order: stage.order,
      title: stage.title,
      subtitle: stage.subtitle,
      description: stage.description,
      duration: stage.duration,
      icon: stage.icon,
      isSpecialization: Boolean(stage.isSpecialization),
    };
    const stageRow = await prisma.stage.upsert({ where: { slug: stage.slug }, create: { slug: stage.slug, ...stageData }, update: stageData });
    stageIds[stage.slug] = stageRow.id;

    for (const [mi, mod] of stage.modules.entries()) {
      const modData = {
        stageId: stageRow.id,
        specializationId: mod.specialization ? specIds[mod.specialization] : null,
        order: mi + 1,
        title: mod.title,
        description: mod.description,
        duration: mod.duration,
        level: mod.level,
        objectives: json(mod.objectives),
        checklist: json(mod.checklist),
        resources: json(mod.resources),
        published: true,
      };
      const modRow = await prisma.module.upsert({ where: { slug: mod.slug }, create: { slug: mod.slug, ...modData }, update: modData });
      counts.modules++;

      for (const [li, lesson] of mod.lessons.entries()) {
        const lessonData = {
          moduleId: modRow.id,
          order: li + 1,
          title: lesson.title,
          summary: lesson.summary,
          minutes: lesson.minutes,
          content: texts[lesson.key],
        };
        const lessonRow = await prisma.lesson.upsert({ where: { slug: lesson.key }, create: { slug: lesson.key, ...lessonData }, update: lessonData });
        counts.lessons++;

        const keys = [];
        for (const [ei, ex] of (lesson.exercises ?? []).entries()) {
          const key = `${lesson.key}-ej${ei + 1}`;
          keys.push(key);
          const exData = {
            lessonId: lessonRow.id,
            order: ei + 1,
            type: ex.type,
            prompt: ex.prompt,
            data: JSON.stringify(ex.data),
            answer: JSON.stringify(ex.answer),
            explanation: ex.explanation,
            points: ex.points ?? 5,
          };
          await prisma.exercise.upsert({ where: { key }, create: { key, ...exData }, update: exData });
          counts.exercises++;
        }
        await prisma.exercise.deleteMany({ where: { lessonId: lessonRow.id, key: { notIn: keys } } });
      }

      const qKeys = [];
      for (const [qi, qq] of mod.quiz.entries()) {
        const key = `${mod.slug}-p${qi + 1}`;
        qKeys.push(key);
        const qData = {
          moduleId: modRow.id,
          order: qi + 1,
          question: qq.question,
          options: JSON.stringify(qq.options),
          correctIndex: qq.correctIndex,
          explanation: qq.explanation,
        };
        await prisma.quizQuestion.upsert({ where: { key }, create: { key, ...qData }, update: qData });
        counts.questions++;
      }
      await prisma.quizQuestion.deleteMany({ where: { moduleId: modRow.id, key: { notIn: qKeys } } });
    }
  }
  return { stageIds, counts };
}

async function seedProjects(stageIds) {
  for (const [i, p] of projects.entries()) {
    const data = {
      stageId: stageIds[p.stage] ?? null,
      specialization: p.specialization ?? null,
      order: i + 1,
      title: p.title,
      summary: p.summary,
      difficulty: p.difficulty,
      estimatedHours: p.estimatedHours,
      technologies: json(p.technologies),
      steps: json(p.steps),
      criteria: json(p.criteria),
      improvements: json(p.improvements),
    };
    await prisma.project.upsert({ where: { slug: p.slug }, create: { slug: p.slug, ...data }, update: data });
  }
}

async function seedResources() {
  for (const [i, r] of resources.entries()) {
    const existing = await prisma.resource.findFirst({ where: { url: r.url } });
    const data = { ...r, order: i + 1 };
    if (existing) await prisma.resource.update({ where: { id: existing.id }, data });
    else await prisma.resource.create({ data });
  }
}

async function seedBadges() {
  for (const [i, b] of badges.entries()) {
    const data = { name: b.name, description: b.description, icon: b.icon, order: i + 1 };
    await prisma.badge.upsert({ where: { code: b.code }, create: { code: b.code, ...data }, update: data });
  }
}

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || !password) {
    console.log("ℹ  ADMIN_EMAIL/ADMIN_PASSWORD no definidos: no se creó cuenta administradora.");
    return;
  }
  if (config.isProd && password === "CambiaEsto123") {
    console.warn("⚠  En producción no se crea el administrador con la contraseña de ejemplo. Cambia ADMIN_PASSWORD.");
    return;
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.role !== "ADMIN") await prisma.user.update({ where: { id: existing.id }, data: { role: "ADMIN" } });
    console.log(`✔ Administrador existente: ${email}`);
    return;
  }
  await prisma.user.create({
    data: {
      email,
      name: process.env.ADMIN_NAME || "Administración RutaTech",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(password, 12),
    },
  });
  console.log(`✔ Administrador creado: ${email}`);
}

async function main() {
  validate();
  const specIds = await seedSpecializations();
  const { stageIds, counts } = await seedStages(specIds);
  await seedProjects(stageIds);
  await seedResources();
  await seedBadges();
  await seedAdmin();
  console.log(
    `✔ Contenido cargado: ${Object.keys(stageIds).length} etapas, ${counts.modules} módulos, ${counts.lessons} lecciones, ` +
      `${counts.exercises} ejercicios, ${counts.questions} preguntas, ${projects.length} proyectos, ` +
      `${specializations.length} especializaciones, ${resources.length} recursos y ${badges.length} insignias.`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
