import { Link, useParams } from "react-router";
import { StationMarker } from "../components/RouteLine.jsx";
import { Container, ErrorState, LevelTag, Loading, PageHeader, ProgressBar } from "../components/ui.jsx";
import { useAuth } from "../lib/auth.jsx";
import { useSeo } from "../lib/seo.js";
import { stageColor } from "../lib/stages.js";
import { useFetch } from "../lib/useFetch.js";
import { ProjectList } from "./Projects.jsx";
import { SpecializationSummary, useChooseSpecialization } from "./Specializations.jsx";

export function ModuleRows({ modules, color }) {
  return (
    <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white dark:divide-night-3 dark:border-night-3 dark:bg-night-2">
      {modules.map((m, i) => (
        <li key={m.slug}>
          <Link to={`/modulos/${m.slug}`} className="flex flex-col gap-3 px-5 py-4 hover:bg-paper sm:flex-row sm:items-center dark:hover:bg-night">
            <span className="w-8 shrink-0 font-display text-lg font-bold" style={{ color }}>
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-lg font-semibold">{m.title}</span>
              <span className="block text-ink/70 dark:text-slate-400">{m.description}</span>
            </span>
            <span className="flex shrink-0 items-center gap-3 text-sm">
              <span className="text-ink/65 dark:text-slate-400">{m.duration}</span>
              <LevelTag level={m.level} />
            </span>
            {m.progress && (
              <span className="w-full shrink-0 sm:w-28">
                <ProgressBar value={m.progress.percent} label={`Avance en ${m.title}`} color={color} size="sm" />
                <span className="text-xs text-ink/60 dark:text-slate-400">{m.progress.completed ? "Completado" : `${m.progress.percent}%`}</span>
              </span>
            )}
          </Link>
        </li>
      ))}
    </ol>
  );
}

export default function StagePage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { data, error, loading, reload } = useFetch(`/stages/${slug}`, [user?.specializationSlug]);
  const { choose, saving } = useChooseSpecialization();
  useSeo(data?.stage.title, data?.stage.description);

  if (loading && !data) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const { stage, modules, projects, specializations } = data;
  const color = stageColor(stage.order);
  const chosenSlug = user?.specializationSlug;
  const visibleModules = stage.isSpecialization && chosenSlug ? modules.filter((m) => m.specialization?.slug === chosenSlug) : modules;

  return (
    <>
      <PageHeader title={`Etapa ${stage.order}: ${stage.title}`} intro={stage.description} color={color}>
        <p className="mt-4 font-semibold text-ink/70 dark:text-slate-400">Duración estimada: {stage.duration}</p>
      </PageHeader>
      <Container className="space-y-14 py-12">
        {stage.isSpecialization && (
          <section aria-labelledby="elige">
            <h2 id="elige" className="text-3xl font-bold">
              {chosenSlug ? "Tu especialización" : "Elige tu especialización"}
            </h2>
            {!user && <p className="mt-2 text-ink/75 dark:text-slate-300">Crea una cuenta para elegir una ruta y guardar tu progreso.</p>}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {specializations.map((s) => (
                <SpecializationSummary key={s.slug} spec={s} chosen={chosenSlug === s.slug} onChoose={(sp) => choose(sp, reload)} saving={saving} />
              ))}
            </div>
          </section>
        )}

        {(!stage.isSpecialization || chosenSlug) && (
          <section aria-labelledby="modulos">
            <div className="flex items-center gap-4">
              <StationMarker order={stage.order} />
              <h2 id="modulos" className="text-3xl font-bold">
                Módulos
              </h2>
            </div>
            <div className="mt-6">
              <ModuleRows modules={visibleModules} color={color} />
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section aria-labelledby="proyectos">
            <h2 id="proyectos" className="text-3xl font-bold">
              Proyectos de esta etapa
            </h2>
            <div className="mt-6">
              <ProjectList projects={stage.isSpecialization && chosenSlug ? projects.filter((p) => p.specialization === chosenSlug) : projects} />
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
