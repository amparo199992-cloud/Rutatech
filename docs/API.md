# API REST de RutaTech

Base: `/api`. Todas las respuestas son JSON. Las peticiones que modifican datos (`POST`, `PUT`, `PATCH`, `DELETE`) deben enviar `Content-Type: application/json`.

La sesión viaja en la cookie `rutatech_session` (`httpOnly`). También se acepta `Authorization: Bearer <token>`.

**Errores:** `{ "error": "mensaje en español", "fields": { "campo": "mensaje" } }` con el código HTTP adecuado (400, 401, 403, 404, 409, 415, 429, 500).

## Autenticación — `/api/auth`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/register` | `{ name, email, password }` → crea la cuenta e inicia sesión |
| POST | `/login` | `{ email, password }` |
| POST | `/logout` | Cierra la sesión |
| GET | `/me` | Usuario actual o `{ user: null }` |
| POST | `/forgot-password` | `{ email }` → envía enlace (respuesta idéntica exista o no la cuenta) |
| POST | `/reset-password` | `{ token, password }` |

## Usuario — `/api/users` (requiere sesión)

| Método | Ruta | Descripción |
|---|---|---|
| PATCH | `/me` | `{ name?, bio?, goal?, weeklyHours? }` |
| POST | `/me/password` | `{ currentPassword, newPassword }` |
| PUT | `/me/specialization` | `{ slug }` → elige la especialización |

## Contenido público (incluye progreso si hay sesión)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/roadmap` | Etapas con módulos, proyectos, avance general y siguiente paso |
| GET | `/stages/:slug` | Detalle de etapa (y especializaciones en la etapa 5) |
| GET | `/specializations` · `/specializations/:slug` | Especializaciones |
| GET | `/modules?stage=&level=&q=` | Explorar módulos |
| GET | `/modules/:slug` | Módulo con lecciones, objetivos, checklist, recursos y siguiente módulo |
| GET | `/modules/:slug/quiz` | Preguntas (sin respuestas) |
| GET | `/lessons/:slug` | Lección, ejercicios (sin respuestas), anterior y siguiente |
| GET | `/projects` · `/projects/:slug` | Proyectos y entrega del usuario |
| GET | `/resources` | Biblioteca de recursos |
| GET | `/meta` | Niveles e insignias |
| GET | `/health` | Estado del servidor y la base de datos |

## Aprendizaje (requiere sesión)

Cada respuesta incluye `pointsEarned`, `newBadges` y `user` actualizado.

| Método | Ruta | Cuerpo | Descripción |
|---|---|---|---|
| POST | `/lessons/:slug/complete` | — | Marca la lección como completada |
| POST | `/exercises/:id/check` | `{ answer }` | `choice`: índice · `fill`: `["…"]` · `output`: texto · `challenge`: `{ passed }` |
| POST | `/modules/:slug/quiz` | `{ answers: [0, 2, …] }` | Califica y devuelve explicación por pregunta |
| PUT | `/modules/:slug/checklist` | `{ checked: [0, 1] }` | Guarda la checklist de dominio |
| POST | `/projects/:slug/submit` | `{ repoUrl, notes? }` | Entrega con enlace de GitHub |
| POST | `/projects/:slug/complete` | — | Marca el proyecto como completado |
| GET | `/dashboard` | — | Panel: estadísticas, etapas, recomendaciones, repaso, insignias, actividad |

## Administración — `/api/admin` (requiere rol ADMIN)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/stats` | Estadísticas generales |
| GET | `/users?q=` | Usuarios con su progreso |
| PATCH | `/users/:id` | `{ role: "USER" \| "ADMIN" }` |
| GET | `/schema` | Configuración de campos de cada entidad (la usa el panel) |
| GET | `/options` | Listas para los selectores de relaciones |
| GET | `/:entity?filtro=` | Lista (`stages`, `specializations`, `modules`, `lessons`, `exercises`, `questions`, `projects`, `resources`) |
| GET | `/:entity/:id` | Detalle |
| POST | `/:entity` | Crear |
| PUT | `/:entity/:id` | Actualizar |
| DELETE | `/:entity/:id` | Eliminar (en cascada con su contenido relacionado) |

## Otros

- `GET /sitemap.xml`: sitemap generado desde la base de datos.
- `GET /sandbox.html`: entorno aislado para ejecutar los retos (servido con su propia política de seguridad).
