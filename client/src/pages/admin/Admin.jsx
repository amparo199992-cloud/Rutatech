import { useCallback, useEffect, useState } from "react";
import { Button, Container, ErrorState, Loading } from "../../components/ui.jsx";
import { get, patch } from "../../lib/api.js";
import { useAuth } from "../../lib/auth.jsx";
import { useSeo } from "../../lib/seo.js";
import { formatDate } from "../../lib/stages.js";
import { useToast } from "../../lib/toast.jsx";
import { useFetch } from "../../lib/useFetch.js";
import EntityManager from "./EntityManager.jsx";

function Overview() {
  const { data, error, loading, reload } = useFetch("/admin/stats");
  if (loading) return <Loading />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const cards = [
    ["Usuarios registrados", data.users, `${data.newUsers} nuevos esta semana`],
    ["Activos (7 días)", data.activeUsers, "Con al menos una acción de estudio"],
    ["Lecciones completadas", data.lessonsCompleted, `En ${data.content.lessons} lecciones disponibles`],
    ["Intentos de quiz", data.quizAttempts, `${data.quizPassRate}% aprobados, promedio ${data.averageQuizScore}%`],
    ["Proyectos entregados", data.projectSubmissions, ""],
    ["Módulos publicados", data.content.modules, ""],
  ];
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value, detail]) => (
          <div key={label} className="rounded-2xl bg-white p-5 dark:bg-night-2">
            <p className="text-ink/65 dark:text-slate-400">{label}</p>
            <p className="font-display text-4xl font-extrabold">{value}</p>
            {detail && <p className="text-sm text-ink/60 dark:text-slate-400">{detail}</p>}
          </div>
        ))}
      </div>
      <section>
        <h2 className="text-2xl font-bold">Lecciones más completadas</h2>
        {data.topLessons.length === 0 ? (
          <p className="mt-2 text-ink/70">Aún no hay datos.</p>
        ) : (
          <ol className="mt-3 list-decimal space-y-1 pl-6">
            {data.topLessons.map((l) => (
              <li key={l.title}>
                {l.title}: {l.completions}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

function Users() {
  const { user: me } = useAuth();
  const { notify } = useToast();
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const { data, error, loading, reload, setData } = useFetch(`/admin/users?q=${encodeURIComponent(search)}`);

  async function setRole(u, role) {
    try {
      await patch(`/admin/users/${u.id}`, { role });
      setData((d) => ({ ...d, users: d.users.map((x) => (x.id === u.id ? { ...x, role } : x)) }));
      notify(`Rol actualizado para ${u.name}`, { tone: "success" });
    } catch (err) {
      notify(err.message, { tone: "error" });
    }
  }

  return (
    <div className="space-y-5">
      <form
        role="search"
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(q.trim());
        }}
      >
        <label htmlFor="buscar-usuario" className="sr-only">
          Buscar por nombre o correo
        </label>
        <input id="buscar-usuario" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre o correo" className="min-h-12 flex-1 rounded-xl border-2 border-ink/15 bg-white px-4 dark:border-white/15 dark:bg-night-2" />
        <Button type="submit">Buscar</Button>
      </form>
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white dark:border-night-3 dark:bg-night-2">
          <table className="w-full text-left text-[0.95rem]">
            <caption className="sr-only">Usuarios registrados</caption>
            <thead>
              <tr className="border-b border-line dark:border-night-3">
                {["Nombre", "Correo", "Nivel y puntos", "Lecciones", "Progreso", "Proyectos", "Última actividad", "Registro", "Rol"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u.id} className="border-b border-line last:border-0 dark:border-night-3">
                  <td className="px-4 py-3 font-semibold">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.level} ({u.points})
                  </td>
                  <td className="px-4 py-3">{u.lessonsCompleted}</td>
                  <td className="px-4 py-3">{u.progressPercent}%</td>
                  <td className="px-4 py-3">{u.projects}</td>
                  <td className="px-4 py-3">{u.lastActiveDay ?? "—"}</td>
                  <td className="px-4 py-3">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <label className="sr-only" htmlFor={`rol-${u.id}`}>
                      Rol de {u.name}
                    </label>
                    <select id={`rol-${u.id}`} value={u.role} disabled={u.id === me.id} onChange={(e) => setRole(u, e.target.value)} className="rounded-lg border-2 border-ink/15 bg-white px-2 py-1 dark:border-white/15 dark:bg-night">
                      <option value="USER">Estudiante</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  useSeo("Administración");
  const [schema, setSchema] = useState(null);
  const [options, setOptions] = useState({});
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("resumen");

  const loadOptions = useCallback(() => get("/admin/options").then(setOptions).catch(() => {}), []);
  useEffect(() => {
    Promise.all([get("/admin/schema"), get("/admin/options")])
      .then(([s, o]) => {
        setSchema(s.entities);
        setOptions(o);
      })
      .catch(setError);
  }, []);

  if (error) return <ErrorState error={error} />;
  if (!schema) return <Loading />;

  const tabs = [["resumen", "Resumen"], ["usuarios", "Usuarios"], ...Object.entries(schema).map(([k, e]) => [k, e.label])];

  return (
    <Container className="py-10">
      <h1 className="text-4xl font-extrabold">Administración</h1>
      <p className="mt-2 text-ink/70 dark:text-slate-400">Gestiona el contenido de la ruta, los recursos y los usuarios. Los cambios se ven de inmediato en la plataforma.</p>
      <div role="tablist" aria-label="Secciones de administración" className="mt-8 flex gap-1 overflow-x-auto border-b border-line pb-px dark:border-night-3">
        {tabs.map(([k, label]) => (
          <button
            key={k}
            role="tab"
            id={`tab-${k}`}
            aria-selected={tab === k}
            aria-controls="panel-admin"
            onClick={() => setTab(k)}
            className={`whitespace-nowrap rounded-t-lg border-b-4 px-4 py-3 font-semibold ${tab === k ? "border-cobalt-500 text-cobalt-600 dark:text-cobalt-300" : "border-transparent hover:text-cobalt-600"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div id="panel-admin" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-8">
        {tab === "resumen" && <Overview />}
        {tab === "usuarios" && <Users />}
        {schema[tab] && <EntityManager key={tab} entityKey={tab} config={schema[tab]} options={options} onChanged={loadOptions} />}
      </div>
    </Container>
  );
}
