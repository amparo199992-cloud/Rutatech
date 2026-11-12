<!-- @lesson py-instalacion-1 -->
## Prepara tu taller: Python y VS Code

**Python** es un lenguaje de programación conocido por ser legible y versátil: se usa en análisis de datos, automatización, inteligencia artificial, desarrollo web y ciberseguridad. Es ideal para empezar.

### 1. Instala Python

1. Entra a **python.org/downloads** y descarga la versión estable más reciente (Python 3).
2. **Windows:** en el instalador marca la casilla **"Add python.exe to PATH"** antes de presionar *Install Now*. Si la olvidas, la terminal no encontrará Python.
3. **macOS:** usa el instalador de python.org. **Linux:** casi siempre ya viene instalado.

Comprueba la instalación en la terminal:

```bash
python --version     # en macOS/Linux puede ser: python3 --version
```

Deberías ver algo como `Python 3.13.x`.

### 2. Instala Visual Studio Code

**VS Code** es un editor de código gratuito. Descárgalo de **code.visualstudio.com**, ábrelo y en la barra lateral de **Extensiones** instala **Python** (de Microsoft). Te dará colores, autocompletado y un botón para ejecutar.

### 3. Tu primer programa

1. Crea una carpeta `python-ruta` y ábrela en VS Code (*Archivo → Abrir carpeta*).
2. Crea el archivo `hola.py` con este contenido:

```python
print("¡Hola, mundo!")
print("Estoy aprendiendo Python en RutaTech")
```

3. Ejecútalo desde la terminal integrada de VS Code (`Ctrl + ñ` o *Terminal → Nueva terminal*):

```bash
python hola.py
```

### El intérprete interactivo

Si escribes solo `python` en la terminal, entras al **modo interactivo** (`>>>`), donde cada línea se ejecuta al instante. Es perfecto para probar ideas. Para salir escribe `exit()`.

```python
>>> 2 + 3
5
>>> "hola" * 3
'holaholahola'
```

> 💡 **Idea clave:** `print()` es una **función**: un comando con nombre al que le pasas datos entre paréntesis. Vas a crear tus propias funciones más adelante.

<!-- @lesson py-variables-1 -->
## Variables y tipos de datos

Una **variable** es un nombre que apunta a un valor, como una etiqueta pegada a una caja.

```python
nombre = "Laura"
edad = 27
altura = 1.65
estudia = True
```

El signo `=` significa **asignar** (guardar), no "es igual a". Puedes cambiar el valor cuando quieras: `edad = 28`.

### Tipos de datos básicos

| Tipo | Nombre en Python | Ejemplo |
|---|---|---|
| Texto | `str` | `"Hola"`, `'Bogotá'` |
| Entero | `int` | `42`, `-7` |
| Decimal | `float` | `3.14`, `0.5` |
| Booleano | `bool` | `True`, `False` |
| Nada | `NoneType` | `None` |

Puedes preguntar el tipo con `type()`:

```python
print(type(edad))     # <class 'int'>
print(type(nombre))   # <class 'str'>
```

### Reglas para nombrar variables

- Letras, números y guion bajo; **no** pueden empezar por número.
- Python distingue mayúsculas: `Edad` y `edad` son distintas.
- Usa nombres descriptivos en **snake_case**: `precio_total`, no `pt` ni `PrecioTotal`.

### Texto con variables: f-strings

```python
nombre = "Laura"
edad = 27
print(f"Me llamo {nombre} y tengo {edad} años")
```

La `f` antes de las comillas permite insertar variables entre llaves.

### Pedir datos al usuario

```python
nombre = input("¿Cómo te llamas? ")
print(f"Bienvenida, {nombre}")
```

⚠️ `input()` **siempre devuelve texto**. Si necesitas un número, conviértelo:

```python
edad = int(input("¿Cuántos años tienes? "))
print(edad + 1)
```

Las conversiones más usadas son `int()`, `float()` y `str()`.

<!-- @lesson py-variables-2 -->
## Operadores: hacer cuentas y comparar

### Aritméticos

```python
print(7 + 2)    # 9   suma
print(7 - 2)    # 5   resta
print(7 * 2)    # 14  multiplicación
print(7 / 2)    # 3.5 división (siempre da float)
print(7 // 2)   # 3   división entera
print(7 % 2)    # 1   residuo (módulo)
print(7 ** 2)   # 49  potencia
```

El operador `%` es muy útil: `numero % 2 == 0` te dice si un número es par.

Python respeta el orden de las operaciones: primero `**`, luego `*` `/` `//` `%`, y al final `+` `-`. Usa paréntesis para dejarlo claro: `(2 + 3) * 4`.

### Con texto

```python
saludo = "Hola" + " " + "mundo"   # concatenar
linea = "-" * 20                  # repetir
```

No puedes sumar texto y número directamente: `"Edad: " + 27` da error. Usa una f-string o `str(27)`.

### Asignación abreviada

```python
puntos = 10
puntos += 5    # igual que puntos = puntos + 5 → 15
puntos *= 2    # 30
```

### Comparación (devuelven True o False)

| Operador | Significa |
|---|---|
| `==` | igual a |
| `!=` | distinto de |
| `>` `<` | mayor / menor que |
| `>=` `<=` | mayor o igual / menor o igual |

### Lógicos

- `and`: verdadero si **ambas** condiciones lo son.
- `or`: verdadero si **al menos una** lo es.
- `not`: invierte el valor.

```python
edad = 20
tiene_documento = True
print(edad >= 18 and tiene_documento)   # True
```

> 💡 **Idea clave:** no confundas `=` (guardar un valor) con `==` (comparar dos valores). Es el error más común al empezar.

<!-- @lesson py-condicionales-1 -->
## Tomar decisiones con if, elif y else

Los programas necesitan decidir: "si pasa esto, haz aquello". Para eso existen los **condicionales**.

```python
temperatura = 30

if temperatura > 28:
    print("Hace calor, lleva agua")
elif temperatura > 18:
    print("Clima agradable")
else:
    print("Lleva chaqueta")
```

### Cómo se lee

1. Python evalúa la condición del `if`. Si es `True`, ejecuta su bloque y **se salta el resto**.
2. Si es `False`, prueba cada `elif` en orden.
3. Si ninguna se cumple, ejecuta el `else` (que es opcional).

### La indentación importa

En Python, los **espacios al inicio de la línea** indican qué código pertenece a cada bloque. Usa 4 espacios (VS Code lo hace solo al presionar Tab). Si la indentación está mal, verás un `IndentationError`.

```python
if True:
    print("dentro del if")
print("fuera del if: siempre se ejecuta")
```

### Combinar condiciones

```python
edad = 16
con_permiso = True

if edad >= 18 or con_permiso:
    print("Puede entrar")
```

### Ejemplo práctico: clasificar notas

```python
nota = float(input("Nota (0 a 5): "))

if nota < 0 or nota > 5:
    print("Nota inválida")
elif nota >= 4.5:
    print("Excelente")
elif nota >= 3.0:
    print("Aprobado")
else:
    print("Reprobado")
```

Fíjate en el orden: se revisan primero los casos más exigentes. Si pusieras `nota >= 3.0` antes que `nota >= 4.5`, un 4.8 diría "Aprobado".

> 💡 **Idea clave:** cualquier valor puede usarse como condición. Se consideran falsos `0`, `""` (texto vacío), `[]` (lista vacía) y `None`; casi todo lo demás es verdadero.

<!-- @lesson py-bucles-1 -->
## Repetir con for y range

Un **bucle** repite instrucciones. El bucle `for` recorre los elementos de una secuencia, uno por uno.

```python
frutas = ["mango", "lulo", "guayaba"]
for fruta in frutas:
    print(f"Me gusta el {fruta}")
```

También recorre texto, letra por letra:

```python
for letra in "Hola":
    print(letra)
```

### range(): contar

`range()` genera una secuencia de números:

```python
for i in range(5):        # 0, 1, 2, 3, 4  (el 5 NO se incluye)
    print(i)

for i in range(1, 6):     # 1, 2, 3, 4, 5
    print(i)

for i in range(0, 11, 2): # 0, 2, 4, 6, 8, 10  (de 2 en 2)
    print(i)
```

### Acumular resultados

Un patrón muy común es usar una variable **acumuladora**:

```python
total = 0
for numero in range(1, 11):
    total += numero
print(total)   # 55
```

### Tabla de multiplicar

```python
n = 7
for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")
```

### break y continue

- `break` **sale** del bucle inmediatamente.
- `continue` **salta** a la siguiente vuelta.

```python
for numero in range(1, 10):
    if numero % 2 == 0:
        continue          # ignora los pares
    if numero > 7:
        break             # se detiene al pasar de 7
    print(numero)         # 1, 3, 5, 7
```

> 💡 **Idea clave:** usa `for` cuando sabes sobre qué vas a iterar (una lista, un rango, un texto).

<!-- @lesson py-bucles-2 -->
## Repetir mientras se cumpla una condición: while

El bucle `while` repite **mientras** una condición sea verdadera. Es útil cuando no sabes cuántas vueltas habrá.

```python
contador = 3
while contador > 0:
    print(contador)
    contador -= 1
print("¡Despegue!")
```

### Cuidado con los bucles infinitos

Si la condición nunca se vuelve falsa, el programa no termina:

```python
x = 1
while x > 0:
    print(x)     # ¡olvidamos cambiar x! Se repite para siempre
```

Si te pasa, detenlo con `Ctrl + C`. Asegúrate siempre de que algo dentro del bucle **acerque la condición a False**.

### Validar datos del usuario

Un uso clásico: repetir hasta recibir una respuesta válida.

```python
clave = ""
while clave != "python123":
    clave = input("Contraseña: ")
print("Acceso concedido")
```

### Menú interactivo con while True

```python
while True:
    opcion = input("1) Saludar  2) Salir: ")
    if opcion == "1":
        print("¡Hola!")
    elif opcion == "2":
        print("Hasta pronto")
        break
    else:
        print("Opción no válida")
```

`while True` crea un bucle que solo termina con `break`. Es la base de muchos programas de consola, como el gestor de tareas que construirás en el proyecto.

### ¿for o while?

| Usa `for` cuando… | Usa `while` cuando… |
|---|---|
| Recorres una colección o un rango conocido | Repites hasta que ocurra algo |
| Sabes cuántas vueltas habrá | El número de vueltas depende del usuario o de datos |

<!-- @lesson py-funciones-1 -->
## Funciones: empaqueta y reutiliza

Una **función** es un bloque de código con nombre que realiza una tarea. La defines una vez y la usas muchas veces.

```python
def saludar(nombre):
    print(f"¡Hola, {nombre}!")

saludar("Andrés")
saludar("Valentina")
```

- `def` define la función.
- `nombre` es un **parámetro**: una variable que recibe el dato.
- `"Andrés"` es el **argumento**: el valor que le pasas al llamarla.

### return: devolver un resultado

`print` muestra algo en pantalla; `return` **entrega** un valor para que lo uses después.

```python
def area_rectangulo(base, altura):
    return base * altura

area = area_rectangulo(4, 3)
print(area * 2)   # 24
```

Cuando Python llega a `return`, la función termina. Si no hay `return`, la función devuelve `None`.

### Parámetros con valor por defecto

```python
def precio_final(precio, iva=0.19):
    return precio * (1 + iva)

print(precio_final(100))        # 119.0  (usa 19 %)
print(precio_final(100, 0.05))  # 105.0
```

### Alcance (scope)

Las variables creadas dentro de una función solo existen dentro de ella:

```python
def calcular():
    resultado = 10
    return resultado

calcular()
print(resultado)   # NameError: resultado no existe aquí
```

### Documenta tus funciones

```python
def es_par(numero):
    """Devuelve True si el número es par."""
    return numero % 2 == 0
```

El texto entre triples comillas (*docstring*) explica qué hace la función.

> 💡 **Idea clave:** si copias y pegas el mismo código más de dos veces, probablemente debería ser una función. Una buena función hace **una sola cosa** y tiene un nombre que lo dice.

<!-- @lesson py-colecciones-1 -->
## Listas y tuplas

### Listas: colecciones ordenadas y modificables

```python
tareas = ["estudiar", "hacer ejercicio", "leer"]
```

Cada elemento tiene una posición (**índice**) que **empieza en 0**:

```python
print(tareas[0])    # estudiar
print(tareas[-1])   # leer (el último)
print(len(tareas))  # 3
```

### Modificar listas

```python
tareas.append("cocinar")       # agrega al final
tareas.insert(0, "despertar")  # agrega en una posición
tareas.remove("leer")          # quita por valor
ultima = tareas.pop()          # quita y devuelve el último
tareas[1] = "estudiar Python"  # reemplaza
```

### Rebanadas (slicing)

```python
numeros = [10, 20, 30, 40, 50]
print(numeros[1:3])   # [20, 30]  (del índice 1 al 2)
print(numeros[:2])    # [10, 20]
print(numeros[::-1])  # [50, 40, 30, 20, 10] invertida
```

### Operaciones útiles

```python
notas = [3.5, 4.2, 2.8, 4.9]
print(sum(notas) / len(notas))  # promedio
print(max(notas), min(notas))   # 4.9 2.8
print(sorted(notas))            # copia ordenada
print(4.2 in notas)             # True
```

### Comprensión de listas

Una forma corta de crear listas a partir de otras:

```python
cuadrados = [n ** 2 for n in range(1, 6)]   # [1, 4, 9, 16, 25]
aprobadas = [n for n in notas if n >= 3.0]  # [3.5, 4.2, 4.9]
```

### Tuplas: como listas, pero inmutables

```python
coordenadas = (4.6, -74.08)
print(coordenadas[0])
```

Una tupla no se puede modificar después de crearla. Úsala para datos que no deben cambiar (coordenadas, colores RGB, fechas). También permite "desempacar":

```python
lat, lon = coordenadas
```

<!-- @lesson py-colecciones-2 -->
## Diccionarios y conjuntos

### Diccionarios: pares clave → valor

Como una ficha con campos:

```python
estudiante = {
    "nombre": "Camila",
    "edad": 22,
    "ciudad": "Medellín",
}
print(estudiante["nombre"])      # Camila
estudiante["edad"] = 23          # modificar
estudiante["carrera"] = "Diseño" # agregar
del estudiante["ciudad"]         # eliminar
```

Si pides una clave que no existe con `[]`, obtienes un `KeyError`. Usa `.get()` para tener un valor por defecto:

```python
print(estudiante.get("telefono", "sin teléfono"))
```

### Recorrer diccionarios

```python
precios = {"pan": 2500, "leche": 4800, "huevos": 12000}

for producto, precio in precios.items():
    print(f"{producto}: ${precio:,}")
```

También existen `.keys()` (solo claves) y `.values()` (solo valores).

### Contar con diccionarios

Un patrón muy usado:

```python
texto = "la casa la vi"
conteo = {}
for palabra in texto.split():
    conteo[palabra] = conteo.get(palabra, 0) + 1
print(conteo)   # {'la': 2, 'casa': 1, 'vi': 1}
```

### Listas de diccionarios

Así se representan casi todos los datos reales (por ejemplo, filas de una tabla):

```python
gastos = [
    {"concepto": "mercado", "valor": 150000},
    {"concepto": "transporte", "valor": 80000},
]
total = sum(g["valor"] for g in gastos)
```

### Conjuntos (set): sin repetidos

```python
colores = {"rojo", "azul", "rojo"}
print(colores)                 # {'rojo', 'azul'}
unicos = set([1, 2, 2, 3])     # {1, 2, 3}
```

Los conjuntos no tienen orden ni índices, pero son muy rápidos para preguntar si algo está (`in`) y permiten operaciones como unión (`|`) e intersección (`&`).

| Estructura | Ordenada | Modificable | Repetidos | Ejemplo de uso |
|---|---|---|---|---|
| Lista | Sí | Sí | Sí | Tareas pendientes |
| Tupla | Sí | No | Sí | Coordenadas |
| Diccionario | Sí (orden de inserción) | Sí | Claves únicas | Ficha de un usuario |
| Conjunto | No | Sí | No | Etiquetas únicas |

<!-- @lesson py-errores-1 -->
## Errores y cómo manejarlos

Los errores no son un fracaso: son mensajes que te dicen qué salió mal. Aprender a leerlos es una de las habilidades más valiosas.

### Leer un error (traceback)

```text
Traceback (most recent call last):
  File "calculadora.py", line 3, in <module>
    resultado = 10 / divisor
ZeroDivisionError: division by zero
```

Léelo **de abajo hacia arriba**: la última línea dice el **tipo** de error y el motivo; las anteriores indican el **archivo y la línea**.

### Errores comunes

| Error | Causa típica |
|---|---|
| `SyntaxError` | Falta un paréntesis, comillas o dos puntos |
| `IndentationError` | Espacios mal puestos |
| `NameError` | Usas una variable que no existe (¿error de tipeo?) |
| `TypeError` | Operación con tipos incompatibles: `"5" + 3` |
| `ValueError` | Valor inválido: `int("hola")` |
| `IndexError` | Índice fuera de rango en una lista |
| `KeyError` | Clave inexistente en un diccionario |
| `ZeroDivisionError` | División entre cero |

### try / except: atrapar errores esperados

```python
try:
    edad = int(input("Edad: "))
    print(f"El próximo año tendrás {edad + 1}")
except ValueError:
    print("Eso no es un número entero")
```

Si ocurre un `ValueError` dentro del `try`, Python salta al `except` en lugar de detener el programa.

### Varias excepciones, else y finally

```python
try:
    a = float(input("Dividendo: "))
    b = float(input("Divisor: "))
    resultado = a / b
except ValueError:
    print("Escribe números válidos")
except ZeroDivisionError:
    print("No se puede dividir entre cero")
else:
    print(f"Resultado: {resultado}")    # solo si no hubo error
finally:
    print("Fin del cálculo")            # siempre se ejecuta
```

### Lanzar tus propios errores

```python
def retirar(saldo, monto):
    if monto > saldo:
        raise ValueError("Saldo insuficiente")
    return saldo - monto
```

> 💡 **Idea clave:** atrapa solo los errores que sabes manejar. Un `except:` vacío que lo atrapa todo esconde problemas reales y hace más difícil encontrar fallos.

<!-- @lesson py-archivos-1 -->
## Leer y escribir archivos

Hasta ahora los datos de tus programas desaparecen al cerrarlos. Guardarlos en **archivos** los hace permanentes.

### Escribir un archivo de texto

```python
with open("notas.txt", "w", encoding="utf-8") as archivo:
    archivo.write("Primera línea\n")
    archivo.write("Segunda línea\n")
```

- `"w"` (*write*) crea el archivo o **lo sobrescribe** si ya existe.
- `"a"` (*append*) agrega al final sin borrar.
- `"r"` (*read*) lee (es el modo por defecto).
- `encoding="utf-8"` evita problemas con tildes y eñes.
- `with` cierra el archivo automáticamente, incluso si ocurre un error.

### Leer un archivo

```python
with open("notas.txt", encoding="utf-8") as archivo:
    for linea in archivo:
        print(linea.strip())    # strip() quita el salto de línea
```

También puedes leerlo completo con `archivo.read()`.

### Archivos CSV (tablas)

Los CSV son tablas en texto plano, separadas por comas. Excel y Google Sheets los abren.

```python
import csv

with open("gastos.csv", "w", newline="", encoding="utf-8") as f:
    escritor = csv.writer(f)
    escritor.writerow(["concepto", "valor"])
    escritor.writerow(["mercado", 150000])

with open("gastos.csv", encoding="utf-8") as f:
    for fila in csv.DictReader(f):
        print(fila["concepto"], int(fila["valor"]))
```

### Archivos JSON (datos estructurados)

JSON guarda listas y diccionarios. Es el formato que usan las APIs web.

```python
import json

tareas = [{"titulo": "Estudiar", "hecha": False}]

with open("tareas.json", "w", encoding="utf-8") as f:
    json.dump(tareas, f, ensure_ascii=False, indent=2)

with open("tareas.json", encoding="utf-8") as f:
    tareas = json.load(f)
```

### Rutas con pathlib

```python
from pathlib import Path

carpeta = Path("datos")
carpeta.mkdir(exist_ok=True)          # crea la carpeta si no existe
archivo = carpeta / "reporte.txt"     # une rutas en cualquier sistema
print(archivo.exists())
```

> 💡 **Idea clave:** si abres un archivo que no existe en modo lectura obtendrás `FileNotFoundError`. Revisa la ruta y la carpeta desde donde ejecutas el programa (¿recuerdas la lección de rutas?).

<!-- @lesson py-modulos-1 -->
## Módulos, paquetes y entornos virtuales

### Módulos: código reutilizable

Un **módulo** es un archivo `.py` con funciones que puedes importar. Python trae muchos incluidos (la **biblioteca estándar**):

```python
import random
import math
from datetime import date

print(random.randint(1, 6))   # dado aleatorio
print(math.sqrt(16))          # 4.0
print(date.today())           # fecha de hoy
```

### Tus propios módulos

Si tienes `utilidades.py`:

```python
# utilidades.py
def formatear_pesos(valor):
    return f"${valor:,.0f}"
```

Lo usas desde otro archivo de la misma carpeta:

```python
# main.py
from utilidades import formatear_pesos
print(formatear_pesos(1500000))   # $1,500,000
```

### `if __name__ == "__main__":`

Este bloque solo se ejecuta cuando corres el archivo directamente, no cuando lo importas. Úsalo para el código principal:

```python
def main():
    print("Programa principal")

if __name__ == "__main__":
    main()
```

### Paquetes externos con pip

Hay miles de paquetes creados por la comunidad en **PyPI** (pypi.org). Se instalan con `pip`:

```bash
pip install requests
```

### Entornos virtuales: una caja por proyecto

Si todos tus proyectos comparten paquetes, tarde o temprano chocarán versiones. Un **entorno virtual** es una instalación aislada para cada proyecto.

```bash
python -m venv .venv               # crea el entorno
# Activar:
source .venv/bin/activate          # macOS / Linux
.venv\Scripts\activate             # Windows (PowerShell)
pip install requests               # se instala SOLO en este proyecto
pip freeze > requirements.txt      # guarda la lista de dependencias
deactivate                         # salir del entorno
```

Quien descargue tu proyecto podrá instalar lo mismo con `pip install -r requirements.txt`.

Agrega `.venv/` a tu archivo `.gitignore`: el entorno no se sube a GitHub, solo el `requirements.txt`.

> 💡 **Idea clave:** si en Windows PowerShell no te deja activar el entorno por la política de ejecución, ejecuta una vez `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
