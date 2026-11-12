import { Link } from "react-router";
import { Container, ErrorState, Loading, ProgressBar } from "../components/ui.jsx";
import { useSeo } from "../lib/seo.js";
import { formatRelative, stageColor } from "../lib/stages.js";
import { useFetch } from "../lib/useFetch.js";
import { NextStepLink } from "./Roadmap.jsx";

const ACTIVITY_ICON = { lesson: "📖", exercise: "🧩", quiz: "✅", project: "🛠️", badge: "🏅", specialization: "🎯", account: "👋" };

function Stat({ label, value, detail }) {
  return (
    <div className="rounded-2xl bg-white p-5 dark:bg-night-2">
      <p className="text-ink/65 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-display text-4xl font-extrabold">{value}</p>
      {detail && <p className="mt-1 text-sm text-ink/65 dark:text-slate-400">{detail}</p>}
    </div>
  );
}

function Section({ title, children, id, action }) {
  return (
    <section aria-labelledby={id}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={id} className="text-2xl font-bold">
          {title}
        </h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function Dashboard() {
  useSeo("Mi panel");
  const { data, error, loading, reload } = useFetch("/dashboard");
  if (loading) return <Loading label="Preparando tu panel…" />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const { user, level, stats, overall, stages, next, recommendations, review, inProgress, badges, activity, projects, motivation } = data;
  const earned = badges.filter((b) => b.earnedAt);

  return (
    <>
      <header className="border-b border-line bg-white py-10 dark:border-night-3 dark:bg-night-2">
        <Container className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <h1 className="text-4xl font-extrabold sm:text-5xl">Hola, {user.name.split(" ")[0]}</h1>
            <p className="mt-2 text-lg text-ink/75 dark:text-slate-300">{motivation}</p>
            <div className="mt-6">
              <NextStepLink next={next} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between font-semibold">
              <span>Ruta completa</span>
              <span className="font-display text-3xl font-extrabold">{overall.percent}%</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={overall.percent} label="Avance en la ruta completa" />
            </div>
            <div className="mt-3 flex gap-1" aria-hidden="true">
              {stages.map((s) => (
                <span key={s.slug} className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
                  <span className="block h-full" style={{ width: `${s.percent}%`, background: stageColor(s.order) }} />
                </span>
              ))}
            </div>
          </div>
        </Container>
      </header>

      <Container className="py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-cobalt-500 p-5 text-white">
            <p className="text-white/80">Tu nivel</p>
            <p className="mt-1 font-display text-4xl font-extrabold">{level.name}</p>
            <div className="mt-3">
              <ProgressBar value={level.progressToNext} label="Progreso al siguiente nivel" color="var(--color-signal)" size="sm" />
            </div>
            <p className="mt-1 text-sm text-white/80">{level.next ? `${level.next.min - stats.points} puntos para ${level.next.name}` : "Nivel máximo alcanzado"}</p>
          </div>
          <Stat label="Racha de estudio" value={`${stats.streak} ${stats.streak === 1 ? "día" : "días"}`} detail={user.studiedToday ? "Ya estudiaste hoy" : `Tu mejor racha: ${stats.longestStreak}. Estudia hoy para mantenerla.`} />
          <Stat label="Puntos" value={stats.points} detail={`${stats.exercisesCorrect} ejercicios resueltos`} />
          <Stat label="Lecciones completadas" value={stats.lessonsCompleted} detail={`${stats.quizzesPassed} quizzes aprobados, ${stats.projectsSubmitted} proyectos entregados`} />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-12">
            {recommendations.length > 0 && (
              <Section title="Recomendado para ti" id="recomendado">
                <ul className="space-y-2">
                  {recommendations.map((r) => (
                    <li key={r} className="rounded-xl border-l-4 border-signal bg-white px-4 py-3 dark:bg-night-2">
                      {r}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <Section title="Progreso por etapa" id="etapas">
              <ol className="space-y-4">
                {stages.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/etapas/${s.slug}`} className="block rounded-xl px-1 py-1 hover:bg-white dark:hover:bg-night-2">
                      <span className="mb-1 flex justify-between gap-3 font-semibold">
                        <span>
                          {s.order}. {s.title}
                        </span>
                        <span>{s.needsChoice ? "Elige tu ruta" : `${s.percent}%`}</span>
                      </span>
                      <ProgressBar value={s.percent} label={`Avance en ${s.title}`} color={stageColor(s.order)} />
                    </Link>
                  </li>
                ))}
              </ol>
            </Section>

            <Section title="Módulos en progreso" id="en-progreso">
              {inProgress.length === 0 ? (
                <p className="text-ink/70 dark:text-slate-400">Aún no tienes módulos a medias. Empieza con el siguiente paso recomendado.</p>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {inProgress.map((m) => (
                    <li key={m.slug}>
                      <Link to={`/modulos/${m.slug}`} className="block rounded-xl border border-line bg-white p-4 hover:border-cobalt-500 dark:border-night-3 dark:bg-night-2">
                        <span className="text-sm text-ink/60 dark:text-slate-400">{m.stageTitle}</span>
                        <span className="block font-semibold">{m.title}</span>
                        <span className="mt-2 block">
                          <ProgressBar value={m.percent} label={`Avance en ${m.title}`} size="sm" />
                        </span>
                        <span className="text-sm text-ink/60 dark:text-slate-400">
                          {m.lessonsDone}/{m.lessonsTotal} lecciones{m.hasQuiz && (m.quizPassed ? ", quiz aprobado" : ", quiz pendiente")}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Repaso de temas pendientes" id="repaso">
              {review.length === 0 ? (
                <p className="text-ink/70 dark:text-slate-400">Nada pendiente por repasar. Los quizzes con menos de 4/5 y los ejercicios sin resolver aparecerán aquí.</p>
              ) : (
                <ul className="divide-y divide-line rounded-2xl border border-line bg-white dark:divide-night-3 dark:border-night-3 dark:bg-night-2">
                  {review.map((r) => (
                    <li key={r.href + r.title}>
                      <Link to={r.href} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-paper dark:hover:bg-night">
                        <span>
                          <span className="block font-semibold">{r.title}</span>
                          <span className="text-sm text-ink/65 dark:text-slate-400">{r.detail}</span>
                        </span>
                        <span className="shrink-0 font-semibold text-cobalt-600 dark:text-cobalt-300">Repasar</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Proyectos entregados" id="proyectos" action={<Link to="/proyectos" className="font-semibold text-cobalt-600 underline dark:text-cobalt-300">Ver todos</Link>}>
              {projects.length === 0 ? (
                <p className="text-ink/70 dark:text-slate-400">Todavía no has entregado proyectos. El primero es crear tu espacio de estudio en GitHub.</p>
              ) : (
                <ul className="space-y-2">
                  {projects.map((p) => (
                    <li key={p.slug} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 dark:bg-night-2">
                      <Link to={`/proyectos/${p.slug}`} className="font-semibold hover:underline">
                        {p.title}
                      </Link>
                      <span className={`rounded-md px-2 py-0.5 text-sm font-semibold ${p.status === "completed" ? "bg-mint-50 text-mint-700 dark:bg-mint-700/20 dark:text-mint-500" : "bg-signal-50 text-[#8a5a00] dark:bg-signal/15 dark:text-signal"}`}>
                        {p.status === "completed" ? "Completado" : "Entregado"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </div>

          <div className="space-y-12">
            <Section title={`Insignias (${earned.length}/${badges.length})`} id="insignias">
              <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3">
                {badges.map((b) => (
                  <li
                    key={b.code}
                    className={`flex flex-col items-center rounded-2xl p-3 text-center ${b.earnedAt ? "bg-signal-50 dark:bg-signal/10" : "bg-ink/5 opacity-55 grayscale dark:bg-white/5"}`}
                    title={b.description}
                  >
                    <span aria-hidden="true" className="text-3xl">
                      {b.icon}
                    </span>
                    <span className="mt-1 text-sm font-semibold leading-tight">{b.name}</span>
                    <span className="sr-only">
                      {b.description} {b.earnedAt ? "Ganada." : "Bloqueada."}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Historial de actividad" id="actividad">
              <ol className="space-y-3">
                {activity.map((a) => (
                  <li key={a.id} className="flex gap-3">
                    <span aria-hidden="true" className="text-xl">
                      {ACTIVITY_ICON[a.type] ?? "•"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block">{a.message}</span>
                      <span className="text-sm text-ink/60 dark:text-slate-400">
                        {formatRelative(a.createdAt)}
                        {a.points > 0 && `, +${a.points} puntos`}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </Section>
          </div>
        </div>
      </Container>
    </>
  );
}
