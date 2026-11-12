import { Link } from "react-router";
import { stageColor } from "../lib/stages.js";

// El elemento distintivo de RutaTech: la ruta dibujada como una línea de transporte
// con una estación por etapa. Horizontal en escritorio, vertical en móvil.
const STATIONS = [
  { order: 1, short: "Fundamentos", label: "Fundamentos", weeks: "2–3 sem" },
  { order: 2, short: "Python", label: "Python", weeks: "8–10 sem" },
  { order: 3, short: "Ciencias de la computación", label: "Ciencias", weeks: "8–10 sem" },
  { order: 4, short: "Web y bases de datos", label: "Web y datos", weeks: "6–8 sem" },
  { order: 5, short: "Especialización", label: "Especialización", weeks: "10–18 sem" },
  { order: 6, short: "Portafolio y empleo", label: "Portafolio", weeks: "3–4 sem" },
];
// Posición de cada etiqueta [x, y, alineación], elegida para no cruzar la línea.
const LABELS = [
  [25, 342, "start"],
  [185, 342, "middle"],
  [260, 176, "middle"],
  [345, 262, "middle"],
  [447, 150, "start"],
  [520, 20, "middle"],
];

export function RouteLineHero({ stages = [] }) {
  const bySlug = Object.fromEntries(stages.map((s) => [s.order, s.slug]));
  const W = 560;
  const H = 380;
  // Trazado tipo metro: tramos rectos con esquinas a 45°.
  const points = [
    [40, 300],
    [185, 300],
    [260, 220],
    [345, 220],
    [425, 140],
    [520, 60],
  ];
  const path = "M" + points.map((p) => p.join(",")).join(" L");
  return (
    <figure className="relative">
      <ol className="sm:hidden" aria-label="Las seis etapas de la ruta">
        {STATIONS.map((st, i) => (
          <li key={st.order} className="relative flex items-center gap-4 pb-4 last:pb-0">
            {i < STATIONS.length - 1 && <span aria-hidden="true" className="absolute left-[15px] top-8 h-full w-[5px] rounded-full" style={{ background: stageColor(st.order) }} />}
            <span aria-hidden="true" className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[5px] bg-paper font-display font-bold dark:bg-night" style={{ borderColor: stageColor(st.order) }}>
              {st.order}
            </span>
            <span className="font-display text-lg font-semibold">{st.short}</span>
            <span className="ml-auto text-sm opacity-60">{st.weeks}</span>
          </li>
        ))}
      </ol>
      <svg viewBox={`0 0 ${W} ${H}`} className="hidden h-auto w-full sm:block" role="img" aria-labelledby="ruta-title ruta-desc">
        <title id="ruta-title">Mapa de la ruta RutaTech</title>
        <desc id="ruta-desc">Seis estaciones en orden: Fundamentos, Python, Ciencias de la computación, Web y bases de datos, Especialización, y Portafolio y empleo.</desc>
        <path d={path} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
        {points.slice(0, -1).map((p, i) => {
          const q = points[i + 1];
          const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
          return (
            <line
              key={i}
              x1={p[0]}
              y1={p[1]}
              x2={q[0]}
              y2={q[1]}
              stroke={stageColor(i + 1)}
              strokeWidth="12"
              strokeLinecap="round"
              className="route-draw"
              style={{ "--len": len, animationDelay: `${i * 0.22}s` }}
            />
          );
        })}
        {points.map(([x, y], i) => {
          const st = STATIONS[i];
          const lb = LABELS[i];
          return (
            <g key={st.order} className="station-pop" style={{ animationDelay: `${0.2 + i * 0.22}s` }}>
              <circle cx={x} cy={y} r="15" stroke={stageColor(st.order)} strokeWidth="6" className="fill-paper dark:fill-night" />
              <text x={x} y={y + 5} textAnchor="middle" className="fill-current font-display text-[14px] font-bold">
                {st.order}
              </text>
              <text x={lb[0]} y={lb[1]} textAnchor={lb[2]} className="fill-current font-display text-[15px] font-semibold">
                {st.label}
              </text>
              <text x={lb[0]} y={lb[1] + 16} textAnchor={lb[2]} className="fill-current text-[12px] opacity-60">
                {st.weeks}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="sr-only">
        {STATIONS.map((s) => (
          <span key={s.order}>
            <Link to={bySlug[s.order] ? `/etapas/${bySlug[s.order]}` : "/ruta"}>
              Etapa {s.order}: {s.short}
            </Link>{" "}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

// Versión vertical para la página de la ruta: cada estación muestra su avance.
export function StationMarker({ order, percent = 0, done }) {
  const color = stageColor(order);
  return (
    <span
      aria-hidden="true"
      className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[5px] bg-paper font-display text-lg font-extrabold dark:bg-night"
      style={{ borderColor: color, background: done ? color : undefined, color: done ? "white" : undefined }}
    >
      {done ? "✓" : order}
      {!done && percent > 0 && (
        <svg className="absolute -inset-[5px] h-12 w-12 -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="21.5" fill="none" stroke="var(--color-signal)" strokeWidth="5" strokeDasharray={`${(percent / 100) * 135} 135`} />
        </svg>
      )}
    </span>
  );
}
