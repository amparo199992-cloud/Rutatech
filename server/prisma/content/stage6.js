import { choice, fill, q, res } from "./helpers.js";

export default {
  slug: "portafolio-empleo",
  order: 6,
  icon: "🚀",
  title: "Portafolio y empleo",
  subtitle: "Muestra lo que sabes y consigue tu primera oportunidad",
  duration: "3 a 4 semanas",
  description:
    "Construye un portafolio profesional, optimiza tus perfiles de GitHub y LinkedIn, prepara un CV técnico, practica entrevistas y documenta tus proyectos. Cierra con un proyecto final integrador.",
  modules: [
    {
      slug: "portafolio-profesional",
      title: "Cómo crear un portafolio profesional",
      description: "Selecciona, presenta y publica tus mejores proyectos.",
      duration: "1 semana",
      level: "intermedio",
      objectives: ["Elegir proyectos que demuestren habilidades reales.", "Presentar cada proyecto con Problema → Solución → Resultado.", "Publicar un sitio de portafolio responsive.", "Evitar errores comunes."],
      checklist: ["Elegí 3 proyectos para mostrar", "Escribí la descripción de cada uno con el formato Problema → Solución → Resultado", "Publiqué mi portafolio en GitHub Pages, Netlify o Vercel", "Revisé que funcione en celular y que no haya enlaces rotos"],
      resources: [res("GitHub Pages: documentación", "https://docs.github.com/es/pages"), res("Netlify: documentación", "https://docs.netlify.com/", "Inglés"), res("freeCodeCamp en español: artículos y guías", "https://www.freecodecamp.org/espanol/news/")],
      lessons: [
        {
          key: "portafolio-1",
          title: "Tu portafolio",
          summary: "Calidad antes que cantidad y cómo presentar cada proyecto.",
          minutes: 30,
          exercises: [
            choice("¿Qué portafolio causa mejor impresión?", ["15 proyectos copiados de tutoriales", "3 proyectos propios, documentados y con demo", "Solo una lista de cursos", "Un PDF con capturas sin código"], 1, "Pocos proyectos propios, funcionales y bien explicados demuestran más."),
          ],
        },
      ],
      quiz: [
        q("¿Qué formato se recomienda para describir un proyecto?", ["Solo la lista de tecnologías", "Problema → Solución → Resultado", "Un poema", "La fecha de creación"], 1, "Muestra para qué sirve y qué impacto tuvo."),
        q("¿Qué debe tener cada proyecto del portafolio?", ["Enlace al código y a una demo o capturas", "Solo un título", "Música de fondo", "Muchas animaciones"], 0, "Quien lo revise debe poder verlo y leer el código."),
        q("¿Por qué revisar el portafolio en celular?", ["No importa", "Muchas personas de selección lo abren desde el teléfono", "Por estética solamente", "Para usar menos datos"], 1, "Un portafolio no responsive deja mala impresión."),
        q("Si vienes de otra carrera, ¿cómo lo presentas?", ["Lo ocultas", "Como una fortaleza que aporta otra perspectiva", "Como una debilidad", "No lo mencionas nunca"], 1, "La experiencia previa aporta habilidades transferibles."),
        q("¿Qué servicio publica sitios estáticos gratis?", ["GitHub Pages", "Excel", "Power BI", "Zoom"], 0, "GitHub Pages, Netlify y Vercel tienen planes gratuitos."),
      ],
    },
    {
      slug: "github-linkedin",
      title: "Optimiza tu GitHub y LinkedIn",
      description: "Perfiles que cuentan tu historia profesional y atraen oportunidades.",
      duration: "3 días",
      level: "principiante",
      objectives: ["Crear un README de perfil en GitHub.", "Fijar y documentar tus mejores repositorios.", "Escribir un titular y un 'Acerca de' efectivos en LinkedIn.", "Mantener una historia coherente en todos tus perfiles."],
      checklist: ["Creé mi README de perfil en GitHub", "Fijé mis mejores repositorios", "Actualicé mi titular de LinkedIn con el rol que busco", "Agregué mi portafolio en Destacados", "Personalicé mi URL de LinkedIn"],
      resources: [res("GitHub Docs: Administrar el README de tu perfil", "https://docs.github.com/es/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme"), res("Ayuda de LinkedIn", "https://www.linkedin.com/help/linkedin", "Español e inglés")],
      lessons: [
        {
          key: "github-linkedin-1",
          title: "Tu vitrina profesional",
          summary: "GitHub y LinkedIn que trabajan a tu favor.",
          minutes: 30,
          exercises: [
            choice("¿Cómo debe llamarse el repositorio para que su README aparezca en tu perfil de GitHub?", ["profile", "README", "Igual que tu nombre de usuario", "portfolio"], 2, "GitHub muestra en tu perfil el README del repositorio que se llama como tu usuario."),
            choice("¿Cuál es el mejor titular de LinkedIn para alguien que busca su primer empleo?", ["Estudiante", "Buscando trabajo", "Desarrolladora web junior | JavaScript, React, SQL", "Persona apasionada"], 2, "Indica el rol y las tecnologías: ayuda a que te encuentren."),
          ],
        },
      ],
      quiz: [
        q("¿Cuántos repositorios puedes fijar en tu perfil de GitHub?", ["1", "3", "Hasta 6", "Ilimitados"], 2, "GitHub permite fijar hasta 6."),
        q("¿Qué incluir en la sección Destacados de LinkedIn?", ["Memes", "Tu portafolio y mejores proyectos", "Tu número de documento", "Nada"], 1, "Es una vitrina para mostrar tu trabajo."),
        q("¿Por qué deben coincidir CV, GitHub y LinkedIn?", ["Para que cuenten la misma historia profesional", "Por obligación legal", "No importa", "Para ocupar espacio"], 0, "La coherencia genera confianza."),
        q("¿Qué demuestra mejor tu actividad en GitHub?", ["Muchos commits vacíos", "Trabajo real con buenos mensajes de commit", "Repositorios sin README", "Forks sin cambios"], 1, "La calidad importa más que la cantidad."),
        q("¿Cómo llegan muchas oportunidades laborales?", ["Solo por ofertas publicadas", "También por la red de contactos", "Solo por agencias", "Por correo masivo"], 1, "Construir red profesional abre puertas."),
      ],
    },
    {
      slug: "cv-tecnico",
      title: "Cómo preparar un CV técnico",
      description: "Un CV claro, orientado a logros y preparado para los filtros automáticos.",
      duration: "3 días",
      level: "principiante",
      objectives: ["Estructurar un CV de una página.", "Redactar logros con verbos de acción.", "Preparar el CV para sistemas ATS.", "Adaptar el CV a cada oferta."],
      checklist: ["Mi CV tiene una sola página y una columna", "Reescribí mis tareas como logros", "Incluí enlaces a GitHub, LinkedIn y portafolio", "Adapté mi CV a una oferta real", "Lo exporté a PDF con un nombre profesional"],
      resources: [res("Google: recursos de búsqueda de empleo (Grow with Google)", "https://grow.google/intl/es/", "Español"), res("SENA: Agencia Pública de Empleo (Colombia)", "https://agenciapublicadeempleo.sena.edu.co/", "Español")],
      lessons: [
        {
          key: "cv-1",
          title: "Tu CV técnico",
          summary: "Estructura, logros y filtros automáticos.",
          minutes: 30,
          exercises: [
            choice("¿Cuál descripción es más fuerte en un CV?", ["Sé Python", "Hice cosas con Python", "Automaticé con Python un informe semanal y ahorré 3 horas de trabajo", "Python ★★★★☆"], 2, "Verbo de acción + qué hiciste + resultado concreto."),
            choice("Para pasar los filtros ATS, el CV debe…", ["Tener muchas columnas y gráficos", "Tener un formato simple e incluir palabras clave reales de la oferta", "Ser una imagen", "Tener 5 páginas"], 1, "Los ATS leen mejor formatos simples con palabras clave."),
          ],
        },
      ],
      quiz: [
        q("Para un perfil junior, ¿qué sección va antes de la experiencia?", ["Hobbies", "Proyectos", "Referencias", "Estado civil"], 1, "Tus proyectos demuestran tus habilidades técnicas."),
        q("¿Qué extensión ideal tiene un CV junior?", ["Una página", "Cinco páginas", "Media línea", "Diez páginas"], 0, "Breve y fácil de revisar."),
        q("¿Qué es un ATS?", ["Un lenguaje", "Un sistema que filtra CV automáticamente", "Un tipo de entrevista", "Una red social"], 1, "Applicant Tracking System."),
        q("¿Qué NO deberías incluir?", ["Tu GitHub", "Habilidades que no puedes demostrar", "Tus proyectos", "Tu correo"], 1, "Te preguntarán por todo lo que escribas."),
        q("¿Conviene enviar el mismo CV a todas las ofertas?", ["Sí", "No, conviene adaptarlo a cada una", "Solo en tecnología", "Da igual"], 1, "Ajustarlo mejora mucho la tasa de respuesta."),
      ],
    },
    {
      slug: "entrevistas-tecnicas",
      title: "Cómo preparar entrevistas técnicas básicas",
      description: "Método STAR, preguntas frecuentes y ejercicios de programación en vivo.",
      duration: "1 semana",
      level: "intermedio",
      objectives: ["Responder preguntas de comportamiento con el método STAR.", "Repasar preguntas técnicas frecuentes.", "Resolver un ejercicio en vivo pensando en voz alta.", "Preparar preguntas para la empresa."],
      checklist: ["Preparé 4 historias con el método STAR", "Respondí en voz alta las preguntas técnicas de la lección", "Hice un simulacro de programación en vivo con alguien", "Tengo 3 preguntas preparadas para el entrevistador"],
      resources: [res("Exercism: práctica de programación con mentoría", "https://exercism.org/", "Inglés"), res("freeCodeCamp en español: artículos y guías", "https://www.freecodecamp.org/espanol/news/", "Español")],
      lessons: [
        {
          key: "entrevistas-1",
          title: "Entrevistas técnicas",
          summary: "Comunica lo que sabes y cómo piensas.",
          minutes: 35,
          exercises: [
            fill("Completa las siglas del método para responder preguntas de comportamiento: Situación, Tarea, Acción, ___.", "S · T · A · ___", [["Resultado", "resultado", "R"]], "STAR = Situación, Tarea, Acción y Resultado.", "text"),
            choice("En un ejercicio en vivo, ¿qué es lo PRIMERO que conviene hacer?", ["Escribir código de inmediato", "Repetir el problema y hacer preguntas", "Quedarse en silencio", "Buscar la respuesta en internet"], 1, "Aclarar el problema evita resolver algo distinto a lo pedido."),
          ],
        },
      ],
      quiz: [
        q("¿Qué evalúan principalmente en un ejercicio en vivo para junior?", ["Que no cometas errores", "Cómo piensas y comunicas", "La velocidad de escritura", "Tu ropa"], 1, "El proceso importa más que la perfección."),
        q("¿Qué hacer si no sabes una respuesta?", ["Inventar", "Ser honesto y explicar cómo lo aprenderías", "Cambiar de tema", "Terminar la entrevista"], 1, "La honestidad y la capacidad de aprender se valoran."),
        q("En STAR, la 'A' debe contar…", ["Lo que hizo el equipo", "Lo que hiciste tú", "Lo que hizo tu jefe", "Lo que pensabas hacer"], 1, "Describe tus acciones en primera persona."),
        q("¿Es buena idea hacer preguntas al final?", ["No, se ve mal", "Sí, muestra interés", "Solo sobre salario", "Solo si te lo exigen"], 1, "Demuestra interés y te ayuda a evaluar la empresa."),
        q("¿Qué hacer después de cada entrevista?", ["Olvidarla", "Anotar qué preguntaron y qué te costó", "Borrar tu CV", "Nada"], 1, "Así conviertes cada entrevista en un plan de mejora."),
      ],
    },
    {
      slug: "documentar-proyectos",
      title: "Cómo documentar proyectos",
      description: "READMEs claros, comentarios útiles y archivos que todo proyecto necesita.",
      duration: "3 días",
      level: "principiante",
      objectives: ["Escribir un README completo.", "Comentar el porqué del código.", "Usar .gitignore, LICENSE y .env.example.", "Revisar tus repositorios como lo haría un reclutador."],
      checklist: ["Todos mis proyectos destacados tienen README con captura", "Probé las instrucciones de instalación desde cero", "Agregué una licencia", "Mis proyectos tienen .env.example y no exponen secretos"],
      resources: [res("Make a README", "https://www.makeareadme.com/", "Inglés"), res("Choose a License", "https://choosealicense.com/", "Inglés"), res("GitHub Docs: Acerca de los README", "https://docs.github.com/es/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes")],
      lessons: [
        {
          key: "documentar-1",
          title: "Documenta como profesional",
          summary: "El README es la primera impresión de tu trabajo.",
          minutes: 30,
          exercises: [
            choice("¿Cuál es un buen comentario de código?", ["# suma 1 a i", "# Los meses de la API empiezan en 0; mostramos del 1 al 12", "# código", "# no tocar"], 1, "Los buenos comentarios explican el porqué, no repiten lo que el código ya dice."),
            choice("¿Qué archivo lista las variables de entorno necesarias SIN valores reales?", [".env", ".env.example", "LICENSE", "package-lock.json"], 1, ".env.example documenta qué variables hacen falta sin exponer secretos."),
          ],
        },
      ],
      quiz: [
        q("¿Qué debe decir la primera línea de un README?", ["Tu fecha de nacimiento", "Qué es el proyecto y para qué sirve", "La licencia", "Un chiste"], 1, "Debe entenderse de inmediato qué es."),
        q("¿Por qué incluir una captura o GIF?", ["Para ocupar espacio", "Para mostrar el proyecto sin instalarlo", "Es obligatorio", "No sirve"], 1, "Permite ver el resultado en segundos."),
        q("¿Para qué sirve el archivo LICENSE?", ["Para el inicio de sesión", "Indica cómo pueden usar tu código otras personas", "Para guardar contraseñas", "Para el CSS"], 1, "Define los permisos de uso del código."),
        q("¿Cómo comprobar que tus instrucciones de instalación funcionan?", ["Suponerlo", "Seguirlas desde cero o pedirle a alguien que lo haga", "Escribirlas en mayúsculas", "No hace falta"], 1, "Las instrucciones se prueban."),
        q("¿Qué sección muestra tu proceso de pensamiento a un reclutador?", ["Lo que aprendí", "Licencia", "Dependencias", "Autor"], 0, "Muestra reflexión y crecimiento."),
      ],
    },
  ],
};
