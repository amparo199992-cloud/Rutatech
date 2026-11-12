import { Link } from "react-router";
import { StationMarker } from "../components/RouteLine.jsx";
import { ButtonLink, Container, ErrorState, LevelTag, Loading, PageHeader, ProgressBar } from "../components/ui.jsx";
import { useAuth } from "../lib/auth.jsx";
import { useSeo } from "../lib/seo.js";
import { stageColor } from "../lib/stages.js";
import { useFetch } from "../lib/useFetch.js";

export function NextStepLink({ next }) {
  if (!next) return null;
  if (next.type === "lesson")
    return (
      <ButtonLink to={`/lecciones/${next.lesson.slug}`} size="lg">
        Continuar: {next.lesson.title}
      </ButtonLink>
    );
  if (next.type === "quiz")
    return (
      <ButtonLink to={`/modulos/${next.module.slug}/quiz`} size="lg">
        Presentar el quiz de {next.module.title}
      </ButtonLink>
    );
  if (next.type === "specialization")
    return (
      <ButtonLink to={`/etapas/${next.stage.slug}`} size="lg">
        Elegir mi especialización
      </ButtonLink>
    );
  return (
    <ButtonLink to="/proyectos" size="lg" variant="success">
      ¡Ruta completada! Revisa tus proyectos
    </ButtonLink>
  );
}

export default function Roadmap() {
  useSeo("Ruta completa", "Las 6 etapas de RutaTech: fundamentos, Python, ciencias de la computación, desarrollo web, especialización y portafolio.");
  const { user } = useAuth();
  const { data, error, loading, reload } = useFetch("/roadmap", [user?.id]);

  if (loading && !data) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  return (
    <>
      <PageHeader
        title="La ruta completa"
        intro="Seis etapas en orden. La ruta base (etapas 1 a 4) toma unos 6 meses a 10 horas por semana; la especialización y el portafolio te preparan para tu primer empleo."
      >
        {data.overall ? (
          <div className="mt-8 max-w-xl">
            <div className="mb-2 flex justify-between font-semibold">
              <span>Tu avance en la ruta</span>
              <span>{data.overall.percent}%</span>
            </div>
            <ProgressBar value={data.overall.percent} label="Avance en la ruta completa" />
            <div className="mt-6">
              <NextStepLink next={data.next} />
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/registro" size="lg">
              Crear cuenta para guardar mi progreso
            </ButtonLink>
          </div>
        )}
      </PageHeader>

      <Container className="py-12">
        <ol className="relative">
          {data.stages.map((stage, i) => {
            const color = stageColor(stage.order);
            const p = stage.progress;
            const last = i === data.stages.length - 1;
            return (
              <li key={stage.slug} className="relative flex gap-5 pb-14 sm:gap-8">
                {!last && <span aria-hidden="true" className="absolute left-[22px] top-12 bottom-0 w-[6px] rounded-full" style={{ background: color }} />}
                <StationMarker order={stage.order} percent={p?.percent ?? 0} done={p?.completed} />
                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                      <Link to={`/etapas/${stage.slug}`} className="hover:underline">
                        Etapa {stage.order}: {stage.title}
                      </Link>
                    </h2>
                    <span className="font-semibold text-ink/70 dark:text-slate-400">{stage.duration}</span>
                  </div>
                  <p className="mt-2 max-w-3xl text-ink/80 dark:text-slate-300">{stage.description}</p>
                  {p && !p.needsChoice && (
                    <div className="mt-4 max-w-md">
                      <ProgressBar value={p.percent} label={`Avance en ${stage.title}`} color={color} size="sm" />
                      <p className="mt-1 text-sm text-ink/65 dark:text-slate-400">{p.percent}% completado</p>
                    </div>
                  )}

                  {stage.isSpecialization && !data.specializationSlug ? (
                    <div className="mt-5 rounded-2xl border-2 border-dashed p-5" style={{ borderColor: color }}>
                      <p className="font-semibold">Aquí eliges entre cinco rutas: desarrollo web, datos y análisis, ciberseguridad, soporte e infraestructura, o IA y automatización.</p>
                      <ButtonLink to={`/etapas/${stage.slug}`} variant="secondary" className="mt-4">
                        Comparar especializaciones
                      </ButtonLink>
                    </div>
                  ) : (
                    <ul className="mt-5 grid gap-2 md:grid-cols-2">
                      {stage.modules.map((m) => {
                        const mp = m.progress;
                        return (
                          <li key={m.slug}>
                            <Link
                              to={`/modulos/${m.slug}`}
                              className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 hover:border-current dark:border-night-3 dark:bg-night-2"
                            >
                              <span
                                aria-hidden="true"
                                className="h-4 w-4 shrink-0 rounded-full border-[3px]"
                                style={{ borderColor: color, background: mp?.completed ? color : mp?.started ? "var(--color-signal)" : "transparent" }}
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block font-semibold">{m.title}</span>
                                <span className="text-sm text-ink/65 dark:text-slate-400">
                                  {m.lessonsCount} {m.lessonsCount === 1 ? "lección" : "lecciones"}, {m.duration}
                                  {mp && ` · ${mp.percent}%`}
                                </span>
                              </span>
                              <LevelTag level={m.level} />
                              {mp?.completed && <span className="sr-only">Completado</span>}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {stage.projects.length > 0 && (
                    <p className="mt-4 text-ink/80 dark:text-slate-300">
                      <span className="font-semibold">Proyectos: </span>
                      {stage.projects.map((pr, k) => (
                        <span key={pr.slug}>
                          {k > 0 && ", "}
                          <Link to={`/proyectos/${pr.slug}`} className="text-cobalt-600 underline underline-offset-2 dark:text-cobalt-300">
                            {pr.title}
                          </Link>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </>
  );
}
