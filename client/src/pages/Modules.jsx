import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Container, ErrorState, LevelTag, Loading, PageHeader, ProgressBar } from "../components/ui.jsx";
import { useAuth } from "../lib/auth.jsx";
import { useSeo } from "../lib/seo.js";
import { stageColor } from "../lib/stages.js";
import { useFetch } from "../lib/useFetch.js";

const STAGE_OPTIONS = [
  ["", "Todas las etapas"],
  ["fundamentos", "1. Fundamentos"],
  ["python", "2. Python"],
  ["ciencias-computacion", "3. Ciencias de la computación"],
  ["desarrollo-web", "4. Desarrollo web"],
  ["especializacion", "5. Especialización"],
  ["portafolio-empleo", "6. Portafolio y empleo"],
];

export default function Modules() {
  useSeo("Explorar módulos", "Todos los módulos de RutaTech con su nivel, duración y lecciones.");
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const stage = params.get("etapa") ?? "";
  const level = params.get("nivel") ?? "";
  const [q, setQ] = useState(params.get("q") ?? "");
  const query = new URLSearchParams({ ...(stage && { stage }), ...(level && { level }), ...(params.get("q") && { q: params.get("q") }) });
  const { data, error, loading, reload } = useFetch(`/modules?${query}`, [user?.id]);

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  const selectClass = "min-h-12 rounded-xl border-2 border-ink/15 bg-white px-3 dark:border-white/15 dark:bg-night-2";

  return (
    <>
      <PageHeader title="Explorar módulos" intro="Busca un tema o filtra por etapa y nivel. Puedes leer cualquier lección aunque no hayas terminado las anteriores." />
      <Container className="py-10">
        <form
          role="search"
          className="flex flex-col gap-3 md:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            update("q", q.trim());
          }}
        >
          <label className="sr-only" htmlFor="buscar">
            Buscar módulos
          </label>
          <input
            id="buscar"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar: python, sql, git…"
            className="min-h-12 flex-1 rounded-xl border-2 border-ink/15 bg-white px-4 dark:border-white/15 dark:bg-night-2"
          />
          <label className="sr-only" htmlFor="f-etapa">
            Etapa
          </label>
          <select id="f-etapa" value={stage} onChange={(e) => update("etapa", e.target.value)} className={selectClass}>
            {STAGE_OPTIONS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="f-nivel">
            Nivel
          </label>
          <select id="f-nivel" value={level} onChange={(e) => update("nivel", e.target.value)} className={selectClass}>
            <option value="">Todos los niveles</option>
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
          <button className="min-h-12 rounded-xl bg-cobalt-500 px-5 font-semibold text-white hover:bg-cobalt-600">Buscar</button>
        </form>

        {loading && !data ? (
          <Loading />
        ) : error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : data.modules.length === 0 ? (
          <div className="mt-10 rounded-2xl border-2 border-dashed border-line p-8 text-center dark:border-night-3">
            <p className="text-lg font-semibold">No hay módulos con esos filtros.</p>
            <button className="mt-3 font-semibold text-cobalt-600 underline dark:text-cobalt-300" onClick={() => { setQ(""); setParams({}); }}>
              Quitar filtros
            </button>
          </div>
        ) : (
          <>
            <p className="mt-6 text-ink/65 dark:text-slate-400" aria-live="polite">
              {data.modules.length} módulo(s)
            </p>
            <ul className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data.modules.map((m) => {
                const color = stageColor(m.stage.order);
                return (
                  <li key={m.slug}>
                    <Link to={`/modulos/${m.slug}`} className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 hover:border-current dark:border-night-3 dark:bg-night-2" style={{ color: "inherit" }}>
                      <span className="text-sm font-semibold" style={{ color }}>
                        Etapa {m.stage.order}: {m.stage.title}
                        {m.specialization && ` (${m.specialization.title})`}
                      </span>
                      <span className="mt-2 font-display text-xl font-bold">{m.title}</span>
                      <span className="mt-2 flex-1 text-ink/75 dark:text-slate-300">{m.description}</span>
                      <span className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink/65 dark:text-slate-400">
                        <LevelTag level={m.level} />
                        {m.lessonsCount} lección(es), ~{m.minutes} min de lectura
                      </span>
                      {m.progress && (
                        <span className="mt-3 block">
                          <ProgressBar value={m.progress.percent} label={`Avance en ${m.title}`} color={color} size="sm" />
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Container>
    </>
  );
}
