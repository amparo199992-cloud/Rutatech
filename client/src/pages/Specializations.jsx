import { useState } from "react";
import { Link } from "react-router";
import { Button, ButtonLink, Container, ErrorState, Loading, PageHeader } from "../components/ui.jsx";
import { put } from "../lib/api.js";
import { useAuth } from "../lib/auth.jsx";
import { useSeo } from "../lib/seo.js";
import { stageColor } from "../lib/stages.js";
import { useToast } from "../lib/toast.jsx";
import { useFetch } from "../lib/useFetch.js";

export function useChooseSpecialization() {
  const { setUser } = useAuth();
  const { celebrate, notify } = useToast();
  const [saving, setSaving] = useState(null);
  async function choose(spec, after) {
    setSaving(spec.slug);
    try {
      const r = await put("/users/me/specialization", { slug: spec.slug });
      setUser(r.user);
      notify(`Elegiste ${spec.title}. Puedes cambiarla cuando quieras.`, { tone: "success", icon: spec.icon });
      celebrate(r);
      after?.();
    } catch (err) {
      notify(err.message, { tone: "error" });
    } finally {
      setSaving(null);
    }
  }
  return { choose, saving };
}

export function SpecializationSummary({ spec, chosen, onChoose, saving }) {
  const { user } = useAuth();
  return (
    <article className={`flex flex-col rounded-2xl border-2 bg-white p-6 dark:bg-night-2 ${chosen ? "border-[var(--c)]" : "border-line dark:border-night-3"}`} style={{ "--c": stageColor(5) }}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-2xl font-bold">
          <span aria-hidden="true" className="mr-2">{spec.icon}</span>
          <Link to={`/especializaciones/${spec.slug}`} className="hover:underline">
            {spec.title}
          </Link>
        </h3>
        {chosen && <span className="rounded-md bg-mint-50 px-2 py-0.5 text-sm font-semibold text-mint-700 dark:bg-mint-700/20 dark:text-mint-500">Tu ruta</span>}
      </div>
      <p className="mt-2 text-ink/80 dark:text-slate-300">{spec.description}</p>
      <dl className="mt-4 space-y-3 text-[0.98rem]">
        <div>
          <dt className="font-semibold">Duración estimada</dt>
          <dd className="text-ink/75 dark:text-slate-300">{spec.duration}</dd>
        </div>
        <div>
          <dt className="font-semibold">Tecnologías</dt>
          <dd className="text-ink/75 dark:text-slate-300">{spec.technologies.join(", ")}</dd>
        </div>
        <div>
          <dt className="font-semibold">Roles relacionados</dt>
          <dd className="text-ink/75 dark:text-slate-300">{spec.roles.join(", ")}</dd>
        </div>
      </dl>
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <ButtonLink to={`/especializaciones/${spec.slug}`} variant="secondary" size="sm">
          Ver detalles
        </ButtonLink>
        {user && !chosen && (
          <Button size="sm" onClick={() => onChoose(spec)} loading={saving === spec.slug}>
            Elegir esta ruta
          </Button>
        )}
      </div>
    </article>
  );
}

export default function Specializations() {
  useSeo("Especializaciones", "Elige entre desarrollo web, datos y análisis, ciberseguridad, soporte e infraestructura, o IA y automatización.");
  const { user } = useAuth();
  const { data, error, loading, reload } = useFetch("/specializations");
  const { choose, saving } = useChooseSpecialization();
  if (loading) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  return (
    <>
      <PageHeader color={stageColor(5)} title="Especializaciones" intro="Después de las etapas 1 a 4, elige el camino que más te emociona. Puedes cambiar de ruta cuando quieras sin perder tu progreso." />
      <Container className="grid gap-6 py-12 md:grid-cols-2">
        {data.specializations.map((s) => (
          <SpecializationSummary key={s.slug} spec={s} chosen={user?.specializationSlug === s.slug} onChoose={choose} saving={saving} />
        ))}
      </Container>
    </>
  );
}
