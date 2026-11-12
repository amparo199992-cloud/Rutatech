import { choice, fill, output, q, res } from "./helpers.js";

export default {
  slug: "fundamentos",
  order: 1,
  icon: "🧭",
  title: "Fundamentos de tecnología",
  subtitle: "Entiende la máquina antes de programarla",
  duration: "2 a 3 semanas",
  description:
    "Aprende cómo funciona una computadora, cómo moverte por archivos y la terminal, cómo viaja la información por internet, cómo protegerte en línea y cómo guardar tu trabajo con Git y GitHub.",
  modules: [
    {
      slug: "como-funciona-una-computadora",
      title: "Cómo funciona una computadora",
      description: "CPU, memoria, almacenamiento y cómo se representa la información con ceros y unos.",
      duration: "2 días",
      level: "principiante",
      objectives: [
        "Identificar las partes principales de una computadora y su función.",
        "Explicar el ciclo entrada → proceso → salida.",
        "Entender qué son bits y bytes y convertir números binarios sencillos.",
      ],
      checklist: [
        "Puedo explicar la diferencia entre RAM y almacenamiento con un ejemplo.",
        "Sé por qué un equipo se pone lento con muchos programas abiertos.",
        "Puedo convertir 0101 y 1010 de binario a decimal.",
        "Sé cuántos bits tiene un byte.",
      ],
      resources: [
        res("CS50x – Semana 0 (Scratch y representación de datos)", "https://cs50.harvard.edu/x/", "Inglés (subtítulos en español)"),
        res("Glosario de MDN: Bit y Byte", "https://developer.mozilla.org/es/docs/Glossary/Byte"),
      ],
      lessons: [
        {
          key: "computadora-1",
          title: "Las partes de una computadora",
          summary: "CPU, RAM, almacenamiento y el ciclo entrada-proceso-salida.",
          minutes: 15,
          exercises: [
            choice(
              "Estás editando un documento y se va la luz sin que lo hayas guardado. ¿En qué parte estaba el documento?",
              ["En el almacenamiento (SSD)", "En la RAM", "En la CPU", "En la placa base"],
              1,
              "Mientras editas, los datos están en la RAM, que es volátil: se borra al perder la energía. Al guardar, se copian al almacenamiento permanente."
            ),
            choice(
              "¿Cuál de estas acciones es un ejemplo de SALIDA?",
              ["Escribir con el teclado", "Hablar por el micrófono", "Imprimir un documento", "Mover el ratón"],
              2,
              "La impresora entrega el resultado del proceso al mundo exterior: eso es salida. Teclado, micrófono y ratón son dispositivos de entrada."
            ),
          ],
        },
        {
          key: "computadora-2",
          title: "Bits, bytes y binario",
          summary: "Cómo se convierte cualquier información en ceros y unos.",
          minutes: 20,
          exercises: [
            output(
              "Convierte el número binario 1010 a decimal. Escribe solo el número.",
              "1010",
              ["10"],
              "Posiciones 8-4-2-1: 1×8 + 0×4 + 1×2 + 0×1 = 10.",
              "text"
            ),
            output(
              "¿Cuántos bits hay en 2 bytes? Escribe solo el número.",
              "2 bytes = ? bits",
              ["16"],
              "Cada byte tiene 8 bits, así que 2 bytes = 16 bits.",
              "text"
            ),
          ],
        },
      ],
      quiz: [
        q("¿Qué componente ejecuta las instrucciones de los programas?", ["La RAM", "La CPU", "El SSD", "El monitor"], 1, "La CPU (procesador) es el 'chef' que sigue las instrucciones una a una."),
        q("¿Qué pasa con el contenido de la RAM al apagar el equipo?", ["Se guarda en la nube", "Se conserva intacto", "Se borra", "Se comprime"], 2, "La RAM es memoria volátil: necesita energía para mantener los datos."),
        q("¿Cuántos valores distintos puede representar un byte?", ["8", "16", "255", "256"], 3, "Un byte tiene 8 bits: 2⁸ = 256 combinaciones (del 0 al 255)."),
        q("¿Cuánto es 0111 en decimal?", ["5", "6", "7", "8"], 2, "0×8 + 1×4 + 1×2 + 1×1 = 7."),
        q("¿Cuál es un ejemplo de software?", ["El teclado", "El sistema operativo", "La tarjeta de video", "El cargador"], 1, "El software son instrucciones; el sistema operativo es un programa. Los demás son hardware."),
      ],
    },
    {
      slug: "sistema-operativo-archivos",
      title: "Sistema operativo, archivos y carpetas",
      description: "Qué hace el sistema operativo y cómo se organizan archivos, extensiones y rutas.",
      duration: "2 días",
      level: "principiante",
      objectives: [
        "Describir las funciones principales de un sistema operativo.",
        "Diferenciar rutas absolutas y relativas.",
        "Organizar tus proyectos con nombres y carpetas claras.",
      ],
      checklist: [
        "Activé la opción de mostrar extensiones de archivo.",
        "Sé abrir el administrador de tareas y cerrar un programa congelado.",
        "Puedo escribir la ruta absoluta de un archivo de mi equipo.",
        "Entiendo qué significan . y .. en una ruta.",
      ],
      resources: [
        res("GCFGlobal: Informática básica", "https://edu.gcfglobal.org/es/informatica-basica/"),
        res("Ubuntu: El sistema de archivos de Linux (tutorial de línea de comandos)", "https://ubuntu.com/tutorials/command-line-for-beginners", "Inglés"),
      ],
      lessons: [
        {
          key: "so-1",
          title: "¿Qué hace un sistema operativo?",
          summary: "Procesos, memoria, archivos, dispositivos y seguridad.",
          minutes: 15,
          exercises: [
            choice(
              "Tu reproductor de música y tu editor de texto funcionan al mismo tiempo. ¿Quién reparte el tiempo de CPU entre ellos?",
              ["El navegador", "El sistema operativo", "El disco duro", "El router"],
              1,
              "El sistema operativo gestiona los procesos y decide qué programa usa la CPU en cada instante."
            ),
          ],
        },
        {
          key: "so-2",
          title: "Archivos, carpetas y rutas",
          summary: "Extensiones, rutas absolutas y relativas, y cómo nombrar bien.",
          minutes: 20,
          exercises: [
            choice(
              "Estás en la carpeta /home/ana/proyecto. ¿Qué ruta relativa lleva a /home/ana/fotos?",
              ["fotos", "./fotos", "../fotos", "/fotos"],
              2,
              "'..' sube a /home/ana y desde ahí entras a 'fotos'. '/fotos' sería una ruta absoluta desde la raíz."
            ),
            choice(
              "¿Cuál es el nombre más recomendable para un archivo de código?",
              ["Mi Programa Final.py", "programa-final(2).py", "calculadora_gastos.py", "Cálculo Año.py"],
              2,
              "Sin espacios, sin tildes y descriptivo: así evitas errores en la terminal y en otros sistemas."
            ),
          ],
        },
      ],
      quiz: [
        q("¿Cuál NO es una función del sistema operativo?", ["Gestionar la memoria", "Controlar dispositivos", "Diseñar la página web de una empresa", "Administrar usuarios y permisos"], 2, "Diseñar una página web lo hace una persona con herramientas; el SO gestiona recursos del equipo."),
        q("¿Qué es una ruta absoluta?", ["Una ruta que parte de la carpeta actual", "Una ruta que empieza desde la raíz del sistema", "Una ruta con extensión", "Una ruta en internet"], 1, "Empieza en la raíz (C:\\ o /) y funciona desde cualquier ubicación."),
        q("¿Qué indica la extensión .py?", ["Una imagen", "Un documento de Word", "Un programa de Python", "Un archivo comprimido"], 2, ".py es la extensión de los archivos de código Python."),
        q("¿Por qué es peligroso un archivo llamado 'factura.pdf.exe'?", ["Porque es muy pesado", "Porque en realidad es un programa ejecutable", "Porque está dañado", "No es peligroso"], 1, "La extensión real es .exe: es un programa disfrazado de PDF, típico del malware."),
        q("En una ruta, ¿qué significa '..'?", ["La carpeta actual", "La carpeta padre", "La raíz", "Un archivo oculto"], 1, "'..' sube un nivel en el árbol de carpetas."),
      ],
    },
    {
      slug: "terminal-linea-de-comandos",
      title: "Terminal y línea de comandos",
      description: "Navega, crea, copia y mueve archivos con comandos en Windows, macOS y Linux.",
      duration: "3 días",
      level: "principiante",
      objectives: [
        "Abrir la terminal en tu sistema operativo.",
        "Usar pwd, ls, cd, mkdir, touch, cp, mv y rm con seguridad.",
        "Aprovechar el autocompletado y el historial de comandos.",
      ],
      checklist: [
        "Abrí la terminal y ejecuté pwd y ls.",
        "Creé una carpeta y un archivo solo con comandos.",
        "Usé Tab para autocompletar un nombre.",
        "Sé que rm borra definitivamente y verifico dónde estoy antes de usarlo.",
      ],
      resources: [
        res("Ubuntu: The Linux command line for beginners", "https://ubuntu.com/tutorials/command-line-for-beginners", "Inglés"),
        res("Microsoft Learn: Introducción a PowerShell", "https://learn.microsoft.com/es-es/powershell/scripting/overview"),
      ],
      lessons: [
        {
          key: "terminal-1",
          title: "Tu primera sesión en la terminal",
          summary: "Los comandos esenciales para moverte y organizar archivos.",
          minutes: 30,
          exercises: [
            fill(
              "Completa el comando para CREAR una carpeta llamada proyecto.",
              "___ proyecto",
              [["mkdir"]],
              "mkdir (make directory) crea carpetas y funciona igual en macOS, Linux y PowerShell.",
              "bash"
            ),
            fill(
              "Completa el comando para SUBIR a la carpeta padre.",
              "cd ___",
              [[".."]],
              "'cd ..' te lleva un nivel arriba en el árbol de carpetas.",
              "bash"
            ),
            choice(
              "¿Qué comando muestra en qué carpeta estás?",
              ["ls", "pwd", "cd", "cat"],
              1,
              "pwd = print working directory (muestra el directorio de trabajo actual)."
            ),
          ],
        },
      ],
      quiz: [
        q("¿Qué hace el comando 'ls'?", ["Borra archivos", "Lista el contenido de la carpeta", "Cambia de carpeta", "Crea un archivo"], 1, "ls lista archivos y carpetas del directorio actual."),
        q("¿Qué tecla autocompleta nombres en la terminal?", ["Enter", "Esc", "Tab", "Shift"], 2, "Tab completa nombres de archivos, carpetas y comandos."),
        q("¿Qué hace 'mv informe.txt docs/'?", ["Copia el archivo", "Mueve el archivo a la carpeta docs", "Borra docs", "Muestra el archivo"], 1, "mv mueve (o renombra) archivos."),
        q("¿Qué atajo detiene un comando que se quedó ejecutándose?", ["Ctrl + Z", "Ctrl + C", "Ctrl + V", "Alt + F4"], 1, "Ctrl + C envía una señal de interrupción al programa en ejecución."),
        q("¿Por qué hay que tener cuidado con 'rm'?", ["Es muy lento", "Borra sin enviar a la papelera", "Solo funciona en Windows", "Cambia permisos"], 1, "rm elimina de forma definitiva; no hay papelera de reciclaje."),
      ],
    },
    {
      slug: "como-funciona-internet",
      title: "Internet: IP, DNS, HTTP y cliente-servidor",
      description: "Qué pasa entre que escribes una dirección y ves la página en tu pantalla.",
      duration: "3 días",
      level: "principiante",
      objectives: [
        "Explicar el modelo cliente-servidor.",
        "Describir qué son una IP, un puerto y el DNS.",
        "Reconocer métodos HTTP y códigos de estado comunes.",
        "Entender qué protege (y qué no) HTTPS.",
      ],
      checklist: [
        "Puedo narrar el viaje de una petición web paso a paso.",
        "Abrí la pestaña Red (F12) y vi peticiones reales con su código de estado.",
        "Sé qué significan 200, 404 y 500.",
        "Sé que el candado de HTTPS no garantiza que un sitio sea legítimo.",
      ],
      resources: [
        res("MDN: ¿Cómo funciona la Web?", "https://developer.mozilla.org/es/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works"),
        res("MDN: Visión general de HTTP", "https://developer.mozilla.org/es/docs/Web/HTTP/Guides/Overview"),
        res("MDN: Códigos de estado de respuesta HTTP", "https://developer.mozilla.org/es/docs/Web/HTTP/Reference/Status"),
      ],
      lessons: [
        {
          key: "internet-1",
          title: "Cliente, servidor, IP y DNS",
          summary: "Las direcciones de internet y la agenda que las traduce.",
          minutes: 20,
          exercises: [
            choice(
              "Escribes 'wikipedia.org' en el navegador. ¿Qué sistema averigua su dirección IP?",
              ["HTTP", "DNS", "HTML", "USB"],
              1,
              "El DNS traduce nombres de dominio a direcciones IP, como una agenda de contactos."
            ),
          ],
        },
        {
          key: "internet-2",
          title: "HTTP y HTTPS",
          summary: "Métodos, códigos de estado y por qué importa el cifrado.",
          minutes: 20,
          exercises: [
            choice(
              "Un servidor responde con el código 404. ¿Qué significa?",
              ["Todo salió bien", "El recurso no existe", "Error interno del servidor", "Necesitas iniciar sesión"],
              1,
              "404 Not Found: el recurso pedido no existe en el servidor."
            ),
            choice(
              "¿Qué método HTTP usarías para CREAR una cuenta nueva?",
              ["GET", "POST", "DELETE", "HEAD"],
              1,
              "POST envía datos nuevos al servidor para crear un recurso."
            ),
          ],
        },
      ],
      quiz: [
        q("En el modelo cliente-servidor, ¿qué es tu navegador?", ["El servidor", "El cliente", "El DNS", "El router"], 1, "El navegador hace las peticiones: es el cliente."),
        q("¿Qué puerto usa normalmente HTTPS?", ["21", "80", "443", "8080"], 2, "HTTPS usa el puerto 443; HTTP sin cifrar usa el 80."),
        q("¿Qué código indica un error del lado del servidor?", ["200", "301", "404", "500"], 3, "Los códigos 5xx indican fallos del servidor."),
        q("¿Qué garantiza el candado de HTTPS?", ["Que el sitio es honesto", "Que la conexión está cifrada", "Que no hay virus", "Que la página es gratuita"], 1, "Cifra la conexión, pero un sitio fraudulento también puede tener HTTPS."),
        q("¿Qué es 'localhost'?", ["Un sitio web famoso", "Tu propio computador visto como servidor", "Un tipo de cable", "Un navegador"], 1, "localhost (127.0.0.1) se refiere a tu propio equipo."),
      ],
    },
    {
      slug: "seguridad-basica",
      title: "Seguridad básica",
      description: "Contraseñas, gestores de contraseñas, verificación en dos pasos, phishing y copias de seguridad.",
      duration: "2 días",
      level: "principiante",
      objectives: [
        "Crear contraseñas fuertes y únicas con un gestor.",
        "Activar la verificación en dos pasos en tus cuentas clave.",
        "Reconocer señales de phishing.",
        "Aplicar la regla de copias de seguridad 3-2-1.",
      ],
      checklist: [
        "Instalé o activé un gestor de contraseñas.",
        "Activé la 2FA en mi correo principal.",
        "Revisé mi correo en Have I Been Pwned.",
        "Tengo al menos una copia de seguridad de mis archivos importantes.",
      ],
      resources: [
        res("INCIBE: Oficina de Seguridad del Internauta (ciudadanía)", "https://www.incibe.es/ciudadania"),
        res("CISA: Secure Our World", "https://www.cisa.gov/secure-our-world", "Inglés"),
        res("Have I Been Pwned", "https://haveibeenpwned.com/", "Inglés"),
      ],
      lessons: [
        {
          key: "seguridad-1",
          title: "Contraseñas, gestores y 2FA",
          summary: "Cómo proteger tus cuentas de los ataques más comunes.",
          minutes: 20,
          exercises: [
            choice(
              "¿Cuál de estas contraseñas es más segura?",
              ["Bogota2024!", "MiNombre123", "tigre-nube-cuaderno-salsa", "P@ssw0rd"],
              2,
              "La longitud pesa más que los símbolos. Una frase de varias palabras al azar es larga, difícil de adivinar y fácil de recordar."
            ),
          ],
        },
        {
          key: "seguridad-2",
          title: "Phishing y copias de seguridad",
          summary: "Detecta engaños y protege tus datos contra pérdidas.",
          minutes: 20,
          exercises: [
            choice(
              "Recibes un SMS: 'Tu cuenta bancaria será bloqueada. Confirma tus datos aquí: banco-verificacion.co'. ¿Qué haces?",
              ["Entro rápido para evitar el bloqueo", "Respondo con mis datos", "No abro el enlace y entro por la app o web oficial", "Reenvío el mensaje a mis contactos"],
              2,
              "Urgencia + enlace extraño = phishing clásico. Verifica siempre por un canal oficial que tú mismo abras."
            ),
          ],
        },
      ],
      quiz: [
        q("¿Qué es lo más importante en una contraseña?", ["Que tenga tu fecha de nacimiento", "Que sea larga y única", "Que tenga exactamente 8 caracteres", "Que la compartas con alguien de confianza"], 1, "Longitud y unicidad son la mejor defensa."),
        q("¿Para qué sirve la verificación en dos pasos?", ["Para recordar la contraseña", "Para exigir un segundo factor además de la contraseña", "Para navegar más rápido", "Para borrar el historial"], 1, "Aunque roben tu contraseña, sin el segundo factor no pueden entrar."),
        q("¿Cuál es una señal típica de phishing?", ["Un mensaje que crea urgencia y pide tu clave", "Un boletín al que te suscribiste", "Una factura que esperabas en la app oficial", "Un correo de un amigo sin enlaces"], 0, "La urgencia y la petición de datos sensibles son señales clásicas."),
        q("En la regla 3-2-1, ¿qué significa el '1'?", ["Una contraseña", "Una copia fuera de casa", "Un antivirus", "Un disco"], 1, "Al menos una copia debe estar en otro lugar (por ejemplo, la nube)."),
        q("¿Qué cuenta conviene proteger primero con 2FA?", ["Un juego en línea", "El correo electrónico", "Una tienda que usas una vez al año", "Un foro"], 1, "Con el correo se recuperan las demás cuentas; es la llave maestra."),
      ],
    },
    {
      slug: "introduccion-git-github",
      title: "Introducción a Git y GitHub",
      description: "Guarda el historial de tu trabajo y publica tu primer repositorio.",
      duration: "3 días",
      level: "principiante",
      objectives: [
        "Explicar qué es el control de versiones y para qué sirve.",
        "Diferenciar Git de GitHub.",
        "Usar init, status, add, commit, push y pull.",
        "Crear un repositorio público con un README.",
      ],
      checklist: [
        "Instalé Git y configuré mi nombre y correo.",
        "Creé mi cuenta de GitHub con 2FA activada.",
        "Hice al menos tres commits con mensajes claros.",
        "Subí un repositorio con README a GitHub.",
      ],
      resources: [
        res("Pro Git (libro oficial, gratuito)", "https://git-scm.com/book/es/v2"),
        res("GitHub Docs: Introducción", "https://docs.github.com/es/get-started"),
        res("GitHub Docs: Sintaxis básica de Markdown", "https://docs.github.com/es/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"),
      ],
      lessons: [
        {
          key: "git-1",
          title: "¿Qué es el control de versiones?",
          summary: "Commits, repositorios y las tres zonas de Git.",
          minutes: 20,
          exercises: [
            fill(
              "Completa el comando para preparar (agregar al staging) el archivo notas.md.",
              "git ___ notas.md",
              [["add"]],
              "git add mueve los cambios al área de preparación; luego git commit los guarda en el historial.",
              "bash"
            ),
            choice(
              "¿Cuál es la diferencia entre Git y GitHub?",
              ["Son lo mismo", "Git es la herramienta local; GitHub es un servicio en la nube para alojar repositorios", "GitHub es un lenguaje de programación", "Git solo funciona en Windows"],
              1,
              "Git funciona en tu equipo; GitHub aloja copias de tus repositorios y facilita colaborar."
            ),
          ],
        },
        {
          key: "git-2",
          title: "Tu primer repositorio en GitHub",
          summary: "Clonar, hacer commits, subir con push y escribir un README.",
          minutes: 30,
          exercises: [
            fill(
              "Completa el comando para ENVIAR tus commits a GitHub.",
              "git ___",
              [["push"]],
              "git push sube tus commits locales al repositorio remoto.",
              "bash"
            ),
          ],
        },
      ],
      quiz: [
        q("¿Qué es un commit?", ["Un archivo borrado", "Una foto del proyecto guardada en el historial con un mensaje", "Un tipo de rama", "Una contraseña de GitHub"], 1, "Cada commit registra el estado del proyecto en un momento."),
        q("¿Qué comando muestra los archivos que cambiaron?", ["git log", "git status", "git push", "git clone"], 1, "git status muestra qué cambió y qué está preparado."),
        q("¿Qué hace 'git clone'?", ["Borra un repositorio", "Descarga una copia de un repositorio con su historial", "Crea una rama", "Sube cambios"], 1, "Clonar trae el repositorio completo a tu equipo."),
        q("¿Cuál es el mejor mensaje de commit?", ["cambios", "asdf", "Corrige el cálculo del total en la factura", "final final"], 2, "Describe con claridad qué cambió."),
        q("¿Para qué sirve 'git pull'?", ["Para traer cambios del repositorio remoto", "Para borrar el historial", "Para crear un README", "Para instalar Git"], 0, "git pull descarga e integra los cambios que están en GitHub."),
      ],
    },
  ],
};
