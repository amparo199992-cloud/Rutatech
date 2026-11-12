import { Container, ExternalLink } from "../../components/ui.jsx";
import { useSeo } from "../../lib/seo.js";

// Reemplaza el correo y los enlaces por los de tu organización.
const CONTACT_EMAIL = "contacto@rutatech.example";

export default function Contact() {
  useSeo("Contacto");
  return (
    <Container className="max-w-3xl py-12">
      <h1 className="text-4xl font-extrabold">Contacto</h1>
      <p className="mt-4 text-lg">¿Encontraste un error en una lección, tienes una sugerencia o quieres colaborar con contenido?</p>
      <ul className="mt-6 space-y-3 text-lg">
        <li>
          Escríbenos a{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-cobalt-600 underline dark:text-cobalt-300">
            {CONTACT_EMAIL}
          </a>
        </li>
        <li>
          Si dudas en un tema, la comunidad de{" "}
          <ExternalLink href="https://forum.freecodecamp.org/" className="font-semibold text-cobalt-600 underline dark:text-cobalt-300">
            freeCodeCamp en español
          </ExternalLink>{" "}
          es un buen lugar para preguntar.
        </li>
      </ul>
    </Container>
  );
}
