import { useState } from "react";
import { Link } from "react-router";
import { Button, Field } from "../../components/ui.jsx";
import { post } from "../../lib/api.js";
import { useSeo } from "../../lib/seo.js";
import AuthShell from "./AuthShell.jsx";

export default function ForgotPassword() {
  useSeo("Recuperar contraseña");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Escribe un correo válido.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const r = await post("/auth/forgot-password", { email: email.trim() });
      setSent(r.message);
    } catch (err) {
      setError(err.fields?.email ?? err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Recupera tu contraseña"
      intro="Te enviaremos un enlace para crear una nueva. Es válido por una hora."
      footer={
        <Link to="/ingresar" className="font-semibold text-cobalt-600 underline dark:text-cobalt-300">
          Volver a iniciar sesión
        </Link>
      }
    >
      {sent ? (
        <div role="status">
          <p className="text-lg font-semibold">Revisa tu correo</p>
          <p className="mt-2 text-ink/80 dark:text-slate-300">{sent} Si no lo ves, busca en la carpeta de spam.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5" noValidate>
          <Field id="email" label="Correo de tu cuenta" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Enviar enlace
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
