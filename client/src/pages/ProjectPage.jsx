import { useState } from "react";
import { Link, useParams } from "react-router";
import { LoginPrompt } from "../components/ProtectedRoute.jsx";
import { Button, Container, ErrorState, ExternalLink, Field, FormError, LevelTag, Loading } from "../components/ui.jsx";
import { post } from "../lib/api.js";
import { useAuth } from "../lib/auth.jsx";
import { useSeo } from "../lib/seo.js";
import { formatDate, stageColor } from "../lib/stages.js";
import { useToast } from "../lib/toast.jsx";
import { useFetch } from "../lib/useFetch.js";

function Submission({ project, submission, onChange }) {
  const { setUser } = useAuth();
  const { celebrate, notify } = useToast();
  const [repoUrl, setRepoUrl] = useState(submission?.repoUrl ?? "");
  const [notes, setNotes] = useState(submission?.notes ?? "");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setErrors({});
    setFormError("");
    if (!/^https:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+/i.test(repoUrl.trim())) {
      setErrors({ repoUrl: "Pega el enlace completo de tu repositorio, por ejemplo https://github.com/tu-usuario/mi-proyecto" });
      return;
    }
    setBusy("submit");
    try {
      const r = await post(`/projects/${project.slug}/submit`, { repoUrl: repoUrl.trim(), notes: notes.trim() || undefined });
      setUser(r.user);
      celebrate(r);
      notify(submission ? "Enlace actualizado" : "Proyecto entregado", { tone: "success", icon: "🛠️" });
      onChange(r.submission);
    } catch (err) {
      setErrors(err.fields);
      setFormError(Object.keys(err.fields).length ? "" : err.message);
    } finally {
      setBusy(null);
    }
  }

  async function complete() {
    setBusy("complete");
    try {
      const r = await post(`/projects/${project.slug}/complete`);
      setUser(r.user);
      celebrate(r);
      onChange(r.submission);
    } catch (err) {
      notify(err.message, { tone: "error" });
    } finally {
      setBusy(null);
    }
  }

  return (
    <section aria-labelledby="entrega" className="rounded-2xl border-2 border-cobalt-300 bg-white p-6 dark:border-cobalt-700 dark:bg-night-2">
      <h2 id="entrega" className="text-2xl font-bold">
        Entrega tu proyecto
      </h2>
      {submission && (
        <p className="mt-2">
          {submission.status === "completed" ? "✓ Completado" : "Entregado"} el {formatDate(submission.completedAt ?? submission.submittedAt)}:{" "}
          <ExternalLink href={submission.repoUrl} className="font-semibold text-cobalt-600 underline dark:text-cobalt-300">
            ver repositorio
          </ExternalLink>
        </p>
      )}
      <form onSubmit={submit} className="mt-4 space-y-4" noValidate>
        <FormError message={formError} />
        <Field id="repoUrl" label="Enlace del repositorio de GitHub" type="url" inputMode="url" placeholder="https://github.com/tu-usuario/mi-proyecto" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} error={errors.repoUrl} required />
        <Field id="notes" as="textarea" label="Notas (opcional)" hint="Qué aprendiste, qué te costó o qué mejorarías." value={notes} onChange={(e) => setNotes(e.target.value)} error={errors.notes} />
        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={busy === "submit"}>
            {submission ? "Actualizar enlace" : "Entregar proyecto"}
          </Button>
          {submission && submission.status !== "completed" && (
            <Button type="button" variant="success" onClick={complete} loading={busy === "complete"}>
              Marcar como completado
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}

export default function ProjectPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { data, error, loading, reload, setData } = useFetch(`/projects/${slug}`, [user?.id]);
  useSeo(data?.project.title, data?.project.summary);
  if (loading && !data) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const { project: p, submission } = data;
  const color = stageColor(p.stage?.order);

  return (
    <Container className="max-w-4xl py-10">
      {p.stage && (
        <Link to={`/etapas/${p.stage.slug}`} className="font-semibold hover:underline" style={{ color }}>
          Etapa {p.stage.order}: {p.stage.title}
        </Link>
      )}
      <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{p.title}</h1>
      <p className="mt-3 text-xl text-ink/80 dark:text-slate-300">{p.summary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <LevelTag level={p.difficulty} />
        <span className="text-ink/70 dark:text-slate-400">Tiempo estimado: ~{p.estimatedHours} horas</span>
      </div>
      <p className="mt-3">
        <span className="font-semibold">Tecnologías: </span>
        {p.technologies.join(", ")}
      </p>

      <section aria-labelledby="pasos" className="mt-10">
        <h2 id="pasos" className="text-2xl font-bold">
          Instrucciones paso a paso
        </h2>
        <ol className="mt-4 space-y-3">
          {p.steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-white" style={{ background: color }}>
                {i + 1}
              </span>
              <span className="pt-0.5">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section aria-labelledby="criterios">
          <h2 id="criterios" className="text-2xl font-bold">
            Criterios de evaluación
          </h2>
          <ul className="mt-3 space-y-2">
            {p.criteria.map((c) => (
              <li key={c} className="flex gap-2">
                <span aria-hidden="true" className="text-mint-700 dark:text-mint-500">✓</span>
                {c}
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="mejoras">
          <h2 id="mejoras" className="text-2xl font-bold">
            Ideas para mejorarlo
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            {p.improvements.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-12">
        {user ? (
          <Submission key={submission?.id ?? "new"} project={p} submission={submission} onChange={(s) => setData((d) => ({ ...d, submission: s }))} />
        ) : (
          <LoginPrompt action="entregar tu proyecto y sumar puntos" />
        )}
      </div>
    </Container>
  );
}
