// Pruebas de la lógica de progreso y gamificación (no tocan la base de datos).
// Ejecuta: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { levelFor, previousDay } from "../src/lib/gamification.js";
import { computeProgress, moduleProgress, nextStep } from "../src/lib/progress.js";

test("levelFor asigna el nivel según los puntos", () => {
  assert.equal(levelFor(0).name, "Novato");
  assert.equal(levelFor(149).name, "Novato");
  assert.equal(levelFor(150).name, "Explorador");
  assert.equal(levelFor(2500).name, "Especialista");
  assert.equal(levelFor(2500).next, null);
  assert.equal(levelFor(75).progressToNext, 50);
});

test("previousDay maneja cambios de mes y año", () => {
  assert.equal(previousDay("2026-03-01"), "2026-02-28");
  assert.equal(previousDay("2026-01-01"), "2025-12-31");
});

const mod = (id, lessonIds, questions = 5, specialization = null) => ({
  id,
  slug: `m${id}`,
  title: `Módulo ${id}`,
  specialization: specialization ? { slug: specialization } : null,
  lessons: lessonIds.map((l) => ({ id: l, slug: `l${l}`, title: `Lección ${l}`, minutes: 10 })),
  _count: { questions },
});

const structure = [
  { id: 1, slug: "a", order: 1, title: "A", isSpecialization: false, modules: [mod(1, [1, 2]), mod(2, [3])] },
  { id: 2, slug: "esp", order: 2, title: "Esp", isSpecialization: true, modules: [mod(3, [4], 5, "web"), mod(4, [5, 6], 5, "datos")] },
];

const state = (lessons, passed = [], spec = null) => ({
  specializationSlug: spec,
  completedLessons: new Set(lessons),
  passedModules: new Set(passed),
  bestQuiz: new Map(),
});

test("moduleProgress cuenta lecciones y quiz", () => {
  const p = moduleProgress(structure[0].modules[0], state([1], [1]));
  assert.equal(p.units, 3);
  assert.equal(p.done, 2);
  assert.equal(p.percent, 67);
  assert.equal(p.completed, false);
});

test("la etapa de especialización solo cuenta la ruta elegida", () => {
  const withoutSpec = computeProgress(structure, state([1, 2, 3], [1, 2]));
  assert.equal(withoutSpec.stages[0].completed, true);
  assert.equal(withoutSpec.stages[1].needsChoice, true);
  const withSpec = computeProgress(structure, state([1, 2, 3, 4], [1, 2, 3], "web"));
  assert.equal(withSpec.stages[1].completed, true);
  assert.equal(withSpec.overall.percent, 100);
});

test("nextStep recomienda lección, quiz o especialización en orden", () => {
  assert.equal(nextStep(structure, state([])).lesson.slug, "l1");
  assert.equal(nextStep(structure, state([1, 2])).type, "quiz");
  assert.equal(nextStep(structure, state([1, 2, 3], [1, 2])).type, "specialization");
  assert.equal(nextStep(structure, state([1, 2, 3, 5, 6], [1, 2, 4], "datos")).type, "done");
});
