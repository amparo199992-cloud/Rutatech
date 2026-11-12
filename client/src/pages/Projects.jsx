import { useState } from "react";
import { Link } from "react-router";
import { Container, ErrorState, LevelTag, Loading, PageHeader } from "../components/ui.jsx";
import { useAuth } from "../lib/auth.jsx";
import { useSeo } from "../lib/seo.js";
import { stageColor } from "../lib/stages.js";
import { useFetch } from "../lib/useFetch.js";

const STATUS = {
  submitted: { label: "Entregado", cls: "bg-signal-50 text-[#8a5a00] dark:bg-signal/15 dark:text-signal" },
  completed: { label: "Completado", cls: "bg-mint-50 text-mint-700 dark:bg-mint-700/20 dark:text-mint-500" },
};

export function ProjectList({ projects }) {
  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {projects.map((p) => (
        <li key={p.slug}>
          <Link
            to={`/proyectos/${p.slug}`}
            className="flex h-full flex-col rounded-2xl border border-line border-t-[6px] bg-white p-5 hover:shadow-md dark:border-night-3 dark:bg-night-2"
            style={{ borderTopColor: stageColor(p.stage?.order) }}
          >
            <span className="flex flex-wrap items-center gap-2">
              <LevelTag level={p.difficulty} />
              <span className="text-sm text-ink/65 dark:text-slate-400">~{p.estimatedHours} h</span>
              {p.status && <span className={`rounded-md px-2 py-0.5 text-sm font-semibold ${STATUS[p.status].cls}`}>{STATUS[p.status].label}</span>}
            </span>
            <span className="mt-3 font-display text-xl font-bold">{p.title}</span>
            <span className="mt-2 flex-1 text-ink/75 dark:text-slate-300">{p.summary}</span>
            <span className="mt-4 text-sm text-ink/65 dark:text-slate-400">{p.technologies.join(", ")}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Projects() {
  useSeo("Proyectos prácticos", "Proyectos guiados paso a paso con criterios de evaluación: desde tu primer repositorio hasta un proyecto final integrador.");
  const { user } = useAuth();
  const { data, error, loading, reload } = useFetch("/projects", [user?.id]);
  const [level, setLevel] = useState("");
  if (loading && !data) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const visible = data.projects.filter(
    (p) => (!level || p.difficulty === level) && (!p.specialization || !user?.specializationSlug || p.specialization === user.specializationSlug)
  );
  const groups = [];
  for (const p of visible) {
    const key = p.stage?.order ?? 0;
    let g = groups.find((x) => x.order === key);
    if (!g) groups.push((g = { order: key, title: p.stage?.title ?? "Otros", items: [] }));
    g.items.push(p);
  }

  return (
    <>
      <PageHeader title="Proyectos prácticos" intro="Cada proyecto tiene pasos, criterios de evaluación e ideas para mejorarlo. Cuando lo termines, sube el enlace de tu repositorio de GitHub.">
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por dificultad">
          {[
            ["", "Todos"],
            ["principiante", "Principiante"],
            ["intermedio", "Intermedio"],
            ["avanzado", "Avanzado"],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setLevel(v)}
              aria-pressed={level === v}
              className={`min-h-11 rounded-xl border-2 px-4 font-semibold ${level === v ? "border-cobalt-500 bg-cobalt-500 text-white" : "border-ink/15 dark:border-white/15"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </PageHeader>
      <Container className="space-y-12 py-12">
        {groups.map((g) => (
          <section key={g.order} aria-labelledby={`g-${g.order}`}>
            <h2 id={`g-${g.order}`} className="text-2xl font-bold">
              Etapa {g.order}: {g.title}
            </h2>
            <div className="mt-5">
              <ProjectList projects={g.items} />
            </div>
          </section>
        ))}
        {groups.length === 0 && <p className="text-lg">No hay proyectos con ese filtro.</p>}
      </Container>
    </>
  );
}
