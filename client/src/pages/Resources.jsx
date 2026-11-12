import { useState } from "react";
import { Container, ErrorState, ExternalLink, Loading, PageHeader } from "../components/ui.jsx";
import { useSeo } from "../lib/seo.js";
import { useFetch } from "../lib/useFetch.js";

export default function Resources() {
  useSeo("Biblioteca de recursos", "Cursos y documentación confiables para aprender tecnología: CS50, freeCodeCamp, MDN, Python, Git, The Odin Project y más.");
  const { data, error, loading, reload } = useFetch("/resources");
  const [lang, setLang] = useState("");
  if (loading) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const list = data.resources.filter((r) => !lang || r.language.toLowerCase().includes(lang));

  return (
    <>
      <PageHeader
        title="Biblioteca de recursos"
        intro="Cursos y documentación de organizaciones reconocidas. Son sitios externos: RutaTech no está afiliada a ellos y su contenido es de sus autores."
      >
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por idioma">
          {[
            ["", "Todos"],
            ["español", "Con versión en español"],
            ["inglés", "En inglés"],
          ].map(([v, l]) => (
            <button
              key={v}
              aria-pressed={lang === v}
              onClick={() => setLang(v)}
              className={`min-h-11 rounded-xl border-2 px-4 font-semibold ${lang === v ? "border-cobalt-500 bg-cobalt-500 text-white" : "border-ink/15 dark:border-white/15"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </PageHeader>
      <Container className="py-12">
        <ul className="divide-y divide-line border-y border-line dark:divide-night-3 dark:border-night-3">
          {list.map((r) => (
            <li key={r.id} className="grid gap-3 py-6 md:grid-cols-[1fr_16rem] md:gap-10">
              <div>
                <h2 className="text-xl font-bold">
                  <ExternalLink href={r.url} className="hover:underline">
                    {r.title}
                  </ExternalLink>
                </h2>
                <p className="text-ink/65 dark:text-slate-400">{r.provider}</p>
                <p className="mt-2 max-w-[68ch] text-ink/85 dark:text-slate-300">{r.description}</p>
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 self-start text-[0.95rem]">
                <dt className="font-semibold">Nivel</dt>
                <dd>{r.level}</dd>
                <dt className="font-semibold">Idioma</dt>
                <dd>{r.language}</dd>
                <dt className="font-semibold">Tema</dt>
                <dd>{r.category}</dd>
                <dt className="font-semibold">Costo</dt>
                <dd>{r.free ? "Gratuito" : "De pago (con becas)"}</dd>
              </dl>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
