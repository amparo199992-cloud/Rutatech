<!-- @lesson esp-web-1 -->
## El mapa del desarrollo web full stack

Una aplicación web moderna tiene dos grandes partes que se comunican por HTTP:

```text
 Navegador (frontend)            Servidor (backend)              Base de datos
 React, HTML, CSS, JS   ──HTTP──▶  Node.js + Express   ──SQL──▶   PostgreSQL
                       ◀──JSON──                      ◀────────
```

- **Frontend:** lo que la persona ve y usa. Hoy suele construirse con una biblioteca como **React**.
- **Backend:** recibe peticiones, aplica reglas de negocio, verifica permisos y habla con la base de datos. **Node.js** permite usar JavaScript también aquí.
- **API REST:** el "contrato" entre ambos: rutas como `GET /api/tareas` o `POST /api/tareas` que responden JSON.

### React en 1 minuto

React construye interfaces con **componentes**: funciones que devuelven lo que se debe mostrar. Cuando cambia el **estado**, React actualiza la pantalla solo.

```jsx
import { useState } from "react";

function Contador() {
  const [clics, setClics] = useState(0);
  return (
    <button onClick={() => setClics(clics + 1)}>
      Clics: {clics}
    </button>
  );
}
```

### Una API con Express en 10 líneas

```javascript
import express from "express";

const app = express();
app.use(express.json());

const tareas = [];

app.get("/api/tareas", (req, res) => res.json(tareas));

app.post("/api/tareas", (req, res) => {
  const tarea = { id: tareas.length + 1, titulo: req.body.titulo };
  tareas.push(tarea);
  res.status(201).json(tarea);
});

app.listen(3000, () => console.log("API en http://localhost:3000"));
```

### Autenticación

Para saber quién hace cada petición:

1. Nunca guardes contraseñas en texto plano: guarda un **hash** (con bcrypt o argon2).
2. Al iniciar sesión, el servidor entrega un **token** (JWT) o crea una **sesión**, idealmente en una *cookie* `httpOnly` que JavaScript no puede leer.
3. Cada petición privada verifica ese token antes de responder.

### Despliegue

**Desplegar** es publicar tu aplicación en internet. Servicios como **Vercel** o **Netlify** (frontend) y **Render** o **Railway** (backend y base de datos) se conectan a tu repositorio de GitHub y publican cada vez que haces `push`. Las claves secretas se configuran como **variables de entorno** en el panel del servicio, nunca en el código.

> 💡 **Idea clave:** RutaTech está construida exactamente con este stack (React + Express + Prisma). Leer su código es un excelente ejercicio para esta especialización.

<!-- @lesson esp-datos-1 -->
## Primeros pasos en análisis de datos

Analizar datos es convertir información cruda en **respuestas y decisiones**: ¿qué producto se vende más? ¿en qué mes gastamos más? ¿qué zonas necesitan más atención?

### El flujo de trabajo

1. **Preguntar:** define una pregunta concreta.
2. **Obtener** los datos (CSV, Excel, bases de datos, APIs, datos abiertos).
3. **Limpiar:** corregir valores faltantes, duplicados y formatos inconsistentes. Suele ser el 60–80 % del trabajo.
4. **Explorar y analizar:** resumir, agrupar, comparar.
5. **Visualizar y comunicar:** gráficos claros y conclusiones accionables.

### Pandas: Excel con superpoderes

**Pandas** es la biblioteca de Python más usada para manipular tablas (llamadas **DataFrames**).

```bash
pip install pandas matplotlib
```

```python
import pandas as pd

ventas = pd.read_csv("ventas.csv")      # también: pd.read_excel("ventas.xlsx")

print(ventas.head())        # primeras 5 filas
print(ventas.info())        # columnas, tipos y valores faltantes
print(ventas.describe())    # estadísticas básicas

# Limpieza
ventas = ventas.drop_duplicates()
ventas["fecha"] = pd.to_datetime(ventas["fecha"])
ventas["ciudad"] = ventas["ciudad"].str.strip().str.title()

# Análisis
por_ciudad = ventas.groupby("ciudad")["total"].sum().sort_values(ascending=False)
print(por_ciudad)
```

### Visualizar

```python
import matplotlib.pyplot as plt

por_ciudad.plot(kind="bar", title="Ventas por ciudad")
plt.ylabel("Total vendido")
plt.tight_layout()
plt.show()
```

Elige el gráfico según la pregunta: **barras** para comparar categorías, **líneas** para ver cambios en el tiempo, **dispersión** para relaciones entre dos variables. Evita los gráficos 3D y los de torta con muchas porciones.

### Herramientas del oficio

- **SQL:** para extraer datos de bases de datos (ya lo conoces).
- **Excel / Google Sheets:** tablas dinámicas y fórmulas siguen siendo indispensables en las empresas.
- **Power BI** o **Looker Studio:** tableros interactivos para que otras personas exploren los datos.
- **Jupyter Notebooks:** documentos que mezclan código, resultados y explicaciones.

### Dónde conseguir datos para practicar

Los portales de **datos abiertos** de gobiernos publican datos reales gratis: por ejemplo, datos.gov.co (Colombia), datos.gob.mx (México) o data.gov (Estados Unidos). Kaggle también tiene miles de conjuntos de datos.

> 💡 **Idea clave:** un buen análisis no es el que tiene más gráficos, sino el que responde claramente una pregunta importante.

<!-- @lesson esp-ciber-1 -->
## Fundamentos de ciberseguridad

La ciberseguridad protege sistemas, redes y datos contra accesos no autorizados, daños o robos.

### La tríada CIA

Todo en seguridad busca proteger tres propiedades:

- **Confidencialidad:** solo quien debe puede ver la información (cifrado, control de acceso).
- **Integridad:** la información no se altera sin autorización (hashes, firmas digitales).
- **Disponibilidad:** los sistemas funcionan cuando se necesitan (respaldos, protección contra ataques de denegación de servicio).

### Conceptos clave

- **Vulnerabilidad:** una debilidad (software sin actualizar, contraseña débil).
- **Amenaza:** algo que puede aprovecharla (un atacante, un malware).
- **Riesgo:** probabilidad × impacto de que ocurra.
- **Mínimo privilegio:** cada usuario o programa tiene solo los permisos indispensables.
- **Defensa en profundidad:** varias capas de protección, no una sola.

### Linux: la herramienta del oficio

La mayoría de servidores usan Linux, y casi todas las herramientas de seguridad corren en él. Comandos que usarás a diario:

```bash
whoami                 # ¿con qué usuario estoy?
ls -la                 # archivos, incluidos ocultos, con permisos
chmod 600 clave.txt    # solo el dueño puede leer y escribir
sudo apt update        # actualiza la lista de paquetes (Debian/Ubuntu)
ss -tulpn              # qué puertos están escuchando
grep "Failed" /var/log/auth.log   # buscar intentos de acceso fallidos
```

### Seguridad web: el OWASP Top 10

**OWASP** es una fundación que publica la lista de los riesgos más críticos en aplicaciones web. Algunos que ya viste en esta ruta:

- **Inyección** (como la inyección SQL): se previene con consultas parametrizadas.
- **Control de acceso roto:** un usuario ve datos de otro. Se previene verificando permisos en el **servidor**, siempre.
- **Fallas criptográficas:** contraseñas sin hash, datos sin cifrar.
- **Configuración insegura:** contraseñas por defecto, errores que muestran detalles internos.

### Ética y legalidad: lo más importante

⚠️ Probar la seguridad de un sistema **sin autorización por escrito es un delito** en la mayoría de países, aunque tu intención sea buena. Practica solo en:

- Tus propias máquinas virtuales.
- Plataformas diseñadas para ello (TryHackMe, Hack The Box, OWASP Juice Shop, PortSwigger Web Security Academy).
- Programas de *bug bounty* que autorizan pruebas explícitamente, respetando sus reglas.

> 💡 **Idea clave:** el trabajo de seguridad más demandado no es el de "hacker de película", sino el de analista que entiende sistemas, lee registros, aplica parches y explica riesgos con claridad.

<!-- @lesson esp-infra-1 -->
## Soporte e infraestructura: mantener la tecnología funcionando

El soporte técnico y la infraestructura son la puerta de entrada a la industria para muchas personas. Aquí se aprende cómo funcionan de verdad los equipos, las redes y los servidores.

### Método para resolver cualquier problema

1. **Identifica** el problema: ¿qué pasa exactamente? ¿desde cuándo? ¿a quién le pasa? ¿qué cambió?
2. **Establece una hipótesis**, empezando por lo más simple: ¿está conectado? ¿se reinició?
3. **Prueba** la hipótesis.
4. **Planifica e implementa** la solución.
5. **Verifica** que todo funcione.
6. **Documenta** lo que pasó y cómo lo resolviste.

### Diagnóstico de red

```bash
ping 8.8.8.8          # ¿hay conexión a internet?
ping google.com       # ¿funciona el DNS? (si el anterior sí y este no, es DNS)
ipconfig              # Windows: IP, puerta de enlace, DNS
ip a                  # Linux: lo mismo
tracert google.com    # Windows: ruta que siguen los paquetes (Linux: traceroute)
nslookup google.com   # consulta DNS
```

Conceptos de red que debes dominar: **IP**, **máscara de subred**, **puerta de enlace (gateway)**, **DHCP** (asigna IPs automáticamente), **DNS** y el **modelo OSI / TCP-IP** para ubicar en qué capa está el problema.

### Sistemas operativos

- **Windows:** cuentas de usuario, Directorio Activo (cuentas en empresas), visor de eventos, administración de actualizaciones.
- **Linux:** usuarios y permisos, servicios con `systemctl`, gestión de paquetes, lectura de registros.

### Virtualización

Una **máquina virtual** es un computador simulado dentro de tu computador. Con **VirtualBox** (gratuito) puedes instalar Linux o Windows Server para practicar sin riesgo. Las **imágenes instantáneas** (*snapshots*) te permiten volver atrás si algo sale mal.

Los **contenedores** (como **Docker**) son una versión más liviana: empaquetan una aplicación con todo lo que necesita.

### La nube

Proveedores como **AWS**, **Microsoft Azure** y **Google Cloud** alquilan servidores, almacenamiento y bases de datos por uso. Modelos principales:

- **IaaS:** alquilas máquinas virtuales (tú administras el sistema).
- **PaaS:** alquilas una plataforma para desplegar tu código (como Render).
- **SaaS:** usas software terminado (Gmail, Office 365).

> 💡 **Idea clave:** en soporte, la comunicación vale tanto como la técnica. Explicar sin tecnicismos, tener paciencia y documentar bien te diferencia.

<!-- @lesson esp-ia-1 -->
## IA y automatización: que el computador trabaje por ti

### Automatizar tareas repetitivas

Si haces lo mismo cada semana (renombrar archivos, copiar datos de un Excel a otro, enviar reportes), probablemente se puede automatizar con Python.

```python
from pathlib import Path

# Organiza los archivos de Descargas en carpetas por extensión
descargas = Path.home() / "Downloads"
for archivo in descargas.iterdir():
    if archivo.is_file():
        destino = descargas / (archivo.suffix[1:].lower() or "otros")
        destino.mkdir(exist_ok=True)
        archivo.rename(destino / archivo.name)
```

### Consumir APIs

Muchos servicios (clima, mapas, pagos, modelos de IA) ofrecen **APIs**. Con la biblioteca `requests`:

```python
import os
import requests

respuesta = requests.get(
    "https://api.ejemplo.com/v1/datos",
    headers={"Authorization": f"Bearer {os.environ['MI_API_KEY']}"},
    timeout=10,
)
respuesta.raise_for_status()
datos = respuesta.json()
```

Guarda las claves en **variables de entorno**, nunca dentro del código.

### ¿Qué es el aprendizaje automático (machine learning)?

En la programación tradicional escribes las reglas. En **machine learning** le das al computador **ejemplos** y él encuentra las reglas.

- **Aprendizaje supervisado:** ejemplos con respuesta conocida. *Correos marcados como spam o no spam* → el modelo aprende a clasificar correos nuevos.
- **No supervisado:** encontrar grupos en datos sin etiquetas (segmentar clientes).

```python
from sklearn.linear_model import LinearRegression

# metros cuadrados → precio (en millones)
X = [[40], [60], [80], [100]]
y = [150, 220, 290, 360]

modelo = LinearRegression().fit(X, y)
print(modelo.predict([[70]]))   # ≈ 255
```

Un modelo puede equivocarse: se mide con datos que **no vio** durante el entrenamiento.

### Modelos de lenguaje (LLM)

Los asistentes como Claude o ChatGPT son modelos de lenguaje: predicen texto a partir de enormes cantidades de ejemplos. Son muy útiles para explicar, resumir o generar código, pero **pueden equivocarse con total seguridad**. Revisa siempre lo que producen, sobre todo código, datos y citas.

### Ética de la IA

- **Sesgos:** si los datos de entrenamiento tienen prejuicios, el modelo los repite.
- **Privacidad:** no envíes datos personales o confidenciales a servicios externos sin autorización.
- **Transparencia:** las personas tienen derecho a saber cuándo una decisión importante la tomó o apoyó un sistema automático.
- **Responsabilidad:** detrás de cada sistema hay personas que responden por él.

> 💡 **Idea clave:** antes de entrenar modelos, domina Python, datos y estadística básica. La mayoría del trabajo real en IA es preparar buenos datos y evaluar bien los resultados.
