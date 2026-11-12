import { useState } from "react";
import { Link, useParams } from "react-router";
import { LoginPrompt } from "../components/ProtectedRoute.jsx";
import { Button, ButtonLink, Container, ErrorState, Loading, ProgressBar } from "../components/ui.jsx";
import { post } from "../lib/api.js";
import { useAuth } from "../lib/auth.jsx";
import { useSeo } from "../lib/seo.js";
import { useToast } from "../lib/toast.jsx";
import { useFetch } from "../lib/useFetch.js";

export default function QuizPage() {
  const { slug } = useParams();
  const { user, setUser } = useAuth();
  const { celebrate, notify } = useToast();
  const { data, error, loading, reload } = useFetch(`/modules/${slug}/quiz`);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [sending, setSending] = useState(false);
  useSeo(data ? `Quiz: ${data.module.title}` : "Quiz");

  if (loading) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const { questions, module: mod } = data;
  const answered = Object.keys(answers).length;

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    try {
      const r = await post(`/modules/${slug}/quiz`, { answers: questions.map((_, i) => answers[i] ?? -1) });
      setResult(r);
      setUser(r.user);
      celebrate(r);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      notify(err.message, { tone: "error" });
    } finally {
      setSending(false);
    }
  }

  function retry() {
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0 });
  }

  return (
    <Container className="max-w-3xl py-10">
      <Link to={`/modulos/${mod.slug}`} className="font-semibold text-cobalt-600 hover:underline dark:text-cobalt-300">
        Volver a {mod.title}
      </Link>
      <h1 className="mt-3 text-4xl font-extrabold">Quiz: {mod.title}</h1>
      <p className="mt-2 text-lg text-ink/75 dark:text-slate-300">
        {questions.length} preguntas. Apruebas con 3 correctas. Al enviar verás por qué cada respuesta es correcta o incorrecta.
      </p>

      {result && (
        <div role="status" className={`mt-6 rounded-2xl p-6 ${result.passed ? "bg-mint-50 dark:bg-mint-700/15" : "bg-signal-50 dark:bg-signal/10"}`}>
          <p className="font-display text-3xl font-extrabold">
            {result.score} de {result.total}
          </p>
          <p className="mt-1 text-lg font-semibold">{result.message}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={retry}>
              Intentar de nuevo
            </Button>
            <ButtonLink to={`/modulos/${mod.slug}`}>Volver al módulo</ButtonLink>
            {!result.passed && (
              <ButtonLink to="/panel" variant="ghost">
                Ver temas para repasar
              </ButtonLink>
            )}
          </div>
        </div>
      )}

      {!user && (
        <div className="mt-6">
          <LoginPrompt action="presentar el quiz y guardar tu resultado" />
        </div>
      )}

      <form onSubmit={submit} className="mt-8 space-y-6">
        {!result && (
          <div className="sticky top-16 z-10 bg-paper/95 py-2 dark:bg-night/95">
            <ProgressBar value={(answered / questions.length) * 100} label="Preguntas respondidas" />
            <p className="mt-1 text-sm text-ink/65 dark:text-slate-400">
              {answered} de {questions.length} respondidas
            </p>
          </div>
        )}
        {questions.map((q, i) => {
          const r = result?.results[i];
          return (
            <fieldset key={q.id} className="rounded-2xl border-2 border-line bg-white p-5 dark:border-night-3 dark:bg-night-2">
              <legend className="sr-only">Pregunta {i + 1}</legend>
              <p className="text-sm font-semibold text-cobalt-600 dark:text-cobalt-300">Pregunta {i + 1}</p>
              <p className="mt-1 text-lg font-semibold">{q.question}</p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, j) => {
                  const isSelected = answers[i] === j;
                  let style = isSelected ? "border-cobalt-500 bg-cobalt-50 dark:bg-cobalt-500/15" : "border-line dark:border-night-3";
                  if (r) {
                    if (j === r.correctIndex) style = "border-mint-500 bg-mint-50 dark:bg-mint-700/20";
                    else if (isSelected) style = "border-red-600 bg-red-50 dark:bg-red-950/50";
                    else style = "border-line opacity-70 dark:border-night-3";
                  }
                  return (
                    <label key={j} className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3 ${style}`}>
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        className="mt-1 h-5 w-5 accent-cobalt-500"
                        checked={isSelected}
                        disabled={Boolean(result) || !user}
                        onChange={() => setAnswers((a) => ({ ...a, [i]: j }))}
                      />
                      <span>
                        {opt}
                        {r && j === r.correctIndex && <span className="ml-2 font-semibold text-mint-700 dark:text-mint-500">Respuesta correcta</span>}
                        {r && isSelected && j !== r.correctIndex && <span className="ml-2 font-semibold text-red-700 dark:text-red-400">Tu respuesta</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
              {r && (
                <p className={`mt-3 rounded-lg px-3 py-2 ${r.correct ? "bg-mint-50 dark:bg-mint-700/15" : "bg-red-50 dark:bg-red-950/40"}`}>
                  <strong>{r.correct ? "Bien. " : "Revisa esto: "}</strong>
                  {r.explanation}
                </p>
              )}
            </fieldset>
          );
        })}
        {!result && user && (
          <Button type="submit" size="lg" loading={sending} disabled={answered < questions.length}>
            {answered < questions.length ? `Responde las ${questions.length - answered} pregunta(s) restantes` : "Enviar respuestas"}
          </Button>
        )}
      </form>
    </Container>
  );
}
