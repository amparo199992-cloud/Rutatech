<!-- @lesson computadora-1 -->
## La computadora como una cocina

Imagina una cocina. Hay un **chef** que sigue recetas, una **mesa de trabajo** donde pone los ingredientes que está usando y una **despensa** donde guarda todo lo demás. Una computadora funciona de forma muy parecida:

| Parte | En la cocina | Qué hace |
|---|---|---|
| **CPU** (procesador) | El chef | Ejecuta instrucciones, una tras otra, muy rápido. |
| **RAM** (memoria) | La mesa de trabajo | Guarda lo que se está usando *ahora mismo*. Es rápida pero se borra al apagar. |
| **Almacenamiento** (SSD o disco duro) | La despensa | Guarda archivos y programas de forma permanente, aunque apagues el equipo. |
| **Placa base** | La cocina misma | Conecta todas las piezas entre sí. |

### Entrada, proceso y salida

Todo lo que hace una computadora sigue el ciclo **entrada → proceso → salida**:

1. **Entrada:** recibes datos (teclado, ratón, micrófono, red).
2. **Proceso:** la CPU los transforma siguiendo las instrucciones de un programa.
3. **Salida:** muestra el resultado (pantalla, parlantes, impresora, un archivo guardado).

Cuando abres una foto, por ejemplo: el programa se copia del almacenamiento a la RAM, la CPU lee los datos de la imagen y la pantalla muestra el resultado.

### ¿Por qué importa la RAM?

Si la mesa de trabajo es pequeña, el chef tiene que ir y volver a la despensa constantemente. Por eso un equipo con poca RAM se pone lento cuando abres muchos programas o pestañas: el sistema empieza a mover datos al almacenamiento, que es mucho más lento.

### Hardware y software

- **Hardware:** lo que puedes tocar (piezas físicas).
- **Software:** las instrucciones (programas, sistema operativo, aplicaciones).

> 💡 **Idea clave:** programar es escribir las recetas que el chef (la CPU) va a seguir.

<!-- @lesson computadora-2 -->
## Todo son ceros y unos

Las computadoras funcionan con electricidad, y lo más sencillo para un circuito es distinguir dos estados: **hay corriente** o **no hay corriente**. Por eso toda la información se representa con dos símbolos: **1** y **0**. A cada uno se le llama **bit** (de *binary digit*, dígito binario).

### De bits a bytes

- **1 bit** = un 0 o un 1.
- **1 byte** = 8 bits. Con un byte puedes representar 256 valores distintos (de 0 a 255).
- **1 kilobyte (KB)** ≈ mil bytes · **1 megabyte (MB)** ≈ un millón · **1 gigabyte (GB)** ≈ mil millones · **1 terabyte (TB)** ≈ un billón.

> En sentido estricto, 1 KiB = 1024 bytes. Los fabricantes de discos usan múltiplos de 1000; por eso un disco "de 1 TB" muestra algo menos en tu sistema.

### Contar en binario

En decimal cada posición vale 10 veces más que la anterior (unidades, decenas, centenas). En binario cada posición vale **el doble**:

```
Posición:   8   4   2   1
Binario:    1   0   1   1   →  8 + 0 + 2 + 1 = 11
```

Así, `0101` en binario es `5` en decimal, y `1111` es `15`.

### ¿Y el texto, las imágenes y la música?

Todo se convierte en números:

- **Texto:** cada carácter tiene un número. En la codificación **UTF-8** (la estándar hoy), la letra `A` es el 65 y emojis como 😀 usan varios bytes.
- **Imágenes:** una cuadrícula de puntos (píxeles); cada píxel guarda cuánto rojo, verde y azul tiene (RGB), de 0 a 255.
- **Sonido:** miles de mediciones por segundo de la onda sonora.

> 💡 **Idea clave:** no necesitas calcular en binario para programar, pero entenderlo te ayuda a comprender tamaños de archivo, colores en la web (`#FF0000` es rojo puro) y por qué existen límites como 255.

<!-- @lesson so-1 -->
## El sistema operativo: el administrador del edificio

El **sistema operativo (SO)** es el programa principal de tu equipo. Es como el administrador de un edificio: reparte los recursos, controla quién entra y mantiene el orden. Los más comunes son **Windows**, **macOS** y **Linux** en computadoras, y **Android** e **iOS** en celulares.

### Sus tareas principales

1. **Gestionar procesos:** decide qué programa usa la CPU en cada momento. Por eso puedes escuchar música mientras escribes.
2. **Gestionar la memoria:** asigna RAM a cada programa y evita que uno lea la memoria de otro.
3. **Gestionar archivos:** organiza el almacenamiento en carpetas y archivos.
4. **Controlar dispositivos:** se comunica con teclado, pantalla, impresora o Wi-Fi mediante *drivers* (controladores).
5. **Seguridad y usuarios:** cuentas, contraseñas y permisos.

### Interfaz gráfica y línea de comandos

Puedes hablar con el sistema operativo de dos formas:

- **Interfaz gráfica (GUI):** ventanas, íconos y clics.
- **Línea de comandos (CLI):** escribes órdenes de texto. Parece antigua, pero es la herramienta diaria de programadores y administradores de sistemas porque es rápida, precisa y automatizable. La verás en el siguiente módulo.

### Procesos y el administrador de tareas

Cada programa en ejecución es un **proceso**. Puedes verlos en el *Administrador de tareas* (Windows, `Ctrl + Shift + Esc`), el *Monitor de actividad* (macOS) o con el comando `top` en Linux. Si un programa se congela, desde ahí puedes cerrarlo.

> 💡 **Idea clave:** cuando programas, tu código no habla directamente con el hardware: le pide cosas al sistema operativo ("abre este archivo", "muestra esto en pantalla").

<!-- @lesson so-2 -->
## Archivos, carpetas y rutas

Un **archivo** es un conjunto de datos con nombre: un documento, una foto, un programa. Una **carpeta** (o directorio) agrupa archivos y otras carpetas, formando un **árbol**.

### Extensiones

La parte final del nombre indica el tipo de archivo: `informe.pdf`, `foto.jpg`, `script.py` (Python), `index.html` (página web). Activa **"mostrar extensiones de archivo"** en tu explorador: te ayudará a programar y a detectar archivos peligrosos como `factura.pdf.exe`.

### Rutas: la dirección de un archivo

Una **ruta** indica dónde está un archivo dentro del árbol:

```
Windows:      C:\Users\ana\Documentos\proyecto\notas.txt
macOS/Linux:  /home/ana/Documentos/proyecto/notas.txt
```

- **Ruta absoluta:** empieza desde la raíz (`C:\` o `/`). Funciona desde cualquier lugar.
- **Ruta relativa:** parte de la carpeta en la que estás. Si estás en `proyecto`, basta con `notas.txt`.
- `.` significa "esta carpeta" y `..` significa "la carpeta de arriba" (la carpeta padre).

### Buenas prácticas para nombrar

- Evita espacios y tildes en archivos de código: usa `mi-proyecto` o `mi_proyecto`.
- Usa nombres descriptivos: `reporte-ventas-2026.csv` es mejor que `final_final2.csv`.
- Organiza por proyecto: una carpeta por proyecto, con subcarpetas como `docs`, `src`, `datos`.

```
estudios-tech/
├── etapa-1-fundamentos/
│   ├── notas.md
│   └── ejercicios/
└── etapa-2-python/
```

> 💡 **Idea clave:** casi todos los errores de principiante tipo "no encuentra el archivo" son problemas de rutas. Saber dónde estás y dónde está el archivo resuelve la mayoría.

<!-- @lesson terminal-1 -->
## Tu primera sesión en la terminal

La **terminal** es una ventana donde escribes comandos. Para abrirla:

- **Windows:** busca "Terminal" o "PowerShell".
- **macOS:** abre *Terminal* (Aplicaciones → Utilidades).
- **Linux:** `Ctrl + Alt + T` en la mayoría de distribuciones.

Verás un **prompt** (indicador) esperando tu orden. Escribe un comando y presiona `Enter`.

### Comandos esenciales

| Acción | macOS / Linux | Windows PowerShell |
|---|---|---|
| ¿Dónde estoy? | `pwd` | `pwd` (o `Get-Location`) |
| Ver contenido | `ls` | `ls` (o `dir`) |
| Entrar a una carpeta | `cd Documentos` | `cd Documentos` |
| Subir un nivel | `cd ..` | `cd ..` |
| Crear carpeta | `mkdir proyecto` | `mkdir proyecto` |
| Crear archivo vacío | `touch notas.txt` | `New-Item notas.txt` |
| Ver un archivo | `cat notas.txt` | `cat notas.txt` |
| Copiar | `cp a.txt b.txt` | `cp a.txt b.txt` |
| Mover o renombrar | `mv a.txt docs/` | `mv a.txt docs/` |
| Borrar archivo | `rm a.txt` | `rm a.txt` |
| Limpiar pantalla | `clear` | `cls` o `clear` |

PowerShell incluye *alias* que imitan los comandos de Linux, por eso muchos funcionan igual.

### Un ejemplo completo

```bash
cd ~                  # ve a tu carpeta personal
mkdir estudios-tech   # crea una carpeta
cd estudios-tech      # entra en ella
mkdir notas ejercicios
touch notas/dia-1.md  # en PowerShell: New-Item notas/dia-1.md
ls                    # muestra: ejercicios  notas
```

### Trucos que te ahorran tiempo

- **Tab** autocompleta nombres de archivos y carpetas.
- **Flecha arriba** recupera comandos anteriores.
- `Ctrl + C` detiene un comando que se quedó corriendo.

### ⚠️ Cuidado con borrar

`rm` **no envía a la papelera**: borra definitivamente. Antes de borrar, usa `pwd` y `ls` para confirmar dónde estás. Nunca ejecutes comandos copiados de internet que no entiendas, especialmente si incluyen `rm -rf` o `sudo`.

> 💡 **Idea clave:** la terminal no es mágica: cada comando es un programa pequeño que hace una sola cosa bien.

<!-- @lesson internet-1 -->
## Cómo viaja una página web hasta tu pantalla

Internet es una red de redes: millones de equipos conectados que se envían mensajes siguiendo reglas comunes llamadas **protocolos**.

### Cliente y servidor

- **Cliente:** el programa que pide algo (tu navegador, una app del celular).
- **Servidor:** un equipo que está siempre encendido esperando peticiones y respondiendo (por ejemplo, el que guarda una página web).

Es como un restaurante: tú (cliente) haces un pedido y la cocina (servidor) lo prepara y te lo entrega.

### Direcciones IP

Cada equipo conectado tiene una **dirección IP**, su "dirección postal" en la red:

- **IPv4:** `142.250.78.14` (cuatro números de 0 a 255).
- **IPv6:** `2800:3f0:4005:...` (más larga, porque las IPv4 se agotaron).

En casa, tu router tiene una IP pública hacia internet y reparte IPs privadas (como `192.168.1.10`) a tus dispositivos.

### DNS: la agenda de contactos de internet

Recordar números es difícil, por eso usamos nombres como `wikipedia.org`. El **DNS** (*Domain Name System*) traduce nombres a direcciones IP, como la agenda del celular traduce "Mamá" a un número telefónico.

### El viaje completo

1. Escribes `https://ejemplo.com` en el navegador.
2. Tu equipo pregunta al **DNS**: "¿cuál es la IP de ejemplo.com?".
3. Con la IP, el navegador se conecta al **servidor**.
4. Envía una **petición HTTP**: "dame la página principal".
5. El servidor responde con el contenido (HTML, imágenes, estilos).
6. Tu navegador lo dibuja en pantalla.

Todo esto suele pasar en menos de un segundo.

### Puertos

Un servidor puede ofrecer varios servicios a la vez. El **puerto** indica a cuál te diriges, como el número de apartamento dentro de un edificio: la web usa el `80` (HTTP) y el `443` (HTTPS).

> 💡 **Idea clave:** cuando desarrolles una web, tu propio computador será el servidor durante las pruebas: lo verás como `localhost` o `127.0.0.1`.

<!-- @lesson internet-2 -->
## HTTP y HTTPS: el idioma de la web

**HTTP** (*HyperText Transfer Protocol*) define cómo se piden y entregan los recursos web. Cada intercambio tiene una **petición** y una **respuesta**.

### Métodos más comunes

| Método | Para qué sirve | Ejemplo |
|---|---|---|
| `GET` | Pedir datos | Ver un perfil |
| `POST` | Enviar datos nuevos | Crear una cuenta |
| `PUT` / `PATCH` | Actualizar datos | Editar tu nombre |
| `DELETE` | Borrar datos | Eliminar una publicación |

### Códigos de estado

El servidor responde con un número que resume qué pasó:

- **2xx – Éxito:** `200 OK`, `201 Created`.
- **3xx – Redirección:** `301` (se mudó de dirección).
- **4xx – Error del cliente:** `400` (petición mal hecha), `401` (no has iniciado sesión), `403` (no tienes permiso), `404` (no existe).
- **5xx – Error del servidor:** `500` (algo falló del lado del servidor).

### Una petición por dentro

```http
GET /recursos HTTP/1.1
Host: ejemplo.com
Accept: text/html
```

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

<!doctype html> ...
```

### ¿Y la "S" de HTTPS?

HTTPS es HTTP **cifrado** con TLS. Garantiza tres cosas:

1. **Confidencialidad:** nadie en el camino (por ejemplo, en un Wi-Fi público) puede leer lo que envías.
2. **Integridad:** nadie puede modificar los datos sin que se note.
3. **Autenticidad:** el certificado confirma que hablas con el sitio real.

El candado del navegador indica que la conexión está cifrada, **pero no que el sitio sea honesto**: un sitio de *phishing* también puede tener HTTPS. Revisa siempre que el dominio sea el correcto.

> 💡 **Idea clave:** puedes ver las peticiones reales abriendo las herramientas de desarrollo del navegador (`F12`) → pestaña **Red / Network**. ¡Pruébalo con esta misma página!

<!-- @lesson seguridad-1 -->
## Contraseñas fuertes, gestores y 2FA

La mayoría de cuentas robadas no se "hackean" con técnicas de película: se roban porque la contraseña era débil o se reutilizó en varios sitios.

### Qué hace fuerte a una contraseña

- **Longitud** antes que complejidad: una frase de 4–5 palabras al azar (`tigre-nube-cuaderno-salsa`) es más fuerte y fácil de recordar que `P@ss1!`.
- **Única para cada sitio.** Si un sitio sufre una filtración y usas la misma clave en todas partes, los atacantes la probarán en tu correo, tu banco y tus redes.
- **Nada personal:** nombres, fechas de cumpleaños o equipos de fútbol son lo primero que se prueba.

### Gestores de contraseñas

Un **gestor de contraseñas** guarda todas tus claves cifradas detrás de una sola contraseña maestra. Genera contraseñas aleatorias y las rellena por ti. Existen opciones de código abierto como **Bitwarden** o **KeePassXC**, y los navegadores y sistemas operativos traen gestores integrados. Lo importante es usar uno y proteger muy bien la contraseña maestra.

### Verificación en dos pasos (2FA)

La **2FA** pide algo más que la contraseña:

1. Algo que **sabes** (contraseña).
2. Algo que **tienes** (celular con una app de códigos, llave de seguridad).
3. Algo que **eres** (huella, rostro).

Aunque roben tu contraseña, sin el segundo factor no pueden entrar. Las **apps de autenticación** (códigos que cambian cada 30 segundos) y las **llaves de acceso (passkeys)** son más seguras que los SMS, pero cualquier 2FA es mejor que ninguna. Actívala primero en tu **correo**: con él se recuperan todas las demás cuentas.

> 💡 **Idea clave:** puedes revisar si tu correo apareció en filtraciones conocidas en *Have I Been Pwned* (haveibeenpwned.com). Si aparece, cambia esas contraseñas.

<!-- @lesson seguridad-2 -->
## Phishing y copias de seguridad

### Phishing: el engaño como ataque

El **phishing** es un mensaje que se hace pasar por alguien de confianza (tu banco, una tienda, una entidad pública, tu jefe) para que entregues datos o instales algo. Llega por correo, SMS (*smishing*), WhatsApp o llamada.

**Señales de alerta:**

- **Urgencia o miedo:** "Tu cuenta será bloqueada en 24 horas".
- **Remitente o enlace extraño:** `soporte@banco-seguro-verificacion.com` o `bancoo.com`.
- **Te pide datos sensibles:** contraseñas, códigos 2FA, números de tarjeta. Las entidades serias **nunca** te piden tu clave o tu código de verificación.
- **Archivos adjuntos inesperados**, sobre todo `.zip`, `.exe` o documentos que piden "habilitar macros".
- **Premios demasiado buenos** para ser verdad.

**Qué hacer:** no hagas clic. Entra al sitio escribiendo tú mismo la dirección o usando la app oficial. Si dudas, contacta a la entidad por un canal oficial. Reporta el mensaje como phishing.

### Copias de seguridad: tu seguro contra desastres

Un disco que falla, un robo o un *ransomware* (programa que secuestra tus archivos) pueden hacerte perder todo. La regla clásica es **3-2-1**:

- **3** copias de tus datos importantes,
- en **2** tipos de almacenamiento distintos (por ejemplo, disco externo y nube),
- **1** de ellas fuera de casa (la nube cuenta).

Para tu código existe una herramienta todavía mejor: **Git y GitHub**, que verás en el siguiente módulo. Guardan cada versión de tu trabajo.

### Actualizaciones

Instalar las actualizaciones del sistema y del navegador cierra fallos de seguridad conocidos. Postergarlas indefinidamente deja puertas abiertas.

> 💡 **Idea clave:** la seguridad no es un producto que se instala, es un hábito: contraseñas únicas, 2FA, desconfianza sana y copias de seguridad.

<!-- @lesson git-1 -->
## ¿Qué es el control de versiones?

¿Alguna vez tuviste archivos como `tesis-final.docx`, `tesis-final-ahora-si.docx` y `tesis-final-v3-corregida.docx`? El **control de versiones** resuelve ese problema de forma ordenada.

### Git

**Git** es un programa que guarda el historial de cambios de una carpeta (llamada **repositorio**). Cada vez que quieres guardar un punto importante, haces un **commit**: una "foto" del proyecto con un mensaje que explica qué cambiaste.

Con Git puedes:

- Volver a cualquier versión anterior.
- Ver quién cambió qué y cuándo.
- Probar ideas en **ramas** sin romper la versión que funciona.
- Trabajar en equipo sin sobrescribir el trabajo de otros.

### Git no es lo mismo que GitHub

- **Git** es la herramienta que corre en tu computadora.
- **GitHub** es un sitio web que guarda copias de tus repositorios en la nube, permite colaborar y funciona como tu **portafolio público**. Hay alternativas como GitLab o Bitbucket.

### Las tres zonas de Git

1. **Directorio de trabajo:** tus archivos tal como los editas.
2. **Área de preparación (*staging*):** los cambios que elegiste incluir en el próximo commit (`git add`).
3. **Repositorio:** el historial de commits guardados (`git commit`).

```bash
git init                          # convierte la carpeta en repositorio
git status                        # ¿qué cambió?
git add notas.md                  # prepara el archivo
git commit -m "Agrega mis notas"  # guarda la foto con un mensaje
git log --oneline                 # muestra el historial
```

### Configuración inicial (una sola vez)

Instala Git desde git-scm.com y luego indica quién eres:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@ejemplo.com"
```

> 💡 **Idea clave:** un buen mensaje de commit explica *qué* cambió y, si hace falta, *por qué*: "Corrige el cálculo del total" es mucho mejor que "cambios".

<!-- @lesson git-2 -->
## Tu primer repositorio en GitHub

### 1. Crea tu cuenta

Regístrate en github.com con un nombre de usuario profesional (por ejemplo, `ana-gomez-dev`): será parte de tu portafolio. Activa la verificación en dos pasos.

### 2. Crea un repositorio

Botón **New** → ponle nombre (`estudios-tech`) → elige **Public** → marca *Add a README file* → **Create repository**.

### 3. Clónalo en tu computadora

**Clonar** es descargar una copia del repositorio con todo su historial:

```bash
git clone https://github.com/tu-usuario/estudios-tech.git
cd estudios-tech
```

### 4. Haz cambios y súbelos

```bash
echo "# Mis notas de la etapa 1" > notas.md
git add notas.md
git commit -m "Agrega notas de la etapa 1"
git push                    # envía tus commits a GitHub
```

La primera vez que hagas `git push`, GitHub te pedirá autenticarte. Ya **no acepta tu contraseña normal** en la terminal: usa el inicio de sesión del navegador que te ofrece Git Credential Manager (incluido en Git para Windows), la herramienta oficial `gh auth login` (GitHub CLI) o un *token* de acceso personal.

### 5. El ciclo diario

```text
editar archivos → git add → git commit -m "mensaje" → git push
```

Y si trabajas desde otro equipo o alguien más subió cambios: `git pull` para traerlos.

### El archivo README.md

Es la portada de tu repositorio. Se escribe en **Markdown**, un formato de texto sencillo:

```markdown
# Título
Texto normal, **negrita** y *cursiva*.
- Un elemento de lista
[Un enlace](https://github.com)
```

> 💡 **Idea clave:** sube tus ejercicios a GitHub desde el primer día. Dentro de seis meses tendrás un historial visible de todo lo que aprendiste.
