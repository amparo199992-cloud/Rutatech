# Sistema de diseño de RutaTech

## Idea central

La ruta se dibuja como una **línea de transporte**: cada etapa es una estación con su propio color de línea. Es el único elemento llamativo (aparece en la portada, con una animación que dibuja la línea al cargar, y en la página de la ruta con el avance de cada estación). Todo lo demás es sobrio para que el contenido se lea con calma.

## Color

| Token | Valor | Uso |
|---|---|---|
| `paper` | `#f6f8fb` | Fondo claro (frío, no crema) |
| `ink` | `#13203b` | Texto principal |
| `cobalt-500` | `#2448d8` | Acción principal, enlaces |
| `signal` | `#f4b400` | Racha, insignias, progreso parcial |
| `mint-500` | `#12a58a` | Éxito, completado |
| `night` | `#0e1528` | Fondo en modo oscuro |

Colores de línea por etapa: 1 `#0e8a8a` · 2 `#e09b00` · 3 `#7048e8` · 4 `#2448d8` · 5 `#d6336c` · 6 `#12a58a` (en `client/src/lib/stages.js`).

## Tipografía

- **Bricolage Grotesque**: títulos.
- **Atkinson Hyperlegible Next**: texto. Creada por el Braille Institute para máxima legibilidad; ideal para principiantes y personas con baja visión.
- **JetBrains Mono**: solo código, con las ligaduras desactivadas para que `=>` y `===` se vean como se escriben.

Las fuentes se sirven desde el propio sitio (paquetes `@fontsource`), sin depender de servicios externos.

## Principios

- Texto de lecciones limitado a ~68 caracteres por línea.
- Botones de al menos 48 px de alto; foco visible siempre.
- Mensajes en voz activa y en segunda persona; los errores explican qué pasó y cómo seguir.
- Una sola animación automática (la línea de la portada), desactivada con `prefers-reduced-motion`.
