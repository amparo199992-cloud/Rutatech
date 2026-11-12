import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { Button, Field, FormError } from "../../components/ui.jsx";
import { useAuth } from "../../lib/auth.jsx";
import { useSeo } from "../../lib/seo.js";
import AuthShell from "./AuthShell.jsx";

export function safeRedirect(value) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/panel";
}

export default function Login() {
  useSeo("Iniciar sesión");
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const redirect = safeRedirect(params.get("volver"));

  if (user) return <Navigate to={redirect} replace />;

  async function submit(e) {
    e.preventDefault();
    const local = {};
    if (!form.email.trim()) local.email = "Escribe tu correo.";
    if (!form.password) local.password = "Escribe tu contraseña.";
    setErrors(local);
    setMessage("");
    if (Object.keys(local).length) return;
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      navigate(redirect, { replace: true });
    } catch (err) {
      setErrors(err.fields);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AuthShell
      title="Iniciar sesión"
      intro="Sigue con tu ruta donde la dejaste."
      footer={
        <p>
          ¿Aún no tienes cuenta?{" "}
          <Link to="/registro" className="font-semibold text-cobalt-600 underline dark:text-cobalt-300">
            Crea una gratis
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        <FormError message={message} />
        <Field id="email" label="Correo electrónico" type="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
        <Field id="password" label="Contraseña" type="password" autoComplete="current-password" value={form.password} onChange={set("password")} error={errors.password} />
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Iniciar sesión
        </Button>
        <p className="text-center">
          <Link to="/recuperar" className="font-semibold text-cobalt-600 underline dark:text-cobalt-300">
            Olvidé mi contraseña
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
