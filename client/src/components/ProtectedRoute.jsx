import { Link, Navigate, useLocation } from "react-router";
import { useAuth } from "../lib/auth.jsx";
import { Loading } from "./ui.jsx";

// Protege páginas privadas: si no hay sesión, envía a iniciar sesión y luego regresa.
export default function ProtectedRoute({ children, admin = false }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <Loading label="Verificando tu sesión…" />;
  if (!user) return <Navigate to={`/ingresar?volver=${encodeURIComponent(location.pathname)}`} replace />;
  if (admin && user.role !== "ADMIN") return <Navigate to="/panel" replace />;
  return children;
}

// Aviso para acciones que requieren cuenta (en páginas públicas).
export function LoginPrompt({ action = "guardar tu progreso" }) {
  const location = useLocation();
  return (
    <p className="rounded-xl border-2 border-dashed border-cobalt-300 bg-cobalt-50 px-4 py-3 dark:border-cobalt-700 dark:bg-night-2">
      <Link to={`/ingresar?volver=${encodeURIComponent(location.pathname)}`} className="font-semibold text-cobalt-600 underline dark:text-cobalt-300">
        Inicia sesión
      </Link>{" "}
      o{" "}
      <Link to="/registro" className="font-semibold text-cobalt-600 underline dark:text-cobalt-300">
        crea una cuenta gratis
      </Link>{" "}
      para {action}.
    </p>
  );
}
