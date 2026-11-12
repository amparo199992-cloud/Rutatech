import { useState } from "react";
import { Link } from "react-router";
import { Button, Container, Field, FormError } from "../components/ui.jsx";
import { patch, post } from "../lib/api.js";
import { useAuth } from "../lib/auth.jsx";
import { useSeo } from "../lib/seo.js";
import { useTheme } from "../lib/theme.jsx";
import { useToast } from "../lib/toast.jsx";
import { validatePassword } from "./auth/Register.jsx";

function ProfileForm() {
  const { user, setUser } = useAuth();
  const { notify } = useToast();
  const [form, setForm] = useState({ name: user.name, bio: user.bio ?? "", goal: user.goal ?? "", weeklyHours: user.weeklyHours });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const r = await patch("/users/me", { ...form, weeklyHours: Number(form.weeklyHours) });
      setUser(r.user);
      notify("Perfil guardado", { tone: "success", icon: "✓" });
    } catch (err) {
      setErrors(err.fields);
      if (!Object.keys(err.fields).length) notify(err.message, { tone: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <Field id="name" label="Nombre" value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" />
      <Field id="email" label="Correo" value={user.email} disabled hint="El correo no se puede cambiar por ahora." />
      <Field id="goal" label="Tu meta" placeholder="Ej.: Conseguir mi primer empleo como desarrolladora web" value={form.goal} onChange={set("goal")} error={errors.goal} hint="La usamos para darte recomendaciones." />
      <Field
        id="weeklyHours"
        label="Horas de estudio por semana"
        type="number"
        min="1"
        max="60"
        value={form.weeklyHours}
        onChange={set("weeklyHours")}
        error={errors.weeklyHours}
        hint="Con esto calculamos cuánto te falta para terminar cada etapa."
      />
      <Field id="bio" as="textarea" label="Sobre ti (opcional)" value={form.bio} onChange={set("bio")} error={errors.bio} />
      <Button type="submit" loading={saving}>
        Guardar cambios
      </Button>
    </form>
  );
}

function PasswordForm() {
  const { notify } = useToast();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const pw = validatePassword(form.newPassword);
    if (pw) return setErrors({ newPassword: pw });
    setSaving(true);
    setErrors({});
    setMessage("");
    try {
      await post("/users/me/password", form);
      setForm({ currentPassword: "", newPassword: "" });
      notify("Contraseña actualizada", { tone: "success", icon: "🔒" });
    } catch (err) {
      setErrors(err.fields);
      setMessage(Object.keys(err.fields).length ? "" : err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <FormError message={message} />
      <Field id="currentPassword" type="password" label="Contraseña actual" autoComplete="current-password" value={form.currentPassword} onChange={set("currentPassword")} error={errors.currentPassword} />
      <Field id="newPassword" type="password" label="Nueva contraseña" autoComplete="new-password" hint="Mínimo 8 caracteres, con letras y números." value={form.newPassword} onChange={set("newPassword")} error={errors.newPassword} />
      <Button type="submit" variant="secondary" loading={saving}>
        Cambiar contraseña
      </Button>
    </form>
  );
}

export default function Profile() {
  useSeo("Mi perfil");
  const { user } = useAuth();
  const { mode, setMode } = useTheme();
  return (
    <Container className="max-w-3xl py-10">
      <h1 className="text-4xl font-extrabold">Mi perfil</h1>
      <p className="mt-2 text-ink/70 dark:text-slate-400">
        Nivel {user.level.name}, {user.points} puntos.{" "}
        <Link to="/panel" className="font-semibold text-cobalt-600 underline dark:text-cobalt-300">
          Ver mi panel
        </Link>
      </p>
      <section aria-labelledby="datos" className="mt-8 rounded-2xl border-2 border-line bg-white p-6 dark:border-night-3 dark:bg-night-2">
        <h2 id="datos" className="mb-5 text-2xl font-bold">
          Datos y metas
        </h2>
        <ProfileForm />
      </section>
      <section aria-labelledby="apariencia" className="mt-8 rounded-2xl border-2 border-line bg-white p-6 dark:border-night-3 dark:bg-night-2">
        <h2 id="apariencia" className="text-2xl font-bold">
          Apariencia
        </h2>
        <fieldset className="mt-4 flex flex-wrap gap-2">
          <legend className="sr-only">Tema de color</legend>
          {[
            ["light", "Claro"],
            ["dark", "Oscuro"],
            ["system", "Según mi dispositivo"],
          ].map(([v, l]) => (
            <label key={v} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border-2 px-4 ${mode === v ? "border-cobalt-500" : "border-ink/15 dark:border-white/15"}`}>
              <input type="radio" name="tema" className="accent-cobalt-500" checked={mode === v} onChange={() => setMode(v)} />
              {l}
            </label>
          ))}
        </fieldset>
      </section>
      <section aria-labelledby="seguridad" className="mt-8 rounded-2xl border-2 border-line bg-white p-6 dark:border-night-3 dark:bg-night-2">
        <h2 id="seguridad" className="mb-5 text-2xl font-bold">
          Seguridad
        </h2>
        <PasswordForm />
      </section>
    </Container>
  );
}
