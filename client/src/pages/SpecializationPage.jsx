import { useParams } from "react-router";
import { LoginPrompt } from "../components/ProtectedRoute.jsx";
import { Button, Container, ErrorState, ExternalLink, Loading, PageHeader } from "../components/ui.jsx";
import { useAuth } from "../lib/auth.jsx";
import { useSeo } from "../lib/seo.js";
import { stageColor } from "../lib/stages.js";
import { useFetch } from "../lib/useFetch.js";
import { ProjectList } from "./Projects.jsx";
import { useChooseSpecialization } from "./Specializations.jsx";
import { ModuleRows } from "./StagePage.jsx";

function ListBlock({ title, items }) {
  return (
    <section>
      <h2 className="text-2xl font-bold">{title}</h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-6 text-ink/85 dark:text-slate-300">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </section>
  );
}

export default function SpecializationPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { data, error, loading, reload } = useFetch(`/specializations/${slug}`, [user?.specializationSlug]);
  const { choose, saving } = useChooseSpecialization();
  useSeo(data?.specialization.title, data?.specialization.description);
  if (loading && !data) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const { specialization: s, modules, projects, chosen } = data;
  const color = stageColor(5);

  return (
    <>
      <PageHeader title={`${s.icon} ${s.title}`} intro={s.description} color={color}>
        <p className="mt-4 font-semibold text-ink/70 dark:text-slate-400">Duración estimada: {s.duration}</p>
        <div className="mt-6">
          {!user ? (
            <LoginPrompt action="elegir esta especialización" />
          ) : chosen ? (
            <p className="inline-block rounded-xl bg-mint-50 px-4 py-3 font-semibold text-mint-700 dark:bg-mint-700/20 dark:text-mint-500">Esta es tu especialización actual.</p>
          ) : (
            <Button size="lg" onClick={() => choose(s, reload)} loading={saving === s.slug}>
              Elegir esta especialización
            </Button>
          )}
        </div>
      </PageHeader>
      <Container className="space-y-12 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <ListBlock title="Habilidades que adquirirás" items={s.skills} />
          <ListBlock title="Tecnologías necesarias" items={s.technologies} />
          <ListBlock title="Posibles roles laborales" items={s.roles} />
          <ListBlock title="Ideas de proyectos prácticos" items={s.projectIdeas} />
        </div>
        <section>
          <h2 className="text-2xl font-bold">Módulo de introducción</h2>
          <div className="mt-4">
            <ModuleRows modules={modules} color={color} />
          </div>
        </section>
        {projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold">Proyecto de la especialización</h2>
            <div className="mt-4">
              <ProjectList projects={projects} />
            </div>
          </section>
        )}
        <section>
          <h2 className="text-2xl font-bold">Recursos oficiales y confiables</h2>
          <p className="mt-1 text-ink/70 dark:text-slate-400">Sitios externos de sus respectivos autores. Revisa en cada uno si tiene costo.</p>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {s.resources.map((r) => (
              <li key={r.url} className="rounded-xl border border-line bg-white px-4 py-3 dark:border-night-3 dark:bg-night-2">
                <ExternalLink href={r.url} className="font-semibold text-cobalt-600 underline underline-offset-2 dark:text-cobalt-300">
                  {r.title}
                </ExternalLink>
                <span className="block text-sm text-ink/65 dark:text-slate-400">Idioma: {r.lang}</span>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
