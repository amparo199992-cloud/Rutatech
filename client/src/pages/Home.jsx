import { Link } from "react-router";
import { RouteLineHero } from "../components/RouteLine.jsx";
import { ButtonLink, Container } from "../components/ui.jsx";
import { useAuth } from "../lib/auth.jsx";
import { useSeo } from "../lib/seo.js";
import { stageColor } from "../lib/stages.js";

const STAGES = [
  { order: 1, slug: "fundamentos", title: "Fundamentos de tecnología", text: "Cómo funciona una computadora, la terminal, internet, seguridad básica y tu primer repositorio en GitHub." },
  { order: 2, slug: "python", title: "Programación con Python", text: "Variables, decisiones, bucles, funciones, colecciones, archivos y entornos virtuales." },
  { order: 3, slug: "ciencias-computacion", title: "Ciencias de la computación", text: "Algoritmos, complejidad, estructuras de datos, recursión, C y bases de datos con SQL." },
  { order: 4, slug: "desarrollo-web", title: "Desarrollo web y bases de datos", text: "HTML semántico, CSS responsive, JavaScript, ramas de Git y diseño de tablas." },
  { order: 5, slug: "especializacion", title: "Especialización", text: "Web, datos, ciberseguridad, soporte e infraestructura, o IA y automatización." },
  { order: 6, slug: "portafolio-empleo", title: "Portafolio y empleo", text: "Portafolio, GitHub y LinkedIn, CV técnico, entrevistas y un proyecto final." },
];

const BENEFITS = [
  { title: "Aprendizaje práctico", text: "Cada lección trae ejercicios que se corrigen al instante, incluidos retos de código en Python y JavaScript que se ejecutan en tu navegador." },
  { title: "Proyectos reales", text: "Construyes una calculadora, un gestor de tareas, un sistema con base de datos, tu portafolio y un proyecto final para mostrar en entrevistas." },
  { title: "Progreso medible", text: "Ves tu avance por módulo, etapa y ruta, tu racha de estudio, tus puntos e insignias, y qué te toca después." },
  { title: "Recursos confiables", text: "Te enlazamos a fuentes reconocidas como CS50 de Harvard, MDN, la documentación oficial de Python y freeCodeCamp." },
];

const TESTIMONIALS = [
  { name: "Laura M.", role: "Auxiliar contable que quiere pasarse a análisis de datos", quote: "Por fin entendí qué hace la terminal. Las explicaciones con ejemplos de la vida diaria me ayudaron mucho." },
  { name: "Andrés P.", role: "Estudiante de último año de bachillerato", quote: "Los retos de Python me engancharon: ver todas las pruebas en verde es muy satisfactorio." },
  { name: "Marcela R.", role: "Docente que aprende a automatizar tareas", quote: "Me gusta que me diga cuánto me falta según las horas que tengo por semana." },
];

const FAQ = [
  { q: "¿Necesito saber algo antes de empezar?", a: "No. La ruta empieza explicando cómo funciona una computadora. Solo necesitas un computador con internet y ganas de practicar." },
  { q: "¿Cuánto tiempo toma?", a: "La ruta base (etapas 1 a 4) toma unos 6 meses estudiando alrededor de 10 horas por semana. La especialización y el portafolio suman de 3 a 5 meses más. Puedes ir a tu ritmo: tu panel calcula cuánto te falta según tus horas." },
  { q: "¿Es gratis?", a: "Sí, RutaTech es gratuita. Algunos recursos externos recomendados tienen opciones de pago (por ejemplo, los Certificados de Google en Coursera); siempre lo indicamos." },
  { q: "¿Me dan un certificado?", a: "RutaTech no emite certificados oficiales. Te mostramos tu progreso e insignias, y te recomendamos programas que sí certifican, como CS50 o freeCodeCamp. Para conseguir empleo, tu portafolio pesa mucho." },
  { q: "¿Puedo usarla desde el celular?", a: "Sí, todo se adapta a móvil. Para programar te recomendamos un computador, aunque los retos también funcionan en el navegador del celular." },
  { q: "¿Qué pasa con mis datos?", a: "Guardamos solo lo necesario para tu cuenta y tu progreso. Tu contraseña se guarda cifrada con un hash. Lee la política de privacidad para más detalles." },
];

export default function Home() {
  useSeo(null);
  const { user } = useAuth();
  return (
    <>
      <section className="overflow-hidden border-b border-line dark:border-night-3">
        <Container className="grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div>
            <h1 className="text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">Aprende tecnología desde cero, paso a paso</h1>
            <p className="mt-6 max-w-xl text-xl text-ink/80 dark:text-slate-300">Una ruta práctica para dominar programación, web, datos, redes y seguridad.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to={user ? "/panel" : "/registro"} size="lg">
                {user ? "Continuar donde quedé" : "Comenzar gratis"}
              </ButtonLink>
              <ButtonLink to="/ruta" variant="secondary" size="lg">
                Ver la ruta completa
              </ButtonLink>
              <ButtonLink to="/modulos" variant="ghost" size="lg">
                Explorar módulos
              </ButtonLink>
            </div>
            <p className="mt-6 text-ink/65 dark:text-slate-400">6 etapas, 37 módulos y 16 proyectos. Sin requisitos previos.</p>
          </div>
          <div className="text-ink dark:text-slate-100">
            <RouteLineHero />
          </div>
        </Container>
      </section>

      <section aria-labelledby="beneficios" className="py-16 sm:py-20">
        <Container>
          <h2 id="beneficios" className="max-w-2xl text-3xl font-bold sm:text-4xl">Aprendes haciendo, no solo leyendo</h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {BENEFITS.map((b, i) => (
              <div key={b.title} className="border-l-4 pl-5" style={{ borderColor: stageColor(i + 1) }}>
                <h3 className="text-xl font-bold">{b.title}</h3>
                <p className="mt-2 text-ink/75 dark:text-slate-300">{b.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="etapas" className="border-y border-line bg-white py-16 dark:border-night-3 dark:bg-night-2 sm:py-20">
        <Container>
          <h2 id="etapas" className="text-3xl font-bold sm:text-4xl">Seis estaciones, un destino</h2>
          <p className="mt-3 max-w-2xl text-lg text-ink/75 dark:text-slate-300">Cada etapa se apoya en la anterior. Puedes ver el contenido de cualquier etapa antes de crear tu cuenta.</p>
          <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {STAGES.map((s) => (
              <li key={s.slug}>
                <Link to={`/etapas/${s.slug}`} className="group flex h-full gap-4 rounded-2xl p-3 hover:bg-paper dark:hover:bg-night">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[5px] font-display text-lg font-extrabold"
                    style={{ borderColor: stageColor(s.order) }}
                  >
                    {s.order}
                  </span>
                  <span>
                    <span className="block font-display text-xl font-bold group-hover:underline">{s.title}</span>
                    <span className="mt-1 block text-ink/75 dark:text-slate-300">{s.text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="testimonios" className="py-16 sm:py-20">
        <Container>
          <h2 id="testimonios" className="text-3xl font-bold sm:text-4xl">Cómo se vive la ruta</h2>
          <p className="mt-3 max-w-2xl text-ink/75 dark:text-slate-300">
            Estos testimonios son <strong>ejemplos ficticios</strong> que ilustran la experiencia; no corresponden a personas reales.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="rounded-2xl border-2 border-dashed border-line p-6 dark:border-night-3">
                <span className="inline-block rounded-md bg-signal-50 px-2 py-0.5 text-sm font-semibold text-[#8a5a00] dark:bg-signal/15 dark:text-signal">Ejemplo ficticio</span>
                <blockquote className="mt-4 text-lg">“{t.quote}”</blockquote>
                <figcaption className="mt-4">
                  <span className="block font-bold">{t.name}</span>
                  <span className="text-ink/65 dark:text-slate-400">{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="faq" className="border-t border-line bg-white py-16 dark:border-night-3 dark:bg-night-2 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <h2 id="faq" className="text-3xl font-bold sm:text-4xl">Preguntas frecuentes</h2>
          <div className="divide-y divide-line dark:divide-night-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                  {f.q}
                  <span aria-hidden="true" className="text-2xl text-cobalt-500 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[65ch] text-ink/80 dark:text-slate-300">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-cobalt-500 px-6 py-10 text-white sm:px-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold">Tu primera lección dura 15 minutos</h2>
            <p className="mt-2 text-lg text-white/85">Empieza hoy y guarda tu progreso desde el primer día.</p>
          </div>
          <Link to={user ? "/panel" : "/registro"} className="inline-flex min-h-14 items-center rounded-xl bg-white px-7 text-lg font-bold text-cobalt-700 hover:bg-signal hover:text-ink">
            {user ? "Ir a mi panel" : "Crear mi cuenta gratis"}
          </Link>
        </Container>
      </section>
    </>
  );
}
