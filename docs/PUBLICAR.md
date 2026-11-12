# Cómo publicar RutaTech en internet

Esta guía te lleva desde el archivo `.zip` hasta tener RutaTech en línea, con su propia dirección web. Usa tres servicios gratuitos:

| Servicio | Para qué |
|---|---|
| **GitHub** | Guardar el código y actualizar la app con cada cambio |
| **Neon** | Base de datos PostgreSQL (usuarios y progreso) |
| **Render** | Servidor donde corre la app |

Tiempo estimado: 45 a 60 minutos la primera vez. Los comandos están pensados para **Windows (PowerShell)**; en macOS o Linux son iguales salvo donde se indica.

---

## Paso 0. Instala lo necesario (una sola vez)

1. **Git**: descárgalo de https://git-scm.com/download/win e instálalo con las opciones por defecto. Incluye *Git Credential Manager*, que te permitirá iniciar sesión en GitHub desde el navegador.
2. **Node.js LTS** (versión 22 o 24): https://nodejs.org. Opciones por defecto.
3. Cierra y vuelve a abrir PowerShell, y comprueba:

   ```powershell
   git --version
   node --version
   ```

4. **Cuenta de GitHub**: https://github.com/signup. Usa un nombre de usuario profesional y activa la verificación en dos pasos (*Settings → Password and authentication*).

## Paso 1. Prepara la carpeta del proyecto

1. Descomprime `rutatech.zip`, por ejemplo en `Documentos`. Quedará la carpeta `Documentos\rutatech`.
2. Abre PowerShell en esa carpeta:

   ```powershell
   cd $HOME\Documents\rutatech
   ```

3. (Recomendado) Pruébala en tu equipo antes de publicarla:

   ```powershell
   npm run setup
   npm run dev
   ```

   Abre http://localhost:5173. Para detenerla, vuelve a PowerShell y presiona `Ctrl + C`.

## Paso 2. Sube el código a GitHub

### 2.1 Configura tu identidad en Git (una sola vez)

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@ejemplo.com"
```

> Si prefieres no publicar tu correo, usa el correo privado que te da GitHub en *Settings → Emails* (termina en `@users.noreply.github.com`).

### 2.2 Crea el repositorio vacío en GitHub

1. Entra a https://github.com/new.
2. **Repository name:** `rutatech`.
3. Elige **Public** (sirve como portafolio) o **Private** (Render funciona con ambos).
4. **No marques** *Add a README*, *.gitignore* ni *license*: el proyecto ya los trae y marcarlos crea conflictos.
5. Haz clic en **Create repository** y copia la dirección que aparece, del estilo `https://github.com/TU-USUARIO/rutatech.git`.

### 2.3 Sube el proyecto

Desde la carpeta `rutatech`:

```powershell
git init
git add .
git status
```

Revisa la lista de `git status`. **No deben aparecer** `server/.env`, `node_modules` ni archivos `.db`: el `.gitignore` los excluye porque contienen datos locales y claves. Si aparecen, no continúes y revisa que el archivo `.gitignore` esté en la carpeta.

```powershell
git commit -m "Primera versión de RutaTech"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/rutatech.git
git push -u origin main
```

La primera vez se abrirá una ventana del navegador para iniciar sesión en GitHub: autoriza y vuelve a PowerShell. Recarga la página del repositorio: ya debería verse el código y el README.

## Paso 3. Crea la base de datos en Neon

1. Entra a https://neon.com y regístrate (puedes usar tu cuenta de GitHub).
2. Crea un proyecto: nombre `rutatech`, versión de Postgres la que venga por defecto, y la región **AWS US East 2 (Ohio)**, que coincide con la región configurada para Render en `render.yaml`.
3. En el panel del proyecto, haz clic en **Connect**.
4. **Desactiva** la opción **Connection pooling** y copia la cadena de conexión. Se parece a:

   ```text
   postgresql://neondb_owner:CLAVE@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

5. Puedes pegarla tal cual: la app ignora el `&channel_binding=require` del final. Guarda esta cadena en un lugar seguro: es la llave de tu base de datos. **Nunca la subas a GitHub.**

## Paso 4. Publica la app en Render

1. Entra a https://render.com y regístrate con tu cuenta de GitHub.
2. Haz clic en **New → Blueprint** y conecta tu repositorio `rutatech` (si no aparece, usa *Configure account* para darle acceso a Render).
3. Render lee el archivo `render.yaml` y te pide estos valores:

   | Variable | Qué poner |
   |---|---|
   | `DATABASE_URL` | La cadena de Neon del paso 3 |
   | `CLIENT_URL` | `https://rutatech.onrender.com` (la ajustarás en el paso 5 si Render te asigna otra) |
   | `SITE_URL` | La misma que `CLIENT_URL` |
   | `ADMIN_EMAIL` | Tu correo de administración |
   | `ADMIN_PASSWORD` | Una contraseña fuerte (mínimo 12 caracteres, distinta de `CambiaEsto123`) |
   | `RESEND_API_KEY`, `MAIL_FROM` | Déjalas vacías por ahora (ver paso 6) |

   `JWT_SECRET` se genera solo.

4. Haz clic en **Apply**. La primera compilación tarda unos minutos. Puedes seguirla en la pestaña **Logs**: al final verás `Contenido cargado: 6 etapas, 37 módulos…` y `API de RutaTech escuchando`.

## Paso 5. Comprueba que todo funciona

1. Copia la dirección del servicio que aparece arriba en Render (por ejemplo `https://rutatech.onrender.com` o `https://rutatech-ab12.onrender.com`).
2. Si es distinta de la que pusiste, ve a **Environment**, corrige `CLIENT_URL` y `SITE_URL`, guarda y haz **Manual Deploy → Deploy latest commit**.
3. Abre `https://TU-DIRECCION/api/health`: debe responder `{"ok":true,…}`.
4. Abre la página principal, inicia sesión con `ADMIN_EMAIL` y `ADMIN_PASSWORD` y entra a **Admin**.
5. Crea una cuenta de estudiante de prueba y completa una lección para confirmar que el progreso se guarda.

> La contraseña de administración solo se usa al crear la cuenta la primera vez. Si luego quieres cambiarla, hazlo desde **Mi perfil**; cambiar `ADMIN_PASSWORD` en Render no la modifica.

## Paso 6 (opcional). Correos de recuperación de contraseña

Sin este paso, la app funciona, pero el enlace de "Olvidé mi contraseña" no llega por correo (queda en los registros de Render).

1. Crea una cuenta en https://resend.com y genera una **API key**.
2. Para enviar desde tu propio dominio, verifícalo en Resend. Para pruebas, Resend ofrece una dirección de envío de prueba con limitaciones (revisa su documentación).
3. En Render → **Environment**, define `RESEND_API_KEY` y `MAIL_FROM` (por ejemplo `RutaTech <no-responder@tudominio.com>`) y vuelve a desplegar.

## Cómo publicar cambios después

Cada vez que modifiques el código o el contenido:

```powershell
git add .
git commit -m "Describe qué cambiaste"
git push
```

Render detecta el `push` y vuelve a desplegar solo. El contenido de los archivos de `server/prisma/content` se actualiza en cada despliegue **sin borrar el progreso** de los usuarios.

## Límites del plan gratuito

- **Render:** el servicio se apaga tras 15 minutos sin visitas y la siguiente visita tarda cerca de un minuto en cargar. Para evitarlo, usa un plan de pago.
- **Neon:** 1 GB de almacenamiento por proyecto, suficiente para miles de estudiantes. Si se llena, las escrituras fallan hasta que liberes espacio o cambies de plan; los datos no se borran.
- **No uses la base de datos gratuita de Render**: vence a los 30 días y luego se elimina con todos sus datos.

Revisa las condiciones vigentes en las páginas de precios de cada servicio, porque pueden cambiar.

## Solución de problemas

| Problema | Solución |
|---|---|
| `git` o `node` "no se reconoce como comando" | Cierra y abre PowerShell. Si sigue, reinstala marcando la opción de agregar al PATH. |
| `git push` dice `rejected` o `fetch first` | Creaste el repositorio con README. Ejecuta `git pull origin main --allow-unrelated-histories`, luego `git push`. |
| `git push` dice que expone tu correo (`GH007`) | Usa el correo `@users.noreply.github.com` del paso 2.1, luego `git commit --amend --reset-author --no-edit` y `git push`. |
| En Render: `Can't reach database server` | Revisa que `DATABASE_URL` sea la cadena **sin pooling** (el host no debe contener `-pooler`) e incluya `sslmode=require`. |
| La página carga pero no puedo iniciar sesión | Revisa que `CLIENT_URL` coincida exactamente con la dirección de Render (con `https://` y sin `/` al final). |
| El primer acceso tarda un minuto | Es normal en el plan gratuito: el servicio estaba dormido. |
| Los retos de Python no cargan | La red bloquea `cdn.jsdelivr.net`. Ver "Python sin acceso a internet externo" en el README. |
