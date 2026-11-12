import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ExerciseCard from "../components/exercises/ExerciseCard.jsx";
import Markdown from "../components/Markdown.jsx";
import { LoginPrompt } from "../components/ProtectedRoute.jsx";
import { Button, ButtonLink, Container, ErrorState, Loading } from "../components/ui.jsx";
import { post } from "../lib/api.js";
import { useAuth } from "../lib/auth.jsx";
import { useSeo } from "../lib/seo.js";
import { useToast } from "../lib/toast.jsx";
import { useFetch } from "../lib/useFetch.js";

export default function LessonPage() {
  const { slug } = useParams();
  const { user, setUser } = useAuth();
  const { celebrate, notify } = useToast();
  const navigate = useNavigate();
  const { data, error, loading, reload, setData } = useFetch(`/lessons/${slug}`, [user?.id]);
  const [saving, setSaving] = useState(false);
  useSeo(data?.lesson.title, data?.lesson.summary);

  if (loading && !data) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const { lesson, exercises, module: mod, previous, next } = data;
  const nextHref = next.type === "lesson" ? `/lecciones/${next.slug}` : next.type === "quiz" ? `/modulos/${next.slug}/quiz` : `/modulos/${next.slug}`;

  async function complete() {
    setSaving(true);
    try {
      const r = await post(`/lessons/${lesson.slug}/complete`);
      setUser(r.user);
      celebrate(r);
      setData((d) => ({
        ...d,
        lesson: { ...d.lesson, completed: true },
        module: { ...d.module, lessons: d.module.lessons.map((l) => (l.slug === lesson.slug ? { ...l, completed: true } : l)) },
      }));
      if (!r.alreadyCompleted && r.newBadges.length === 0) notify("Lección completada", { tone: "success", icon: "✓" });
    } catch (err) {
      notify(err.message, { tone: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container className="grid gap-10 py-8 lg:grid-cols-[16rem_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <nav aria-label={`Lecciones de ${mod.title}`} className="rounded-2xl border border-line bg-white p-4 dark:border-night-3 dark:bg-night-2">
          <Link to={`/modulos/${mod.slug}`} className="font-display text-lg font-bold hover:underline">
            {mod.title}
          </Link>
          <ol className="mt-3 space-y-1">
            {mod.lessons.map((l) => (
              <li key={l.slug}>
                <Link
                  to={`/lecciones/${l.slug}`}
                  aria-current={l.slug === lesson.slug ? "page" : undefined}
                  className={`flex items-start gap-2 rounded-lg px-2 py-1.5 text-[0.95rem] ${l.slug === lesson.slug ? "bg-cobalt-50 font-semibold text-cobalt-700 dark:bg-night-3 dark:text-cobalt-100" : "hover:bg-paper dark:hover:bg-night"}`}
                >
                  <span aria-hidden="true" className={l.completed ? "text-mint-700 dark:text-mint-500" : "text-ink/30 dark:text-slate-600"}>
                    {l.completed ? "✓" : "○"}
                  </span>
                  {l.title}
                </Link>
              </li>
            ))}
            {mod.hasQuiz && (
              <li>
                <Link to={`/modulos/${mod.slug}/quiz`} className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-[0.95rem] hover:bg-paper dark:hover:bg-night">
                  <span aria-hidden="true">★</span>Quiz del módulo
                </Link>
              </li>
            )}
          </ol>
        </nav>
      </aside>

      <article className="min-w-0">
        <p className="text-sm font-semibold text-ink/65 dark:text-slate-400">
          {mod.stage.title}, {lesson.minutes} min de lectura
        </p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{lesson.title}</h1>
        {lesson.summary && <p className="mt-3 max-w-[68ch] text-xl text-ink/75 dark:text-slate-300">{lesson.summary}</p>}
        <div className="mt-8">
          <Markdown>{lesson.content}</Markdown>
        </div>

        {exercises.length > 0 && (
          <section aria-labelledby="practica" className="mt-12 max-w-3xl">
            <h2 id="practica" className="text-3xl font-bold">
              Practica lo que aprendiste
            </h2>
            <div className="mt-5 space-y-5">
              {exercises.map((ex, i) => (
                <ExerciseCard key={`${ex.id}-${user?.id ?? "anon"}`} exercise={ex} index={i} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 max-w-3xl rounded-2xl border-2 border-line bg-white p-6 dark:border-night-3 dark:bg-night-2">
          {user ? (
            lesson.completed ? (
              <p className="text-lg font-semibold text-mint-700 dark:text-mint-500">✓ Completaste esta lección.</p>
            ) : (
              <>
                <p className="text-lg font-semibold">¿Terminaste de leer y practicar?</p>
                <Button className="mt-3" size="lg" variant="success" onClick={complete} loading={saving}>
                  Marcar como completado
                </Button>
              </>
            )
          ) : (
            <LoginPrompt action="marcar lecciones como completadas" />
          )}
          <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:justify-between dark:border-night-3">
            {previous ? (
              <ButtonLink to={`/lecciones/${previous.slug}`} variant="ghost">
                Anterior: {previous.title}
              </ButtonLink>
            ) : (
              <span />
            )}
            <Button onClick={() => navigate(nextHref)}>
              {next.type === "quiz" ? "Siguiente: quiz del módulo" : `Siguiente: ${next.title}`}
            </Button>
          </div>
        </div>
      </article>
    </Container>
  );
}
