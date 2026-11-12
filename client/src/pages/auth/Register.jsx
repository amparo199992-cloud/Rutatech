import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { Button, Field, FormError } from "../../components/ui.jsx";
import { useAuth } from "../../lib/auth.jsx";
import { useSeo } from "../../lib/seo.js";
import { useToast } from "../../lib/toast.jsx";
import AuthShell from "./AuthShell.jsx";

export function validatePassword(pw) {
  if (pw.length < 8) return "Usa al menos 8 caracteres.";
  if (!/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(pw)) return "Incluye al menos una letra.";
  if (!/\d/.test(pw)) return "Incluye al menos un número.";
  return null;
}

export default function Register() {
  useSeo("Crear cuenta", "Crea tu cuenta gratis en RutaTech y guarda tu progreso.");
  const { register, user } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", accept: false });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/panel" replace />;

  async function submit(e) {
    e.preventDefault();
    const local = {};
    if (form.name.trim().length < 2) local.name = "Escribe tu nombre (al menos 2 letras).";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) local.email = "Escribe un correo válido, por ejemplo nombre@correo.com.";
    const pw = validatePassword(form.password);
    if (pw) local.password = pw;
    if (!form.accept) local.accept = "Debes aceptar la política de privacidad para continuar.";
    setErrors(local);
    setMessage("");
    if (Object.keys(local).length) return;
    setLoading(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      notify("¡Bienvenido a RutaTech! Tu primera lección te espera.", { tone: "success", icon: "🎉" });
      navigate("/panel", { replace: true });
    } catch (err) {
      setErrors(err.fields);
      setMessage(Object.keys(err.fields).length ? "" : err.message);
    } finally {
      setLoading(false);
    }
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AuthShell
      title="Crea tu cuenta gratis"
      intro="Guarda tu progreso, gana insignias y recibe recomendaciones para tu siguiente paso."
      footer={
        <p>
          ¿Ya tienes cuenta?{" "}
          <Link to="/ingresar" className="font-semibold text-cobalt-600 underline dark:text-cobalt-300">
            Inicia sesión
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        <FormError message={message} />
        <Field id="name" label="Tu nombre" autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} />
        <Field id="email" label="Correo electrónico" type="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
        <Field
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          hint="Mínimo 8 caracteres, con letras y números. Una frase larga es más segura."
          value={form.password}
          onChange={set("password")}
          error={errors.password}
        />
        <div>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 accent-cobalt-500"
              checked={form.accept}
              onChange={(e) => setForm((f) => ({ ...f, accept: e.target.checked }))}
              aria-invalid={Boolean(errors.accept)}
              aria-describedby={errors.accept ? "accept-error" : undefined}
            />
            <span>
              Acepto la{" "}
              <Link to="/privacidad" className="font-semibold text-cobalt-600 underline dark:text-cobalt-300">
                política de privacidad
              </Link>
              .
            </span>
          </label>
          {errors.accept && (
            <p id="accept-error" className="mt-1 text-sm font-medium text-red-700 dark:text-red-400">
              {errors.accept}
            </p>
          )}
        </div>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Crear mi cuenta
        </Button>
      </form>
    </AuthShell>
  );
}
