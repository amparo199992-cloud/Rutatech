// Color de "línea" de cada etapa, como en un mapa de transporte.
export const STAGE_COLORS = {
  1: "#0e8a8a",
  2: "#e09b00",
  3: "#7048e8",
  4: "#2448d8",
  5: "#d6336c",
  6: "#12a58a",
};

export const stageColor = (order) => STAGE_COLORS[order] ?? "#2448d8";

export const LEVEL_LABEL = { principiante: "Principiante", intermedio: "Intermedio", avanzado: "Avanzado" };

export function formatDate(value) {
  return new Intl.DateTimeFormat("es", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function formatRelative(value) {
  const diff = (Date.now() - new Date(value).getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  if (diff < 60) return "hace un momento";
  if (diff < 3600) return rtf.format(-Math.round(diff / 60), "minute");
  if (diff < 86400) return rtf.format(-Math.round(diff / 3600), "hour");
  return rtf.format(-Math.round(diff / 86400), "day");
}
