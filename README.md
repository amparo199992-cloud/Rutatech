# RutaTech

**Aprende tecnología desde cero, paso a paso.** RutaTech es una plataforma web de aprendizaje guiado para personas principiantes. Recorre una ruta de 6 etapas (fundamentos, Python, ciencias de la computación, desarrollo web y bases de datos, especialización, y portafolio y empleo) con lecciones, ejercicios que se corrigen al instante, retos de código, quizzes, proyectos, insignias y seguimiento del progreso.

> Toda la interfaz y el contenido están en español. Los recursos externos (CS50, freeCodeCamp, MDN, etc.) se enlazan e identifican como sitios de terceros; RutaTech no está afiliada a ellos.

---

## Contenido

1. [Qué incluye](#qué-incluye)
2. [Tecnologías y por qué](#tecnologías-y-por-qué)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Ejecutar en tu computador](#ejecutar-en-tu-computador)
5. [Desplegar en la nube](#desplegar-en-la-nube)
6. [Variables de entorno](#variables-de-entorno)
7. [Modelo de datos](#modelo-de-datos)
8. [Editar el contenido](#editar-el-contenido)
9. [Seguridad y accesibilidad](#seguridad-y-accesibilidad)
10. [Mejoras futuras](#mejoras-futuras)

Documentación adicional: [Guía para publicar](docs/PUBLICAR.md) · [API REST](docs/API.md) · [Sistema de diseño](docs/DISENO.md)

---

## Qué incluye

**Contenido inicial (datos semilla)**

| | Cantidad |
|---|---|
| Etapas | 6 |
| Módulos | 37 (cada uno con objetivos, checklist de dominio, recursos y quiz de 5 preguntas) |
| Lecciones | 50, en Markdown con ejemplos de código |
| Ejercicios | 117: 55 de opción múltiple, 26 de completar código, 19 de «¿qué imprime?» y 17 retos con pruebas automáticas (15 en Python y 2 en JavaScript) |
| Preguntas de quiz | 185, cada una con explicación |
| Proyectos | 16, con pasos, criterios de evaluación e ideas de mejora |
| Especializaciones | 5: desarrollo web, datos y análisis, ciberseguridad, soporte e infraestructura, IA y automatización |
| Recursos | 12 en la biblioteca (CS50, freeCodeCamp, Python, MDN, Pro Git, GitHub Docs, Google Career Certificates, W3Schools, The Odin Project, Microsoft Learn, Kaggle Learn, OWASP) |
| Insignias | 18 |

Todas las soluciones de los retos y las salidas de los ejercicios «¿qué imprime?» se verificaron ejecutándolas.

**Funcionalidades**

- Página de inicio con hero, beneficios, etapas, testimonios marcados como ficticios, preguntas frecuentes y footer.
- Ruta visual tipo mapa de transporte: cada etapa es una estación con su avance.
- Módulos con lecciones, ejercicios interactivos, quiz con retroalimentación inmediata, checklist, recursos y siguiente módulo recomendado.
- **Retos de programación con validación automática** en Python (con [Pyodide](https://pyodide.org)) y JavaScript. El código se ejecuta en el navegador dentro de un iframe aislado y un Web Worker con límite de tiempo, así un bucle infinito no congela la página y el código no puede leer la sesión.
- Sistema de progreso: barras por módulo, etapa y ruta; racha diaria; puntos; niveles (Novato, Explorador, Constructor, Practicante, Especialista); insignias; historial de actividad; siguiente paso recomendado; repaso de temas pendientes (quizzes con menos de 4/5 y ejercicios sin resolver).
- Recomendaciones personalizadas según tus horas por semana, tu meta y tu avance.
- Proyectos con entrega de enlace de GitHub y opción de marcarlos como completados.
- Cuentas con correo y contraseña, recuperación de contraseña por correo, perfil editable y rutas privadas protegidas.
- Panel de administración: crear, editar y eliminar etapas, especializaciones, módulos, lecciones, ejercicios, preguntas, proyectos y recursos; ver usuarios, su progreso y estadísticas generales; asignar el rol de administrador.
- Modo claro y oscuro (o según el dispositivo), diseño responsive, SEO básico (títulos y descripciones por página, `sitemap.xml` dinámico, `robots.txt`).

## Tecnologías y por qué

| Capa | Elección | Por qué |
|---|---|---|
| Frontend | **React 19 + Vite + React Router 7** | Vite arranca en milisegundos y compila un sitio estático liviano. Se eligió en lugar de Next.js porque el backend ya es una API REST independiente: así el proyecto tiene una separación clara frontend/API, fácil de entender para quien está aprendiendo. Las páginas se cargan bajo demanda (*code splitting*). |
| Estilos | **Tailwind CSS 4** | Estilos consistentes con tokens de diseño (colores, tipografías) definidos en un solo lugar, modo oscuro con una clase y CSS final pequeño. |
| Backend | **Node.js + Express 5** | Mismo lenguaje que el frontend, ecosistema enorme y una API mínima fácil de leer. Express 5 maneja los errores de funciones `async` sin código extra. NestJS añadiría estructura útil en equipos grandes, pero también mucha ceremonia para una primera versión. |
| Base de datos | **SQLite** en desarrollo, **PostgreSQL** en producción | SQLite es un archivo: no hay que instalar nada para empezar. PostgreSQL es robusto y gratuito en la nube. El esquema es compatible con ambos y se cambia con un comando. |
| ORM | **Prisma 7** con adaptadores de controlador | Esquema legible, consultas con autocompletado y migraciones. Prisma 7 usa adaptadores (`better-sqlite3`, `pg`) en lugar de un motor binario. |
| Autenticación | **JWT en cookie `httpOnly`** | El token no es accesible desde JavaScript (protege contra robo por XSS), dura 7 días y las contraseñas se guardan con **bcrypt**. |
| Validación | **zod** | Mensajes de error claros en español, por campo. |
| Control de versiones | **Git + GitHub** | Estándar de la industria; además los proyectos del curso se entregan con enlaces de GitHub. |
| Despliegue | **Render** (recomendado), Railway o similar | Un solo servicio sirve la API y el frontend en el mismo dominio, lo que simplifica cookies y seguridad. Incluye `render.yaml` para desplegar con un clic. |

## Estructura del proyecto

```text
rutatech/
├── package.json              # Scripts raíz: setup, dev, build, start
├── render.yaml               # Despliegue en Render (servicio web)
├── scripts/setup.js          # Instalación local en un paso
├── docs/
│   ├── PUBLICAR.md           # Guía paso a paso: GitHub, Neon y Render
│   ├── API.md                # Referencia de la API REST
│   └── DISENO.md             # Tokens y decisiones de diseño
├── server/                   # API REST (Express + Prisma)
│   ├── prisma.config.js      # Configuración de Prisma 7 (URL de la base de datos)
│   ├── prisma/
│   │   ├── schema.prisma     # Modelos de datos
│   │   ├── seed.js           # Carga idempotente del contenido inicial
│   │   └── content/          # Contenido del curso
│   │       ├── stage1.js … stage6.js   # Módulos, ejercicios y quizzes por etapa
│   │       ├── lessons/stage1.md …     # Texto de las lecciones (Markdown)
│   │       ├── projects.js · resources.js · badges.js · helpers.js
│   ├── scripts/switch-provider.js      # Cambia entre SQLite y PostgreSQL
│   ├── src/
│   │   ├── index.js · app.js · config.js · db.js
│   │   ├── middleware/       # auth.js (sesión y roles), validate.js (zod)
│   │   ├── lib/              # progress.js, gamification.js, mailer.js, errors.js
│   │   └── routes/           # auth, users, content, learning, admin
│   └── test/logic.test.js    # Pruebas de progreso y gamificación
└── client/                   # Frontend (React + Vite + Tailwind)
    ├── index.html
    ├── public/
    │   ├── sandbox.html · sandbox-runner.js   # Entorno aislado para ejecutar retos
    │   ├── theme-init.js · favicon.svg · robots.txt
    └── src/
        ├── App.jsx · main.jsx · index.css
        ├── lib/              # api, auth, theme, toast, runner, seo, useFetch
        ├── components/       # Layout, ui, RouteLine, Markdown, ProtectedRoute, exercises/
        └── pages/            # Home, Roadmap, StagePage, Modules, ModulePage, LessonPage,
                              # QuizPage, Projects, ProjectPage, Resources, Specializations,
                              # Dashboard, Profile, auth/, admin/, static/
```

## Ejecutar en tu computador

**Requisitos:** [Node.js](https://nodejs.org) 20.19 o superior (recomendado 22 LTS) y Git.

```bash
git clone https://github.com/tu-usuario/rutatech.git
cd rutatech
npm run setup      # instala todo, crea server/.env, la base de datos SQLite y carga el contenido
npm run dev        # inicia la API (puerto 4000) y el frontend (puerto 5173)
```

Abre **http://localhost:5173**.

- **Cuenta de administración:** `admin@rutatech.local` / `CambiaEsto123` (definida en `server/.env`; cámbiala).
- **Recuperar contraseña en local:** sin servidor de correo configurado, el enlace aparece en la consola donde corre la API.
- **Ver la base de datos:** `npm run db:studio --prefix server` abre Prisma Studio.
- **Pruebas:** `npm test`.
- **Volver a cargar el contenido** después de editarlo: `npm run db:seed --prefix server` (no borra el progreso de los usuarios).

### Probar como en producción

```bash
npm run build                 # compila el frontend en client/dist
NODE_ENV=production JWT_SECRET=un-secreto-largo npm start
# Abre http://localhost:4000 (Express sirve la API y el frontend)
```

## Desplegar en la nube

### Opción A: Render + Neon (recomendada, gratis)

La guía paso a paso completa está en [docs/PUBLICAR.md](docs/PUBLICAR.md). En resumen:

1. Sube el proyecto a un repositorio de GitHub.
2. Crea una base de datos PostgreSQL gratuita en [Neon](https://neon.com) y copia su cadena de conexión **directa** (sin *pooling*).
3. En [Render](https://render.com) elige **New → Blueprint** y selecciona el repositorio. Render lee `render.yaml` y te pide `DATABASE_URL`, `CLIENT_URL`, `SITE_URL`, `ADMIN_EMAIL` y `ADMIN_PASSWORD`.
4. Cada `git push` vuelve a desplegar. En cada arranque se sincroniza el esquema y se actualiza el contenido sin borrar el progreso.

> No uses la base de datos gratuita de Render para datos reales: vence a los 30 días y luego se borra. El servicio web gratuito se suspende tras 15 minutos sin visitas y tarda cerca de un minuto en despertar.

### Opción B: Railway u otro proveedor con Node.js

- Crea una base de datos PostgreSQL y copia su `DATABASE_URL`.
- Comando de compilación: `npm run render-build` (cambia el esquema a PostgreSQL y compila).
- Comando de inicio: `npm run render-start`.
- Variables: `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `SITE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

### Opción C: frontend en Vercel y API en Render (dominios separados)

1. API en Render como en la opción A, con `CORS_ORIGIN=https://tu-app.vercel.app` y `COOKIE_SAMESITE=none`.
2. Frontend en Vercel: directorio raíz `client`, comando `npm run build`, salida `dist`, variable `VITE_API_URL=https://tu-api.onrender.com`. El archivo `client/vercel.json` ya redirige las rutas de la app a `index.html`.
3. Ten en cuenta que algunos navegadores limitan las cookies entre dominios distintos; por eso la opción A es la más simple y robusta.

### Correo para recuperar contraseñas

La forma más sencilla en la nube es [Resend](https://resend.com): define `RESEND_API_KEY` y `MAIL_FROM`. Envía por HTTPS, así que funciona aunque el proveedor bloquee los puertos SMTP. También puedes usar SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).

### Python sin acceso a internet externo (opcional)

Los retos de Python descargan Pyodide desde jsDelivr la primera vez (~10 MB). Si tu red bloquea ese sitio (colegios, bibliotecas), puedes autoalojarlo:

```bash
npm install pyodide@0.29.5 --prefix /tmp/py
mkdir -p client/public/pyodide
cp /tmp/py/node_modules/pyodide/{pyodide.js,pyodide.asm.js,pyodide.asm.wasm,python_stdlib.zip,pyodide-lock.json} client/public/pyodide/
VITE_PYODIDE_URL=/pyodide/ npm run build
```

## Variables de entorno

Todas están documentadas en [`server/.env.example`](server/.env.example).

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí | `file:./prisma/dev.db` (SQLite) o `postgresql://…` |
| `JWT_SECRET` | En producción | Secreto largo y aleatorio para firmar sesiones |
| `NODE_ENV` | No | `production` activa cookies seguras y exige `JWT_SECRET` |
| `PORT` | No | Puerto de la API (4000 por defecto) |
| `CLIENT_URL` / `SITE_URL` | En producción | URL pública (enlaces de correo y sitemap) |
| `CORS_ORIGIN`, `COOKIE_SAMESITE` | Solo con dominios separados | Ver opción C |
| `APP_TIMEZONE` | No | Zona horaria de la racha diaria (por defecto `America/Bogota`) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | No | Cuenta administradora que crea el seed |
| `RESEND_API_KEY`, `SMTP_*`, `MAIL_FROM` | No | Envío de correos (Resend o SMTP) |
| `VITE_API_URL`, `VITE_PYODIDE_URL` | No (frontend) | API en otro dominio; Pyodide autoalojado |

## Modelo de datos

Definido en [`server/prisma/schema.prisma`](server/prisma/schema.prisma):

- **Contenido:** `Stage` (etapa) → `Module` → `Lesson` → `Exercise`; `Module` → `QuizQuestion`; `Specialization` → `Module`; `Project`; `Resource`; `Badge`.
- **Usuarios y progreso:** `User`, `PasswordResetToken`, `LessonProgress`, `ExerciseResult`, `QuizAttempt`, `ChecklistProgress`, `ProjectSubmission`, `UserBadge`, `Activity`.
- Las listas (objetivos, opciones, recursos…) se guardan como texto JSON para que el mismo esquema funcione en SQLite y PostgreSQL.
- Las respuestas correctas de ejercicios y quizzes **nunca se envían al navegador** antes de responder.

**Reglas de progreso:** cada lección completada y el quiz aprobado (3 de 5) son unidades de avance del módulo. En la etapa 5 solo cuenta la especialización elegida. Puntos: lección 10, ejercicio 5, reto 10, quiz aprobado 20 (+10 si es perfecto), proyecto entregado 40 y completado 20.

## Editar el contenido

Hay dos caminos:

1. **Panel de administración** (`/admin`): para cambios puntuales. Se guardan directamente en la base de datos.
2. **Archivos de contenido** (`server/prisma/content/`): para cambios grandes y versionados con Git. El texto de las lecciones está en `lessons/stageN.md`, separado por marcadores `<!-- @lesson clave -->`; los módulos, ejercicios y quizzes están en `stageN.js`. Después ejecuta `npm run db:seed --prefix server`. El seed valida que cada quiz tenga 5 preguntas y que cada lección tenga contenido.

> Si editas algo en el panel y luego vuelves a ejecutar el seed, el contenido del archivo sobrescribe ese elemento. Elige una sola fuente de verdad para cada parte del contenido.

## Seguridad y accesibilidad

**Seguridad**

- Contraseñas con bcrypt (12 rondas); sesión en cookie `httpOnly`, `SameSite` y `Secure` en producción.
- Límite de intentos en registro, inicio de sesión y recuperación de contraseña.
- Recuperación con token aleatorio de un solo uso, guardado como hash y válido por 1 hora; la respuesta no revela si el correo existe.
- Defensa CSRF: toda petición que modifica datos debe ser JSON.
- Cabeceras de seguridad con Helmet y política de contenido (CSP) estricta; el entorno de retos tiene su propia política aislada.
- Permisos de administrador verificados en el servidor en cada petición.
- El Markdown se renderiza sin HTML crudo (sin riesgo de XSS desde el contenido).

**Accesibilidad (WCAG básica)**

- HTML semántico, enlace «Saltar al contenido», foco visible en todos los controles.
- Formularios con etiquetas, errores asociados al campo y mensajes en vivo (`aria-live`).
- Barras de progreso con `role="progressbar"`, contraste de color adecuado en modo claro y oscuro.
- Tipografía Atkinson Hyperlegible Next, diseñada para máxima legibilidad.
- Botones grandes (mínimo 44–48 px), la animación de la portada respeta `prefers-reduced-motion` y el editor de código permite salir con el teclado (Esc y luego Tab).

## Mejoras futuras

- Migraciones versionadas (`prisma migrate`) en lugar de `db push` cuando el esquema se estabilice.
- Verificación de correo al registrarse e inicio de sesión con Google o GitHub.
- Revisión de proyectos por mentores o entre pares, con comentarios.
- Más lecciones por módulo, videos y contenido de cada especialización más allá del módulo introductorio.
- Retos de SQL ejecutados en el navegador (por ejemplo con sql.js) y de C con un compilador en WebAssembly.
- Certificados descargables por etapa y perfil público compartible.
- Notificaciones o recordatorios para mantener la racha.
- Foro o comentarios por lección, y modo de estudio sin conexión (PWA).
- Panel de administración con historial de cambios y editor Markdown con vista previa.
- Pruebas end to end (Playwright) e integración continua con GitHub Actions.
- Prerenderizado de páginas públicas para un SEO más completo.
