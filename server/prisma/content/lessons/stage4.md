<!-- @lesson html-1 -->
## HTML semántico: el esqueleto de la web

**HTML** (*HyperText Markup Language*) describe la **estructura y el significado** del contenido de una página. No es un lenguaje de programación: es un lenguaje de **marcado** que usa **etiquetas**.

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mi primera página</title>
  </head>
  <body>
    <h1>Hola, soy Daniela</h1>
    <p>Estoy aprendiendo desarrollo web.</p>
  </body>
</html>
```

- `<head>` contiene información **sobre** la página (título, codificación, estilos).
- `<body>` contiene lo que se **ve**.
- `lang="es"` ayuda a los lectores de pantalla y a los buscadores.
- La etiqueta `viewport` es indispensable para que la página se vea bien en celulares.

### Etiquetas esenciales

```html
<h1>Título principal</h1>          <!-- solo uno por página -->
<h2>Subtítulo</h2>
<p>Un párrafo con <strong>texto importante</strong> y <em>énfasis</em>.</p>
<a href="https://developer.mozilla.org">Un enlace</a>
<img src="foto.jpg" alt="Daniela sonriendo frente a su computador">
<ul>
  <li>Elemento de lista</li>
</ul>
```

El atributo `alt` describe la imagen para personas con discapacidad visual y aparece si la imagen no carga. **Nunca lo omitas** en imágenes con contenido.

### ¿Qué significa "semántico"?

Usar la etiqueta que **describe el significado** del contenido, no solo cómo se ve:

```html
<header>  Encabezado: logo y navegación      </header>
<nav>     Menú de navegación                 </nav>
<main>    Contenido principal (uno por página) </main>
<article> Contenido independiente (una entrada de blog) </article>
<section> Sección temática con su título     </section>
<aside>   Contenido relacionado (barra lateral) </aside>
<footer>  Pie de página                      </footer>
```

Un `<div>` no significa nada; un `<nav>` le dice al navegador, a Google y a los lectores de pantalla "aquí está el menú". Eso mejora la **accesibilidad** y el **SEO**.

### Formularios accesibles

```html
<form>
  <label for="correo">Correo electrónico</label>
  <input id="correo" type="email" name="correo" required>
  <button type="submit">Suscribirme</button>
</form>
```

Cada `input` necesita su `label` asociado con `for` e `id`. Usar `type="email"` hace que el navegador valide el formato y muestre el teclado adecuado en el celular.

> 💡 **Idea clave:** primero escribe un HTML con buena estructura y significado; después lo decoras con CSS. Una página bien estructurada se entiende incluso sin estilos.

<!-- @lesson css-1 -->
## CSS: selectores, colores y el modelo de caja

**CSS** (*Cascading Style Sheets*) define cómo se ve el HTML: colores, tamaños, espacios y posiciones.

### Conectar CSS con HTML

```html
<head>
  <link rel="stylesheet" href="estilos.css">
</head>
```

### Reglas CSS

```css
selector {
  propiedad: valor;
}

h1 {
  color: #1e3a8a;
  font-size: 2rem;
}
```

### Selectores principales

```css
p { }              /* todas las etiquetas <p> */
.destacado { }     /* elementos con class="destacado" */
#portada { }       /* el elemento con id="portada" */
nav a { }          /* enlaces dentro de un <nav> */
a:hover { }        /* enlace cuando pasas el mouse */
```

Usa **clases** para dar estilo: son reutilizables. Los `id` deben ser únicos en la página.

### La cascada

Cuando varias reglas afectan al mismo elemento, gana la más **específica** (id > clase > etiqueta) y, a igual especificidad, **la que aparece después**.

### El modelo de caja

Cada elemento es una caja con cuatro capas, de adentro hacia afuera:

```text
┌──────────── margin (espacio exterior) ────────────┐
│ ┌──────────── border (borde) ──────────────────┐ │
│ │ ┌──────────── padding (relleno) ───────────┐ │ │
│ │ │              contenido                    │ │ │
│ │ └───────────────────────────────────────────┘ │ │
│ └───────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────┘
```

```css
.tarjeta {
  padding: 1rem;              /* espacio interno */
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  margin-bottom: 1.5rem;      /* espacio con lo de abajo */
}
```

Agrega siempre esta regla al inicio de tu CSS: hace que `width` incluya el padding y el borde, lo que evita muchas sorpresas.

```css
*, *::before, *::after { box-sizing: border-box; }
```

### Unidades

- `px`: píxeles fijos.
- `rem`: relativo al tamaño de letra base (1rem suele ser 16px). Respeta la configuración de quienes agrandan la letra; úsalo para textos y espacios.
- `%` y `vw`/`vh`: relativos al contenedor o a la ventana.

### Colores y contraste

Puedes escribir colores como `#2563eb`, `rgb(37 99 235)` o por nombre (`white`). Asegura un **contraste suficiente** entre texto y fondo: las pautas de accesibilidad WCAG piden al menos 4.5:1 para texto normal.

<!-- @lesson css-2 -->
## Flexbox, Grid y diseño responsive

### Flexbox: alinear en una dirección

Ideal para barras de navegación, filas de botones o centrar elementos.

```css
.menu {
  display: flex;
  justify-content: space-between;  /* distribución en el eje principal */
  align-items: center;             /* alineación en el eje cruzado */
  gap: 1rem;                       /* espacio entre elementos */
}
```

- `flex-direction: column` apila los elementos en vertical.
- `flex-wrap: wrap` permite que bajen a otra línea si no caben.

Centrar algo, el viejo dolor de cabeza de CSS, ahora es así:

```css
.centrado {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

### Grid: diseñar en dos dimensiones

Ideal para galerías y estructuras de página.

```css
.galeria {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3 columnas iguales */
  gap: 1.5rem;
}
```

`fr` significa "fracción del espacio disponible". Un truco muy útil que crea columnas automáticas según el espacio, sin media queries:

```css
.tarjetas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

### Diseño responsive

Una página **responsive** se adapta a celulares, tablets y computadores. La estrategia recomendada es **mobile first**: diseña primero para pantallas pequeñas y agrega reglas para pantallas grandes con **media queries**.

```css
.contenedor {
  padding: 1rem;
}

@media (min-width: 768px) {     /* tablets y más */
  .contenedor {
    padding: 2rem;
    max-width: 960px;
    margin: 0 auto;              /* centra horizontalmente */
  }
}
```

Imágenes que nunca se desbordan:

```css
img { max-width: 100%; height: auto; }
```

### ¿Flexbox o Grid?

| Flexbox | Grid |
|---|---|
| Una dimensión (fila **o** columna) | Dos dimensiones (filas **y** columnas) |
| El contenido define el tamaño | La cuadrícula define el tamaño |
| Menús, botones, alinear elementos | Galerías, estructura general de la página |

> 💡 **Idea clave:** prueba tu página con las herramientas de desarrollo (`F12` → ícono de celular) para ver cómo se ve en distintos tamaños de pantalla.

<!-- @lesson js-1 -->
## JavaScript: variables, funciones y el DOM

Si HTML es el esqueleto y CSS la ropa, **JavaScript** es el movimiento: hace que la página reaccione. Es el único lenguaje que los navegadores ejecutan de forma nativa.

### Conectar JavaScript

```html
<body>
  <!-- contenido -->
  <script src="app.js" defer></script>
</body>
```

`defer` hace que el script se ejecute cuando el HTML ya se cargó.

### Lo básico (comparado con Python)

```javascript
const nombre = "Sara";        // no se puede reasignar
let puntos = 0;               // se puede reasignar
puntos += 10;

const frutas = ["mango", "uva"];          // arreglo (como una lista)
const usuario = { nombre: "Sara", edad: 24 }; // objeto (como un dict)

if (puntos > 5) {
  console.log(`¡Hola, ${nombre}! Tienes ${puntos} puntos`);
} else {
  console.log("Sigue practicando");
}

for (const fruta of frutas) {
  console.log(fruta);
}
```

- Los bloques van entre `{ }` y la indentación es solo estética.
- Usa `const` por defecto y `let` si el valor va a cambiar. Evita `var`, que es antiguo.
- Compara con `===` (igualdad estricta). `==` convierte tipos y produce resultados confusos: `"5" == 5` es `true`.
- `console.log()` es el `print()` de JavaScript; lo ves en la consola del navegador (`F12`).

### Funciones

```javascript
function sumar(a, b) {
  return a + b;
}

const multiplicar = (a, b) => a * b;   // función flecha
```

### Métodos de arreglos muy usados

```javascript
const precios = [1000, 2500, 4000];
const conIva = precios.map((p) => p * 1.19);       // transforma cada elemento
const caros = precios.filter((p) => p > 2000);     // filtra
const total = precios.reduce((acc, p) => acc + p, 0); // acumula
```

### El DOM: la página como árbol de objetos

El navegador convierte el HTML en un árbol de objetos llamado **DOM**. JavaScript puede leerlo y modificarlo:

```html
<h1 id="titulo">Bienvenido</h1>
<p class="mensaje"></p>
```

```javascript
const titulo = document.querySelector("#titulo");
titulo.textContent = "¡Hola desde JavaScript!";

const mensaje = document.querySelector(".mensaje");
mensaje.textContent = "Este texto lo agregó el script.";
mensaje.classList.add("destacado");

const item = document.createElement("li");
item.textContent = "Nuevo elemento";
document.querySelector("ul").append(item);
```

⚠️ Usa `textContent` para mostrar texto que escribió un usuario. `innerHTML` interpreta HTML, y con datos de usuarios abre la puerta a ataques **XSS**.

<!-- @lesson js-2 -->
## Eventos y fetch: páginas interactivas y con datos

### Eventos

Un **evento** es algo que ocurre: un clic, una tecla, enviar un formulario. Con `addEventListener` le dices a JavaScript qué hacer cuando pase.

```html
<button id="contar">Clics: 0</button>
```

```javascript
const boton = document.querySelector("#contar");
let clics = 0;

boton.addEventListener("click", () => {
  clics++;
  boton.textContent = `Clics: ${clics}`;
});
```

### Formularios

```html
<form id="form-tarea">
  <label for="tarea">Nueva tarea</label>
  <input id="tarea" required>
  <button>Agregar</button>
</form>
<ul id="lista"></ul>
```

```javascript
const form = document.querySelector("#form-tarea");
const input = document.querySelector("#tarea");
const lista = document.querySelector("#lista");

form.addEventListener("submit", (evento) => {
  evento.preventDefault();          // evita que la página se recargue
  const li = document.createElement("li");
  li.textContent = input.value.trim();
  lista.append(li);
  input.value = "";
  input.focus();
});
```

### Pedir datos a un servidor con fetch

Las aplicaciones modernas piden datos a una **API** (un servidor que responde con datos en JSON) sin recargar la página. Como la respuesta tarda, se usa **async/await**:

```javascript
async function cargarUsuarios() {
  try {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!respuesta.ok) {
      throw new Error(`Error ${respuesta.status}`);
    }
    const usuarios = await respuesta.json();
    for (const u of usuarios) {
      console.log(u.name, u.email);
    }
  } catch (error) {
    console.error("No se pudieron cargar los usuarios:", error.message);
  }
}

cargarUsuarios();
```

- `await` espera a que la promesa se resuelva sin bloquear la página.
- Revisa siempre `respuesta.ok`: `fetch` no lanza error con un 404 o un 500.
- `try/catch` funciona igual que `try/except` en Python.

*JSONPlaceholder es un servicio gratuito de datos falsos para practicar.*

### Enviar datos (POST)

```javascript
await fetch("/api/tareas", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ titulo: "Estudiar fetch" }),
});
```

> 💡 **Idea clave:** ¿recuerdas los métodos HTTP de la etapa 1? Aquí los usas de verdad. RutaTech funciona exactamente así: el navegador pide tus lecciones y tu progreso a su API con fetch.

<!-- @lesson git-avanzado-1 -->
## Ramas, merge y pull requests

### Ramas: líneas de trabajo paralelas

Una **rama** es una línea independiente de desarrollo. La rama principal suele llamarse `main` y debería contener siempre código que funciona. Para cada nueva funcionalidad o corrección creas una rama:

```bash
git switch -c formulario-contacto    # crea la rama y se mueve a ella
# ... editas, haces commits ...
git switch main                      # vuelves a main
git merge formulario-contacto        # integras los cambios
git branch -d formulario-contacto    # borras la rama ya integrada
```

`git branch` lista las ramas y marca con `*` en la que estás.

### Conflictos de merge

Si dos ramas cambian **las mismas líneas** de un archivo, Git no sabe cuál conservar y marca un conflicto:

```text
<<<<<<< HEAD
<h1>Bienvenido a mi portafolio</h1>
=======
<h1>Hola, soy Daniela</h1>
>>>>>>> formulario-contacto
```

Para resolverlo: edita el archivo dejando la versión correcta, borra las marcas `<<<<<<<`, `=======` y `>>>>>>>`, y luego:

```bash
git add index.html
git commit
```

VS Code muestra botones para aceptar uno u otro cambio. Los conflictos son normales; no significan que hiciste algo mal.

### Pull requests: proponer cambios

En equipos (y en proyectos de código abierto) no se hace `merge` directo a `main`. Se abre un **pull request (PR)** en GitHub:

1. Sube tu rama: `git push -u origin formulario-contacto`.
2. En GitHub aparece el botón **Compare & pull request**.
3. Escribe un título claro y explica **qué cambiaste y por qué**, y cómo probarlo.
4. Tus compañeros **revisan** el código y comentan.
5. Cuando se aprueba, se hace **merge** a `main`.

### Colaborar en proyectos ajenos

Si no tienes permiso para escribir en un repositorio, primero haces un **fork** (tu copia en GitHub), trabajas ahí y abres el PR hacia el original.

### .gitignore

Archivo que lista lo que Git debe ignorar:

```text
node_modules/
.venv/
.env
*.log
.DS_Store
```

⚠️ **Nunca subas** contraseñas, claves de API ni archivos `.env` a GitHub. Si ocurre por error, cambia esas claves de inmediato: borrar el commit no basta, porque el historial ya pudo copiarse.

### Commits con convención

Muchos equipos usan prefijos para que el historial se lea fácil: `feat: agrega formulario de contacto`, `fix: corrige el menú en móvil`, `docs: actualiza el README`.

<!-- @lesson sql-web-1 -->
## SQL en acción: CRUD y JOIN

Las aplicaciones web hacen cuatro operaciones básicas sobre los datos, conocidas como **CRUD**:

| Operación | SQL | HTTP habitual |
|---|---|---|
| **C**reate (crear) | `INSERT` | `POST` |
| **R**ead (leer) | `SELECT` | `GET` |
| **U**pdate (actualizar) | `UPDATE` | `PUT` / `PATCH` |
| **D**elete (borrar) | `DELETE` | `DELETE` |

### Insertar

```sql
INSERT INTO productos (nombre, precio, categoria_id)
VALUES ('Teclado', 85000, 1);
```

### Consultar con filtros

```sql
SELECT nombre, precio
FROM productos
WHERE precio BETWEEN 50000 AND 200000
  AND nombre LIKE '%teclado%'     -- contiene "teclado"
ORDER BY precio ASC
LIMIT 10;
```

### Actualizar y borrar

```sql
UPDATE productos SET precio = 79000 WHERE id = 3;
DELETE FROM productos WHERE id = 3;
```

⚠️ **Nunca olvides el WHERE** en un `UPDATE` o `DELETE`: sin él, se modifican o borran **todas** las filas de la tabla.

### Agrupar

```sql
SELECT categoria_id, COUNT(*) AS cantidad, AVG(precio) AS promedio
FROM productos
GROUP BY categoria_id
HAVING COUNT(*) > 2;
```

`GROUP BY` agrupa filas y `HAVING` filtra esos grupos (`WHERE` filtra filas antes de agrupar).

### JOIN: combinar tablas

Los datos se reparten en varias tablas para no repetirlos. `JOIN` los vuelve a unir:

```text
categorias              productos
┌────┬───────────┐      ┌────┬─────────┬────────┬──────────────┐
│ id │ nombre    │      │ id │ nombre  │ precio │ categoria_id │
├────┼───────────┤      ├────┼─────────┼────────┼──────────────┤
│ 1  │ Periféricos│     │ 1  │ Teclado │ 85000  │ 1            │
│ 2  │ Audio     │      │ 2  │ Audífonos│ 120000│ 2            │
└────┴───────────┘      └────┴─────────┴────────┴──────────────┘
```

```sql
SELECT productos.nombre, productos.precio, categorias.nombre AS categoria
FROM productos
JOIN categorias ON productos.categoria_id = categorias.id;
```

- `JOIN` (o `INNER JOIN`): solo las filas que tienen pareja en ambas tablas.
- `LEFT JOIN`: todas las filas de la tabla izquierda, aunque no tengan pareja (las columnas de la derecha quedan en `NULL`). Útil para encontrar, por ejemplo, categorías sin productos.

> 💡 **Idea clave:** practica con datos reales: crea una base de datos de tus gastos o tu biblioteca personal y hazle preguntas con SQL.

<!-- @lesson sql-web-2 -->
## Diseño básico de tablas

Una base de datos bien diseñada evita datos repetidos, contradicciones y errores. Antes de escribir `CREATE TABLE`, piensa en las **entidades** y sus **relaciones**.

### 1. Identifica las entidades

En una app de biblioteca: **usuarios**, **libros**, **autores**, **préstamos**. Cada entidad será una tabla, y cada tabla un sustantivo en plural.

### 2. Define columnas y tipos

```sql
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL UNIQUE,
  creado_en TEXT DEFAULT CURRENT_TIMESTAMP
);
```

Restricciones útiles:

- `PRIMARY KEY`: identificador único.
- `NOT NULL`: obligatorio.
- `UNIQUE`: no se puede repetir (correos, documentos).
- `DEFAULT`: valor por defecto.
- `CHECK (precio >= 0)`: regla de validación.

### 3. Establece las relaciones

**Uno a muchos (1:N):** un autor escribe muchos libros. La clave foránea va en el lado "muchos":

```sql
CREATE TABLE libros (
  id INTEGER PRIMARY KEY,
  titulo TEXT NOT NULL,
  autor_id INTEGER NOT NULL REFERENCES autores(id)
);
```

**Muchos a muchos (N:M):** un usuario toma prestados muchos libros y un libro lo prestan muchos usuarios. Se necesita una **tabla intermedia**:

```sql
CREATE TABLE prestamos (
  id INTEGER PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  libro_id INTEGER NOT NULL REFERENCES libros(id),
  fecha_prestamo TEXT NOT NULL,
  fecha_devolucion TEXT
);
```

### 4. Evita la repetición (normalización)

❌ Mal diseño: guardar el nombre del autor en cada libro.

| titulo | autor | pais_autor |
|---|---|---|
| Cien años de soledad | Gabriel García Márquez | Colombia |
| El amor en los tiempos del cólera | Gabriel García Marquez | Colombia |

Si el nombre está escrito distinto (falta una tilde en la segunda fila), ya tienes datos inconsistentes. ✅ Mejor: una tabla `autores` y en `libros` solo el `autor_id`.

**Regla práctica:** cada dato debe guardarse **en un solo lugar**.

### 5. Dibuja un diagrama

Un **diagrama entidad-relación** (cajas con las tablas y líneas con las relaciones) te ahorra horas. Puedes hacerlo en papel o con herramientas gratuitas como dbdiagram.io o drawio.

> 💡 **Idea clave:** RutaTech usa este mismo diseño: tablas de usuarios, módulos y lecciones, y una tabla intermedia `LessonProgress` que registra qué usuario completó qué lección.
