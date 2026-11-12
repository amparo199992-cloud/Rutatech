import { useEffect, useMemo, useState } from "react";
import { Button, ErrorState, FormError, Loading } from "../../components/ui.jsx";
import { del, get, post, put } from "../../lib/api.js";
import { useToast } from "../../lib/toast.jsx";

const inputClass =
  "w-full rounded-xl border-2 border-ink/15 bg-white px-3 py-2.5 text-base focus:border-cobalt-500 focus:outline-none dark:border-white/15 dark:bg-night";

function toFormValue(field, value) {
  if (value === undefined || value === null) {
    if (field.type === "boolean") return field.default ?? false;
    if (field.type === "json") return field.name === "resources" ? "[]" : "{}";
    return field.default ?? "";
  }
  if (field.type === "list") return value.join("\n");
  if (field.type === "json") return JSON.stringify(value, null, 2);
  return value;
}

function FieldInput({ field, value, onChange, options, error }) {
  const id = `f-${field.name}`;
  const common = { id, "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-err` : field.help ? `${id}-help` : undefined };
  let input;
  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-3 font-semibold">
        <input type="checkbox" className="h-5 w-5 accent-cobalt-500" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} {...common} />
        {field.label}
      </label>
    );
  }
  if (field.type === "select") {
    input = (
      <select className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} {...common}>
        <option value="">Selecciona…</option>
        {field.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  } else if (field.type === "relation") {
    input = (
      <select className={inputClass} value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...common}>
        <option value="">{field.required ? "Selecciona…" : "Ninguna"}</option>
        {(options[field.relation] ?? []).map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else if (["textarea", "markdown", "list", "json"].includes(field.type)) {
    input = (
      <textarea
        className={`${inputClass} ${field.type === "markdown" || field.type === "json" ? "min-h-64 font-mono text-sm" : "min-h-28"}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={field.type !== "json"}
        {...common}
      />
    );
  } else {
    input = <input className={inputClass} type={field.type === "number" ? "number" : "text"} value={value} onChange={(e) => onChange(e.target.value)} {...common} />;
  }
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-semibold">
        {field.label}
        {field.required && <span className="text-red-700"> *</span>}
      </label>
      {input}
      {field.help && !error && (
        <p id={`${id}-help`} className="mt-1 text-sm text-ink/60 dark:text-slate-400">
          {field.help}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-sm font-medium text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function EntityForm({ entityKey, config, item, options, onSaved, onCancel }) {
  const { notify } = useToast();
  const [values, setValues] = useState(() => Object.fromEntries(config.fields.map((f) => [f.name, toFormValue(f, item?.[f.name])])));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setMessage("");
    try {
      const r = item ? await put(`/admin/${entityKey}/${item.id}`, values) : await post(`/admin/${entityKey}`, values);
      notify(item ? "Cambios guardados" : "Elemento creado", { tone: "success", icon: "✓" });
      onSaved(r.item);
    } catch (err) {
      setErrors(err.fields);
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border-2 border-cobalt-300 bg-white p-5 dark:border-cobalt-700 dark:bg-night-2" noValidate>
      <h3 className="text-xl font-bold">{item ? `Editar: ${item.title ?? item.question ?? item.prompt ?? item.key}` : `Nuevo elemento en ${config.label}`}</h3>
      <FormError message={message} />
      {config.fields.map((f) => (
        <FieldInput key={f.name} field={f} value={values[f.name]} options={options} error={errors[f.name]} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} />
      ))}
      <div className="flex gap-3">
        <Button type="submit" loading={saving}>
          {item ? "Guardar cambios" : "Crear"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export default function EntityManager({ entityKey, config, options, onChanged }) {
  const { notify } = useToast();
  const [filter, setFilter] = useState("");
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null); // null | "new" | item
  const [confirmId, setConfirmId] = useState(null);

  const filterField = config.fields.find((f) => f.name === config.filter);
  const labels = useMemo(() => {
    const map = {};
    for (const f of config.fields.filter((x) => x.type === "relation")) {
      map[f.name] = Object.fromEntries((options[f.relation] ?? []).map((o) => [o.id, o.label]));
    }
    return map;
  }, [config, options]);

  useEffect(() => {
    let active = true;
    setItems(null);
    setError(null);
    get(`/admin/${entityKey}${filter ? `?${config.filter}=${filter}` : ""}`)
      .then((r) => active && setItems(r.items))
      .catch((e) => active && setError(e));
    return () => {
      active = false;
    };
  }, [entityKey, filter, config.filter]);

  async function remove(item) {
    try {
      await del(`/admin/${entityKey}/${item.id}`);
      setItems((list) => list.filter((x) => x.id !== item.id));
      notify("Elemento eliminado", { tone: "success" });
      onChanged?.();
    } catch (err) {
      notify(err.message, { tone: "error" });
    } finally {
      setConfirmId(null);
    }
  }

  function saved(item) {
    setItems((list) => {
      const exists = list.some((x) => x.id === item.id);
      return exists ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item];
    });
    setEditing(null);
    onChanged?.();
  }

  const cell = (item, col) => {
    const v = item[col];
    if (labels[col]) return labels[col][v] ?? "—";
    if (typeof v === "string" && v.length > 70) return v.slice(0, 70) + "…";
    return String(v ?? "—");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        {filterField ? (
          <div>
            <label htmlFor="filtro" className="mb-1 block font-semibold">
              Filtrar por {filterField.label.toLowerCase()}
            </label>
            <select id="filtro" className={inputClass} value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">Todos</option>
              {(options[filterField.relation] ?? []).map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <span />
        )}
        <Button onClick={() => setEditing("new")}>Crear nuevo</Button>
      </div>

      {editing && (
        <EntityForm
          key={editing === "new" ? "new" : editing.id}
          entityKey={entityKey}
          config={config}
          item={editing === "new" ? null : editing}
          options={options}
          onSaved={saved}
          onCancel={() => setEditing(null)}
        />
      )}

      {error ? (
        <ErrorState error={error} />
      ) : !items ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white dark:border-night-3 dark:bg-night-2">
          <table className="w-full text-left text-[0.95rem]">
            <caption className="sr-only">{config.label}</caption>
            <thead>
              <tr className="border-b border-line dark:border-night-3">
                {config.columns.map((c) => (
                  <th key={c} scope="col" className="px-4 py-3 font-semibold">
                    {config.fields.find((f) => f.name === c)?.label.split(" (")[0] ?? c}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0 dark:border-night-3">
                  {config.columns.map((c) => (
                    <td key={c} className="px-4 py-3 align-top">
                      {cell(item, c)}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-2 text-right">
                    {confirmId === item.id ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="text-sm">¿Eliminar también su contenido relacionado?</span>
                        <Button size="sm" variant="danger" onClick={() => remove(item)}>
                          Sí, eliminar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                          No
                        </Button>
                      </span>
                    ) : (
                      <span className="inline-flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setEditing(item)}>
                          Editar
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-700 dark:text-red-400" onClick={() => setConfirmId(item.id)}>
                          Eliminar
                        </Button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={config.columns.length + 1} className="px-4 py-6 text-center text-ink/65">
                    No hay elementos. Usa «Crear nuevo» para agregar el primero.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
