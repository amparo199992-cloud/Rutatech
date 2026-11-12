import { challenge, choice, fill, output, q, res } from "./helpers.js";

const mdn = (path, title) => res(`MDN: ${title}`, `https://developer.mozilla.org/es/docs/${path}`);

export default {
  slug: "desarrollo-web",
  order: 4,
  icon: "🌐",
  title: "Desarrollo web y bases de datos",
  subtitle: "Construye páginas reales conectadas a datos",
  duration: "6 a 8 semanas",
  description:
    "Construye páginas web con HTML semántico, diséñalas con CSS moderno y responsive, hazlas interactivas con JavaScript, colabora con ramas y pull requests y diseña bases de datos con SQL.",
  modules: [
    {
      slug: "html-semantico",
      title: "HTML semántico",
      description: "Estructura páginas accesibles y fáciles de encontrar en buscadores.",
      duration: "1 semana",
      level: "principiante",
      objectives: ["Escribir la estructura base de un documento HTML.", "Usar etiquetas semánticas (header, nav, main, footer…).", "Agregar textos alternativos a las imágenes.", "Crear formularios accesibles con label."],
      checklist: ["Mi página tiene lang=\"es\" y la etiqueta viewport", "Usé header, nav, main y footer", "Todas mis imágenes tienen alt", "Cada input tiene su label"],
      resources: [mdn("Web/HTML", "HTML"), mdn("Glossary/Semantics", "Semántica"), res("W3C: Introducción a la accesibilidad web (WAI)", "https://www.w3.org/WAI/fundamentals/accessibility-intro/es")],
      lessons: [
        {
          key: "html-1",
          title: "La estructura de una página",
          summary: "Etiquetas, semántica, imágenes accesibles y formularios.",
          minutes: 40,
          exercises: [
            choice("¿Qué etiqueta usarías para el menú de navegación principal?", ["<div>", "<nav>", "<span>", "<section>"], 1, "<nav> indica que el contenido es navegación, lo que ayuda a lectores de pantalla y buscadores."),
            fill("Completa el atributo que describe la imagen para personas con discapacidad visual.", '<img src="logo.png" ___="Logo de RutaTech">', [["alt"]], "alt es el texto alternativo de la imagen.", "html"),
            fill("Completa para asociar el label con el input cuyo id es 'correo'.", '<label ___="correo">Correo</label>\n<input id="correo" type="email">', [["for"]], "El atributo for del label debe coincidir con el id del input.", "html"),
          ],
        },
      ],
      quiz: [
        q("¿Qué va dentro de <head>?", ["El contenido visible", "Información sobre la página como el título y la codificación", "Solo imágenes", "El pie de página"], 1, "head guarda metadatos; body el contenido visible."),
        q("¿Cuántos <h1> conviene tener por página?", ["Ninguno", "Uno", "Tres", "Uno por párrafo"], 1, "Un h1 principal da una jerarquía clara."),
        q("¿Por qué preferir <main> en lugar de <div>?", ["Es más rápido", "Comunica el significado del contenido", "Tiene color", "No hay diferencia"], 1, "La semántica mejora accesibilidad y SEO."),
        q("¿Para qué sirve la etiqueta meta viewport?", ["Para el SEO en Bing", "Para que la página se adapte a celulares", "Para cifrar", "Para cargar imágenes"], 1, "Indica al navegador móvil que use el ancho real del dispositivo."),
        q("¿Qué hace type=\"email\" en un input?", ["Envía un correo", "Valida el formato de correo y muestra el teclado adecuado", "Oculta el texto", "Nada"], 1, "El navegador valida y adapta el teclado en móviles."),
      ],
    },
    {
      slug: "css-moderno",
      title: "CSS moderno: Flexbox, Grid y responsive",
      description: "Da estilo a tus páginas y haz que se vean bien en cualquier pantalla.",
      duration: "2 semanas",
      level: "principiante",
      objectives: ["Usar selectores de etiqueta, clase e id.", "Aplicar el modelo de caja.", "Alinear elementos con Flexbox.", "Crear cuadrículas con Grid.", "Diseñar mobile first con media queries."],
      checklist: ["Agregué box-sizing: border-box", "Centré un elemento con Flexbox", "Hice una galería con Grid y auto-fit", "Probé mi página en modo celular con F12", "Revisé el contraste de mis colores"],
      resources: [mdn("Web/CSS", "CSS"), mdn("Learn_web_development/Core/CSS_layout/Flexbox", "Flexbox"), mdn("Learn_web_development/Core/CSS_layout/Grids", "Grids"), res("Flexbox Froggy (juego para practicar)", "https://flexboxfroggy.com/#es", "Español"), res("Grid Garden (juego para practicar)", "https://cssgridgarden.com/#es", "Español")],
      lessons: [
        {
          key: "css-1",
          title: "Selectores, cascada y modelo de caja",
          summary: "Cómo se aplican los estilos y cómo se mide cada elemento.",
          minutes: 35,
          exercises: [
            fill("Completa el selector para aplicar estilos a los elementos con class=\"boton\".", "___boton {\n  padding: 1rem;\n}", [["."]], "El punto selecciona por clase; # selecciona por id.", "css"),
            choice("¿Qué propiedad agrega espacio DENTRO del borde de un elemento?", ["margin", "padding", "gap", "outline"], 1, "padding es el relleno interno; margin es el espacio exterior."),
          ],
        },
        {
          key: "css-2",
          title: "Flexbox, Grid y responsive",
          summary: "Diseños flexibles que se adaptan a cualquier pantalla.",
          minutes: 40,
          exercises: [
            fill("Completa para convertir el contenedor en un flex container.", ".menu {\n  display: ___;\n}", [["flex"]], "display: flex activa Flexbox en el contenedor.", "css"),
            choice("¿Qué hace grid-template-columns: repeat(3, 1fr)?", ["3 filas", "3 columnas de igual ancho", "Una columna de 3px", "Nada"], 1, "Crea tres columnas, cada una con una fracción igual del espacio."),
            choice("Con el enfoque mobile first, ¿qué media query se usa para pantallas grandes?", ["@media (max-width: 768px)", "@media (min-width: 768px)", "@media print", "@media (orientation: portrait)"], 1, "Partes de móvil y agregas estilos cuando la pantalla mide al menos cierto ancho."),
          ],
        },
      ],
      quiz: [
        q("¿Cuál selector tiene mayor especificidad?", ["p", ".texto", "#principal", "*"], 2, "id > clase > etiqueta."),
        q("¿Qué unidad respeta el tamaño de letra configurado por el usuario?", ["px", "rem", "cm", "pt"], 1, "rem es relativo al tamaño base del documento."),
        q("¿Qué propiedad de Flexbox alinea en el eje principal?", ["align-items", "justify-content", "flex-wrap", "order"], 1, "justify-content distribuye en el eje principal."),
        q("¿Cuándo es mejor usar Grid?", ["Para alinear dos botones", "Para diseños en filas y columnas a la vez", "Para cambiar colores", "Nunca"], 1, "Grid trabaja en dos dimensiones."),
        q("¿Qué regla evita que las imágenes se salgan de su contenedor?", ["img { width: 2000px }", "img { max-width: 100%; height: auto }", "img { display: none }", "img { float: left }"], 1, "max-width: 100% limita la imagen al ancho disponible."),
      ],
    },
    {
      slug: "javascript-basico",
      title: "JavaScript básico: DOM, eventos y fetch",
      description: "Haz que tus páginas reaccionen y se conecten con servidores.",
      duration: "2 semanas",
      level: "intermedio",
      objectives: ["Usar variables, condicionales, bucles y funciones en JavaScript.", "Usar map, filter y reduce.", "Seleccionar y modificar elementos del DOM.", "Responder a eventos.", "Consumir una API con fetch y async/await."],
      checklist: ["Uso const y let (no var)", "Comparo con ===", "Modifiqué el DOM con querySelector y textContent", "Manejé el evento submit con preventDefault", "Cargué datos de una API con fetch y manejé errores"],
      resources: [mdn("Web/JavaScript", "JavaScript"), mdn("Web/API/Document_Object_Model", "El DOM"), mdn("Web/API/Fetch_API/Using_Fetch", "Usando Fetch"), res("JavaScript.info: El tutorial de JavaScript moderno", "https://es.javascript.info/")],
      lessons: [
        {
          key: "js-1",
          title: "Variables, funciones y el DOM",
          summary: "El lenguaje del navegador y cómo modificar la página.",
          minutes: 45,
          exercises: [
            output("¿Qué muestra console.log en este código?", "const precios = [10, 20, 30];\nconst dobles = precios.map((p) => p * 2);\nconsole.log(dobles[2]);", ["60"], "map multiplica cada precio por 2; el índice 2 es 30 × 2 = 60.", "javascript"),
            choice("¿Qué devuelve \"5\" === 5 en JavaScript?", ["true", "false", "undefined", "Error"], 1, "=== compara valor y tipo: texto y número son tipos distintos."),
            challenge(
              "Escribe la función totalCarrito(productos) que reciba un arreglo de objetos { precio, cantidad } y devuelva el total.",
              {
                language: "javascript",
                functionName: "totalCarrito",
                starter: "function totalCarrito(productos) {\n  // Escribe tu código aquí\n}\n",
                tests: [
                  { args: [[{ precio: 1000, cantidad: 2 }, { precio: 500, cantidad: 1 }]], expected: 2500 },
                  { args: [[]], expected: 0 },
                  { args: [[{ precio: 3, cantidad: 3 }]], expected: 9 },
                ],
                solution: "function totalCarrito(productos) {\n  return productos.reduce((total, p) => total + p.precio * p.cantidad, 0);\n}",
              },
              "Con reduce acumulas precio × cantidad de cada producto, empezando en 0."
            ),
          ],
        },
        {
          key: "js-2",
          title: "Eventos y fetch",
          summary: "Interactividad y datos desde una API.",
          minutes: 45,
          exercises: [
            fill("Completa para escuchar el clic de un botón.", 'boton.___("click", () => {\n  console.log("¡Clic!");\n});', [["addEventListener"]], "addEventListener registra una función para un evento.", "javascript"),
            choice("¿Por qué se usa evento.preventDefault() al enviar un formulario con JavaScript?", ["Para borrar el formulario", "Para evitar que la página se recargue", "Para validar el correo", "Para enviar más rápido"], 1, "Por defecto el navegador recarga la página al enviar; preventDefault lo evita."),
            challenge(
              "Escribe filtrarAprobados(estudiantes) que reciba objetos { nombre, nota } y devuelva un arreglo solo con los NOMBRES de quienes tienen nota mayor o igual a 3.",
              {
                language: "javascript",
                functionName: "filtrarAprobados",
                starter: "function filtrarAprobados(estudiantes) {\n  // Usa filter y map\n}\n",
                tests: [
                  { args: [[{ nombre: "Ana", nota: 4 }, { nombre: "Luis", nota: 2.5 }, { nombre: "Eva", nota: 3 }]], expected: ["Ana", "Eva"] },
                  { args: [[]], expected: [] },
                ],
                solution: "function filtrarAprobados(estudiantes) {\n  return estudiantes.filter((e) => e.nota >= 3).map((e) => e.nombre);\n}",
              },
              "Primero filter para quedarte con las notas ≥ 3 y luego map para extraer el nombre."
            ),
          ],
        },
      ],
      quiz: [
        q("¿Qué palabra declara una variable que no se reasigna?", ["var", "let", "const", "def"], 2, "const impide reasignar la variable."),
        q("¿Qué método selecciona el primer elemento que coincide con un selector CSS?", ["getElement", "document.querySelector", "select()", "find()"], 1, "querySelector acepta cualquier selector CSS."),
        q("¿Por qué preferir textContent a innerHTML con datos de usuarios?", ["Es más bonito", "Evita ataques XSS", "Es obligatorio", "Carga más rápido las imágenes"], 1, "innerHTML interpreta HTML que podría contener código malicioso."),
        q("¿Lanza error fetch cuando el servidor responde 404?", ["Sí, siempre", "No, hay que revisar respuesta.ok", "Solo en Chrome", "Solo con POST"], 1, "fetch solo falla por problemas de red; el estado lo revisas tú."),
        q("¿Qué hace await?", ["Detiene el navegador", "Espera el resultado de una promesa sin bloquear la página", "Repite una función", "Crea una variable"], 1, "await se usa dentro de funciones async."),
      ],
    },
    {
      slug: "git-avanzado",
      title: "Git avanzado y colaboración",
      description: "Ramas, merge, conflictos, pull requests y buenas prácticas en equipo.",
      duration: "1 semana",
      level: "intermedio",
      objectives: ["Crear y fusionar ramas.", "Resolver conflictos de merge.", "Abrir y revisar pull requests.", "Usar .gitignore y proteger secretos."],
      checklist: ["Creé una rama, hice commits y la fusioné en main", "Resolví un conflicto a propósito", "Abrí un pull request en GitHub con descripción", "Mi .gitignore excluye .env, node_modules y .venv"],
      resources: [res("Pro Git: Ramificaciones en Git", "https://git-scm.com/book/es/v2/Ramificaciones-en-Git-%C2%BFQu%C3%A9-es-una-rama%3F"), res("GitHub Docs: Acerca de las solicitudes de incorporación de cambios", "https://docs.github.com/es/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests"), res("Learn Git Branching (práctica interactiva)", "https://learngitbranching.js.org/?locale=es_ES", "Español")],
      lessons: [
        {
          key: "git-avanzado-1",
          title: "Ramas, merge y pull requests",
          summary: "Trabaja en paralelo y colabora sin pisar el trabajo de otros.",
          minutes: 40,
          exercises: [
            fill("Completa el comando que crea una rama llamada menu-movil y se cambia a ella.", "git switch ___ menu-movil", [["-c"]], "git switch -c crea la rama y te mueve a ella (equivale a git checkout -b).", "bash"),
            choice("¿Qué archivo NUNCA deberías subir a GitHub?", ["README.md", ".env con claves", "index.html", "package.json"], 1, "Los archivos .env suelen contener contraseñas y claves de API."),
            choice("¿Cuándo ocurre un conflicto de merge?", ["Cuando dos ramas cambian las mismas líneas de un archivo", "Siempre que haces merge", "Cuando borras una rama", "Cuando haces push"], 0, "Git no sabe automáticamente qué versión conservar."),
          ],
        },
      ],
      quiz: [
        q("¿Qué es un pull request?", ["Descargar cambios", "Una propuesta para integrar cambios de una rama, con revisión", "Un tipo de commit", "Un error de Git"], 1, "Permite revisar y discutir antes de hacer merge."),
        q("¿Qué es un fork?", ["Una rama local", "Tu copia de un repositorio ajeno en GitHub", "Un conflicto", "Un archivo ignorado"], 1, "Sirve para contribuir sin permisos de escritura en el original."),
        q("¿Qué comando integra otra rama en la actual?", ["git push", "git merge", "git clone", "git init"], 1, "git merge une el historial de otra rama."),
        q("¿Qué haces si subiste una clave secreta a GitHub por error?", ["Nada", "Borro el archivo y listo", "Cambio (revoco) la clave de inmediato", "Hago el repo privado y ya"], 2, "La clave pudo copiarse; hay que invalidarla."),
        q("¿Qué indica el prefijo 'fix:' en un commit?", ["Nueva funcionalidad", "Corrección de un error", "Documentación", "Borrado"], 1, "Es parte de la convención de commits convencionales."),
      ],
    },
    {
      slug: "sql-diseno-tablas",
      title: "SQL práctico y diseño de tablas",
      description: "CRUD completo, JOIN, agrupaciones y cómo diseñar una base de datos.",
      duration: "1 a 2 semanas",
      level: "intermedio",
      objectives: ["Escribir consultas INSERT, SELECT, UPDATE y DELETE.", "Combinar tablas con JOIN y LEFT JOIN.", "Agrupar con GROUP BY y HAVING.", "Diseñar tablas con relaciones 1:N y N:M.", "Evitar datos duplicados."],
      checklist: ["Hice las cuatro operaciones CRUD", "Uní dos tablas con JOIN", "Usé GROUP BY con COUNT", "Diseñé una base con una tabla intermedia N:M", "Dibujé un diagrama entidad-relación"],
      resources: [res("PostgreSQL: tutorial oficial", "https://www.postgresql.org/docs/current/tutorial.html", "Inglés"), res("SQLBolt: lecciones interactivas de SQL", "https://sqlbolt.com/", "Inglés"), res("dbdiagram.io: diagramas de bases de datos", "https://dbdiagram.io/", "Inglés")],
      lessons: [
        {
          key: "sql-web-1",
          title: "CRUD y JOIN",
          summary: "Crear, leer, actualizar, borrar y combinar tablas.",
          minutes: 40,
          exercises: [
            fill("Completa para cambiar el precio SOLO del producto con id 5.", "UPDATE productos SET precio = 9900 ___ id = 5;", [["WHERE", "where"]], "Sin WHERE, el UPDATE modificaría todas las filas.", "sql"),
            fill("Completa la consulta que une productos con su categoría.", "SELECT p.nombre, c.nombre\nFROM productos p\n___ categorias c ON p.categoria_id = c.id;", [["JOIN", "join", "INNER JOIN", "inner join"]], "JOIN combina las filas de ambas tablas que cumplen la condición ON.", "sql"),
            choice("¿Qué cláusula filtra GRUPOS después de un GROUP BY?", ["WHERE", "HAVING", "ORDER BY", "LIMIT"], 1, "WHERE filtra filas antes de agrupar; HAVING filtra los grupos."),
          ],
        },
        {
          key: "sql-web-2",
          title: "Diseño de tablas",
          summary: "Entidades, relaciones y normalización básica.",
          minutes: 35,
          exercises: [
            choice("Estudiantes y cursos: un estudiante toma muchos cursos y un curso tiene muchos estudiantes. ¿Qué necesitas?", ["Una sola tabla", "Una tabla intermedia (inscripciones)", "Repetir el curso en cada estudiante", "Un archivo CSV"], 1, "Las relaciones muchos a muchos se modelan con una tabla intermedia."),
            choice("¿Qué restricción impide registrar dos usuarios con el mismo correo?", ["NOT NULL", "UNIQUE", "DEFAULT", "CHECK"], 1, "UNIQUE no permite valores repetidos en la columna."),
          ],
        },
      ],
      quiz: [
        q("¿Qué significa CRUD?", ["Crear, Leer, Actualizar, Borrar", "Copiar, Renombrar, Unir, Duplicar", "Un lenguaje", "Un tipo de JOIN"], 0, "Las cuatro operaciones básicas sobre datos."),
        q("¿Qué pasa con DELETE FROM usuarios; sin WHERE?", ["Borra el primer usuario", "Borra todos los usuarios", "Da error", "No hace nada"], 1, "Sin condición afecta a todas las filas."),
        q("¿Qué devuelve un LEFT JOIN?", ["Solo coincidencias", "Todas las filas de la tabla izquierda, con o sin pareja", "Solo la tabla derecha", "Nada"], 1, "Las columnas sin pareja quedan en NULL."),
        q("En una relación 1:N (autor → libros), ¿dónde va la clave foránea?", ["En autores", "En libros", "En ambas", "En ninguna"], 1, "Va en el lado 'muchos': cada libro apunta a su autor."),
        q("¿Cuál es la regla práctica de la normalización?", ["Repetir datos para leerlos rápido", "Guardar cada dato en un solo lugar", "Usar una sola tabla", "No usar claves"], 1, "Evita inconsistencias."),
      ],
    },
  ],
};
