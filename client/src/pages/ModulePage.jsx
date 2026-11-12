import { useState } from "react";
import { Link, useParams } from "react-router";
import { LoginPrompt } from "../components/ProtectedRoute.jsx";
import { ButtonLink, Container, ErrorState, ExternalLink, LevelTag, Loading, ProgressBar } from "../components/ui.jsx";
import { put } from "../lib/api.js";
import { useAuth } from "../lib/auth.jsx";
import { useSeo } from "../lib/seo.js";
import { stageColor } from "../lib/stages.js";
import { useToast } from "../lib/toast.jsx";
import { useFetch } from "../lib/useFetch.js";

function Checklist({ slug, items, initial }) {
  const { user } = useAuth();
  const { notify } = useToast();
  const [checked, setChecked] = useState(new Set(initial));

  async function toggle(i) {
    const next = new Set(checked);
    next.has(i) ? next.delete(i) : next.add(i);
    setChecked(next);
    try {
      await put(`/modules/${slug}/checklist`, { checked: [...next] });
    } catch (err) {
      notify(err.message, { tone: "error" });
    }
  }

  return (
    <section aria-labelledby="checklist" className="rounded-2xl border-2 border-line bg-white p-6 dark:border-night-3 dark:bg-night-2">
      <h2 id="checklist" className="text-2xl font-bold">
        Checklist de dominio
      </h2>
      <p className="mt-1 text-ink/70 dark:text-slate-400">Marca lo que ya puedes hacer sin ayuda. Es para ti: sé honesto contigo.</p>
      <ul className="mt-4 space-y-2">
        {items.map((item, i) => (
          <li key={i}>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-paper dark:hover:bg-night">
              <input type="checkbox" className="mt-1 h-5 w-5 accent-mint-500" checked={checked.has(i)} disabled={!user} onChange={() => toggle(i)} />
              <span className={checked.has(i) ? "text-ink/60 line-through dark:text-slate-500" : ""}>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm font-semibold">
        {checked.size} de {items.length} dominados
      </p>
      {!user && (
        <div className="mt-3">
          <LoginPrompt action="marcar tu checklist" />
        </div>
      )}
    </section>
  );
}

export default function ModulePage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { data, error, loading, reload } = useFetch(`/modules/${slug}`, [user?.id]);
  useSeo(data?.module.title, data?.module.description);
  if (loading && !data) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const { module: m, lessons, progress, checklistChecked, nextModule } = data;
  const color = stageColor(m.stage.order);
  const firstPending = lessons.find((l) => !l.completed);

  return (
    <>
      <header className="border-b border-line bg-white py-10 dark:border-night-3 dark:bg-night-2">
        <Container>
          <nav aria-label="Ruta de navegación" className="text-sm font-semibold">
            <Link to="/ruta" className="hover:underline">
              Ruta
            </Link>
            <span aria-hidden="true"> / </span>
            <Link to={`/etapas/${m.stage.slug}`} className="hover:underline" style={{ color }}>
              Etapa {m.stage.order}: {m.stage.title}
            </Link>
          </nav>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold sm:text-5xl">{m.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink/80 dark:text-slate-300">{m.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-ink/75 dark:text-slate-300">
            <LevelTag level={m.level} />
            <span>Duración estimada: {m.duration}</span>
            <span>{lessons.length} lección(es) y quiz de {m.quizQuestions} preguntas</span>
          </div>
          {progress && (
            <div className="mt-6 max-w-md">
              <div className="mb-1 flex justify-between text-sm font-semibold">
                <span>Avance del módulo</span>
                <span>{progress.percent}%</span>
              </div>
              <ProgressBar value={progress.percent} label="Avance del módulo" color={color} />
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            {firstPending ? (
              <ButtonLink to={`/lecciones/${firstPending.slug}`} size="lg">
                {progress?.lessonsDone ? "Continuar con la siguiente lección" : "Empezar el módulo"}
              </ButtonLink>
            ) : (
              <ButtonLink to={`/modulos/${m.slug}/quiz`} size="lg">
                {progress?.quizPassed ? "Repetir el quiz" : "Presentar el quiz"}
              </ButtonLink>
            )}
          </div>
        </Container>
      </header>

      <Container className="grid gap-10 py-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-10">
          <section aria-labelledby="objetivos">
            <h2 id="objetivos" className="text-2xl font-bold">
              Lo que aprenderás
            </h2>
            <ul className="mt-3 space-y-2">
              {m.objectives.map((o) => (
                <li key={o} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
                  {o}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="lecciones">
            <h2 id="lecciones" className="text-2xl font-bold">
              Lecciones
            </h2>
            <ol className="mt-4 space-y-3">
              {lessons.map((l, i) => (
                <li key={l.slug}>
                  <Link to={`/lecciones/${l.slug}`} className="flex items-center gap-4 rounded-xl border border-line bg-white px-4 py-4 hover:border-cobalt-500 dark:border-night-3 dark:bg-night-2">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] font-bold"
                      style={{ borderColor: color, background: l.completed ? color : undefined, color: l.completed ? "white" : undefined }}
                    >
                      {l.completed ? "✓" : i + 1}
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold">{l.title}</span>
                      {l.summary && <span className="block text-ink/70 dark:text-slate-400">{l.summary}</span>}
                    </span>
                    <span className="shrink-0 text-sm text-ink/60 dark:text-slate-400">{l.minutes} min</span>
                    {l.completed && <span className="sr-only">Completada</span>}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={`/modulos/${m.slug}/quiz`} className="flex items-center gap-4 rounded-xl border-2 border-dashed px-4 py-4 hover:bg-white dark:hover:bg-night-2" style={{ borderColor: color }}>
                  <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signal text-lg">
                    ★
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold">Quiz final ({m.quizQuestions} preguntas)</span>
                    <span className="block text-ink/70 dark:text-slate-400">
                      {progress?.bestScore ? `Tu mejor resultado: ${progress.bestScore.score}/${progress.bestScore.total}` : "Apruebas con 3 de 5 respuestas correctas."}
                    </span>
                  </span>
                  {progress?.quizPassed && <span className="font-semibold text-mint-700 dark:text-mint-500">Aprobado</span>}
                </Link>
              </li>
            </ol>
          </section>
        </div>

        <aside className="space-y-8">
          <Checklist key={user?.id ?? "anon"} slug={m.slug} items={m.checklist} initial={checklistChecked} />
          <section aria-labelledby="recursos">
            <h2 id="recursos" className="text-2xl font-bold">
              Recursos adicionales
            </h2>
            <ul className="mt-3 space-y-3">
              {m.resources.map((r) => (
                <li key={r.url}>
                  <ExternalLink href={r.url} className="font-semibold text-cobalt-600 underline underline-offset-2 dark:text-cobalt-300">
                    {r.title}
                  </ExternalLink>
                  <span className="block text-sm text-ink/60 dark:text-slate-400">{r.lang}</span>
                </li>
              ))}
            </ul>
          </section>
          {nextModule && (
            <section className="rounded-2xl bg-cobalt-50 p-5 dark:bg-night-2">
              <h2 className="text-lg font-bold">Siguiente módulo recomendado</h2>
              <Link to={nextModule.slug ? `/modulos/${nextModule.slug}` : `/etapas/${nextModule.stageSlug}`} className="mt-1 block text-lg font-semibold text-cobalt-600 underline dark:text-cobalt-300">
                {nextModule.title}
              </Link>
            </section>
          )}
        </aside>
      </Container>
    </>
  );
}
