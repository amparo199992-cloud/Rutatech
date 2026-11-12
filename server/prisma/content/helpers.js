// Ayudantes para escribir el contenido del curso de forma compacta.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

// Lee un archivo Markdown con bloques <!-- @lesson clave --> y devuelve { clave: contenido }.
export function loadLessons(file) {
  const raw = fs.readFileSync(path.join(here, "lessons", file), "utf8");
  const parts = raw.split(/<!--\s*@lesson\s+([\w-]+)\s*-->/);
  const lessons = {};
  for (let i = 1; i < parts.length; i += 2) lessons[parts[i]] = parts[i + 1].trim();
  return lessons;
}

// Pregunta de quiz: q("¿Pregunta?", ["a", "b", "c", "d"], índiceCorrecto, "explicación")
export const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, explanation });

// Ejercicios
export const choice = (prompt, options, index, explanation) => ({
  type: "choice",
  prompt,
  data: { options },
  answer: { index },
  explanation,
});

// code usa ___ para cada espacio en blanco; blanks = [["aceptada", "alternativa"], ...]
export const fill = (prompt, code, blanks, explanation, language = "python") => ({
  type: "fill",
  prompt,
  data: { code, language },
  answer: { blanks },
  explanation,
});

export const output = (prompt, code, accepted, explanation, language = "python") => ({
  type: "output",
  prompt,
  data: { code, language },
  answer: { accepted },
  explanation,
});

// Reto con pruebas automáticas que se ejecutan en el navegador.
export const challenge = (prompt, { language = "python", functionName, starter, tests, solution }, explanation) => ({
  type: "challenge",
  prompt,
  data: { language, functionName, starter, tests },
  answer: { solution },
  explanation,
  points: 10,
});

export const res = (title, url, lang = "Español") => ({ title, url, lang });
