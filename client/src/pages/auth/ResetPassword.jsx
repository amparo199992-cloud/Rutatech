import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Button, ButtonLink, Field, FormError } from "../../components/ui.jsx";
import { post } from "../../lib/api.js";
import { useSeo } from "../../lib/seo.js";
import AuthShell from "./AuthShell.jsx";
import { validatePassword } from "./Register.jsx";

export default function ResetPassword() {
  useSeo("Nueva contraseña");
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const local = {};
    const pw = validatePassword(password);
    if (pw) local.password = pw;
    if (password !== confirm) local.confirm = "Las contraseñas no coinciden.";
    setErrors(local);
    setMessage("");
    if (Object.keys(local).length) return;
    setLoading(true);
    try {
      await post("/auth/reset-password", { token, password });
      setDone(true);
    } catch (err) {
      setErrors(err.fields);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!token)
    return (
      <AuthShell title="Enlace incompleto">
        <p>Este enlace no tiene el código de recuperación. Solicita uno nuevo.</p>
        <ButtonLink to="/recuperar" className="mt-4">
          Solicitar enlace
        </ButtonLink>
      </AuthShell>
    );

  return (
    <AuthShell title="Crea una nueva contraseña">
      {done ? (
        <div role="status">
          <p className="text-lg font-semibold">Tu contraseña se actualizó.</p>
          <ButtonLink to="/ingresar" className="mt-4">
            Iniciar sesión
          </ButtonLink>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5" noValidate>
          <FormError message={message} />
          {message.includes("venció") && (
            <Link to="/recuperar" className="block font-semibold text-cobalt-600 underline dark:text-cobalt-300">
              Solicitar un enlace nuevo
            </Link>
          )}
          <Field id="password" label="Nueva contraseña" type="password" autoComplete="new-password" hint="Mínimo 8 caracteres, con letras y números." value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
          <Field id="confirm" label="Repite la contraseña" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Guardar contraseña
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
