import { Container } from "../../components/ui.jsx";
import { useSeo } from "../../lib/seo.js";

export default function Privacy() {
  useSeo("Política de privacidad");
  return (
    <Container className="py-12">
      <article className="prose-ruta">
        <h1 className="font-display text-4xl font-extrabold">Política de privacidad</h1>
        <p>
          <em>Plantilla inicial. Antes de publicar RutaTech, adáptala a tu organización y a la ley de protección de datos de tu país (por ejemplo, la Ley 1581 de 2012 en Colombia) con asesoría legal.</em>
        </p>
        <h2>Qué datos guardamos</h2>
        <ul>
          <li>Tu nombre y correo electrónico, para identificar tu cuenta.</li>
          <li>Tu contraseña, guardada como un hash irreversible (nunca la vemos en texto plano).</li>
          <li>Tu progreso: lecciones completadas, respuestas a ejercicios y quizzes, proyectos entregados, puntos, insignias y racha.</li>
          <li>Los datos opcionales que agregues a tu perfil: meta, horas de estudio y descripción.</li>
        </ul>
        <h2>Para qué los usamos</h2>
        <ul>
          <li>Guardar tu avance y mostrarte recomendaciones personalizadas.</li>
          <li>Enviarte el enlace de recuperación de contraseña cuando lo pidas.</li>
          <li>Ver estadísticas agregadas para mejorar el contenido.</li>
        </ul>
        <p>No vendemos ni compartimos tus datos con terceros con fines comerciales.</p>
        <h2>Cookies</h2>
        <p>Usamos una única cookie técnica para mantener tu sesión iniciada. Además, tu navegador guarda tu preferencia de tema y el código que escribes en los retos.</p>
        <h2>Código que ejecutas</h2>
        <p>Los retos de programación se ejecutan en tu propio navegador, en un entorno aislado. Para Python se descarga Pyodide desde la red de distribución jsDelivr.</p>
        <h2>Tus derechos</h2>
        <p>Puedes consultar, actualizar o pedir la eliminación de tus datos escribiendo al contacto de la plataforma.</p>
      </article>
    </Container>
  );
}
