import { ButtonLink, Container } from "../../components/ui.jsx";
import { useSeo } from "../../lib/seo.js";

export default function NotFound() {
  useSeo("Página no encontrada");
  return (
    <Container className="py-20 text-center">
      <p className="font-display text-7xl font-extrabold text-cobalt-500">404</p>
      <h1 className="mt-4 text-3xl font-bold">Esta estación no existe</h1>
      <p className="mt-2 text-lg text-ink/75 dark:text-slate-300">Revisa la dirección o vuelve a la ruta para seguir aprendiendo.</p>
      <div className="mt-6 flex justify-center gap-3">
        <ButtonLink to="/ruta">Ver la ruta</ButtonLink>
        <ButtonLink to="/" variant="secondary">
          Ir al inicio
        </ButtonLink>
      </div>
    </Container>
  );
}
