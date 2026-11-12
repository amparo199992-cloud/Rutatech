<!-- @lesson pensamiento-1 -->
## Pensar como programador

Antes de escribir código hay que **pensar la solución**. El pensamiento algorítmico es la habilidad de convertir un problema en pasos claros y ordenados que una máquina pueda seguir.

### Un algoritmo es una receta precisa

Un **algoritmo** es una secuencia finita de pasos que resuelve un problema. Debe ser:

- **Preciso:** cada paso tiene un solo significado.
- **Finito:** termina en algún momento.
- **Con entradas y salidas definidas.**

"Haz un buen café" no es un algoritmo. "Hierve 250 ml de agua, agrega 15 g de café molido, espera 4 minutos y cuela" sí lo es.

### Las cuatro herramientas del pensamiento computacional

1. **Descomposición:** dividir un problema grande en partes pequeñas. *Organizar una fiesta* → invitados, comida, música, lugar.
2. **Reconocimiento de patrones:** detectar lo que se repite. Si calculas el IVA de diez productos, es la misma operación diez veces → un bucle.
3. **Abstracción:** quedarte con lo importante e ignorar el resto. Para calcular una ruta no importa el color de las casas.
4. **Diseño del algoritmo:** escribir los pasos.

### Pseudocódigo

Es escribir el algoritmo en lenguaje humano estructurado, sin preocuparte por la sintaxis:

```text
ALGORITMO encontrar el mayor de una lista
  mayor ← primer elemento de la lista
  PARA CADA número EN la lista:
      SI número > mayor ENTONCES
          mayor ← número
  DEVOLVER mayor
```

Luego traducirlo a Python es casi directo:

```python
def mayor(lista):
    resultado = lista[0]
    for numero in lista:
        if numero > resultado:
            resultado = numero
    return resultado
```

### Método para resolver cualquier ejercicio

1. **Entiende** el problema: ¿cuáles son las entradas? ¿cuál es la salida esperada?
2. **Haz ejemplos a mano**, incluidos casos extremos (lista vacía, un solo elemento, números negativos).
3. **Escribe pseudocódigo.**
4. **Programa** paso a paso y prueba con tus ejemplos.
5. **Mejora:** ¿se puede simplificar?

> 💡 **Idea clave:** si no puedes resolver el problema con lápiz y papel, todavía no estás listo para programarlo. El código es solo la última traducción.

<!-- @lesson algoritmos-1 -->
## Buscar y ordenar

Dos de los problemas más comunes en computación son **buscar** un elemento y **ordenar** una colección.

### Búsqueda lineal

Revisa los elementos uno por uno hasta encontrar el buscado:

```python
def busqueda_lineal(lista, objetivo):
    for i, valor in enumerate(lista):
        if valor == objetivo:
            return i       # posición encontrada
    return -1              # no está
```

Funciona con cualquier lista, pero en el peor caso revisa **todos** los elementos.

### Búsqueda binaria

Si la lista está **ordenada**, puedes hacer algo mucho más rápido, como buscar una palabra en un diccionario de papel: abres por la mitad y descartas la mitad que no sirve.

```python
def busqueda_binaria(lista, objetivo):
    inicio, fin = 0, len(lista) - 1
    while inicio <= fin:
        medio = (inicio + fin) // 2
        if lista[medio] == objetivo:
            return medio
        elif lista[medio] < objetivo:
            inicio = medio + 1   # descarta la mitad izquierda
        else:
            fin = medio - 1      # descarta la mitad derecha
    return -1
```

Con un millón de elementos, la búsqueda lineal puede necesitar un millón de comparaciones; la binaria, unas **20**.

### Ordenamiento por burbuja (bubble sort)

Compara pares vecinos y los intercambia si están en desorden. Los valores grandes "suben" como burbujas:

```python
def burbuja(lista):
    datos = lista[:]                     # copia para no modificar la original
    n = len(datos)
    for i in range(n):
        for j in range(n - 1 - i):
            if datos[j] > datos[j + 1]:
                datos[j], datos[j + 1] = datos[j + 1], datos[j]
    return datos
```

Es fácil de entender pero lento con muchos datos. Existen algoritmos más eficientes, como **merge sort** o **quick sort**. En la práctica usas `sorted()`, que en Python implementa un algoritmo muy optimizado llamado Timsort.

> 💡 **Idea clave:** el mismo problema puede tener soluciones muy distintas en velocidad. Elegir el algoritmo correcto importa más que tener un computador rápido.

<!-- @lesson algoritmos-2 -->
## Complejidad: ¿qué tan rápido crece?

La **complejidad** describe cómo aumenta el trabajo de un algoritmo cuando crecen los datos. Se expresa con la **notación Big O**, que se fija en el peor caso y en la tendencia, no en los segundos exactos.

| Notación | Nombre | Ejemplo | Con 1.000 datos |
|---|---|---|---|
| **O(1)** | Constante | Acceder a `lista[5]` o a un diccionario por clave | 1 paso |
| **O(log n)** | Logarítmica | Búsqueda binaria | ~10 pasos |
| **O(n)** | Lineal | Recorrer una lista una vez | 1.000 pasos |
| **O(n log n)** | Lineal-logarítmica | Buenos algoritmos de ordenamiento (`sorted`) | ~10.000 pasos |
| **O(n²)** | Cuadrática | Dos bucles anidados (burbuja) | 1.000.000 pasos |

### Cómo estimarla mirando el código

```python
# O(n): un bucle sobre los datos
for x in datos:
    print(x)

# O(n²): un bucle dentro de otro
for a in datos:
    for b in datos:
        print(a, b)

# O(1): no depende del tamaño
primero = datos[0]
```

Reglas prácticas:

- Se ignoran las constantes: recorrer la lista dos veces sigue siendo **O(n)**.
- Manda el término más grande: O(n² + n) se simplifica a **O(n²)**.

### Ejemplo: ¿hay repetidos?

```python
# Versión O(n²): compara todos con todos
def tiene_repetidos_lento(lista):
    for i in range(len(lista)):
        for j in range(i + 1, len(lista)):
            if lista[i] == lista[j]:
                return True
    return False

# Versión O(n): usa un conjunto
def tiene_repetidos(lista):
    vistos = set()
    for x in lista:
        if x in vistos:      # buscar en un set es O(1) en promedio
            return True
        vistos.add(x)
    return False
```

Con 100.000 elementos la primera puede tardar minutos; la segunda, milisegundos.

> 💡 **Idea clave:** cuando veas bucles anidados sobre los mismos datos, pregúntate si un diccionario o un conjunto pueden evitarlos.

<!-- @lesson estructuras-1 -->
## Arreglos, listas, pilas y colas

Una **estructura de datos** es una forma de organizar información para usarla de manera eficiente. Elegir la correcta hace tu programa más simple y rápido.

### Arreglos y listas

Un **arreglo** guarda elementos en posiciones contiguas de memoria, por eso acceder a cualquier posición por índice es O(1). Las listas de Python funcionan como arreglos dinámicos que crecen solos.

- Acceder a `lista[i]`: **O(1)**.
- Agregar al final (`append`): **O(1)** en promedio.
- Insertar o borrar al inicio: **O(n)**, porque hay que correr todos los demás elementos.

### Listas enlazadas

Cada elemento (**nodo**) guarda su valor y una referencia al siguiente, como los vagones de un tren. Insertar al inicio es O(1), pero llegar al elemento número 500 obliga a recorrer los anteriores: O(n).

### Pila (stack): el último en entrar es el primero en salir (LIFO)

Como una pila de platos: pones y quitas por arriba.

```python
pila = []
pila.append("página 1")   # push
pila.append("página 2")
pila.append("página 3")
print(pila.pop())          # pop → "página 3"
```

Se usa en el botón **Atrás** del navegador, el **Deshacer** de los editores y para controlar las llamadas a funciones.

### Cola (queue): el primero en entrar es el primero en salir (FIFO)

Como la fila de un banco. En Python usa `deque`, que saca del inicio en O(1):

```python
from collections import deque

cola = deque()
cola.append("cliente 1")    # entra a la fila
cola.append("cliente 2")
print(cola.popleft())       # sale "cliente 1"
```

Se usa en colas de impresión, atención de solicitudes en servidores y recorridos de grafos.

### ¿Cuál elegir?

| Necesitas… | Usa |
|---|---|
| Acceder por posición | Lista / arreglo |
| Deshacer, volver atrás | Pila |
| Atender en orden de llegada | Cola |

<!-- @lesson estructuras-2 -->
## Tablas hash y árboles

### Tablas hash: búsqueda casi instantánea

Una **tabla hash** guarda pares clave → valor. Una **función hash** convierte la clave en un número que indica en qué "casillero" guardar el dato. Así, buscar por clave no requiere recorrer todo: es **O(1)** en promedio.

En Python, los **diccionarios** y los **conjuntos** son tablas hash:

```python
inventario = {"manzana": 50, "pera": 20}
print(inventario["pera"])   # se encuentra directo, sin recorrer
```

Cuando dos claves caen en el mismo casillero ocurre una **colisión**; la tabla la resuelve internamente. Por eso las claves de un diccionario deben ser **inmutables** (texto, números, tuplas): si cambiaran, su hash cambiaría.

### Árboles: datos jerárquicos

Un **árbol** organiza datos en niveles: un nodo **raíz** arriba y nodos **hijos** debajo. Ya conoces varios:

- El sistema de **carpetas** de tu computador.
- El **DOM** de una página web (HTML dentro de HTML).
- Un organigrama.

```text
          documentos/
         /          \
    trabajo/      personal/
    /     \           |
 cv.pdf  ppt/      fotos/
```

### Árbol binario de búsqueda (BST)

Cada nodo tiene máximo dos hijos y cumple una regla: **a la izquierda los menores, a la derecha los mayores**. Buscar se parece a la búsqueda binaria: en cada nodo descartas la mitad.

```python
class Nodo:
    def __init__(self, valor):
        self.valor = valor
        self.izq = None
        self.der = None

def insertar(raiz, valor):
    if raiz is None:
        return Nodo(valor)
    if valor < raiz.valor:
        raiz.izq = insertar(raiz.izq, valor)
    else:
        raiz.der = insertar(raiz.der, valor)
    return raiz

def buscar(raiz, valor):
    if raiz is None:
        return False
    if valor == raiz.valor:
        return True
    if valor < raiz.valor:
        return buscar(raiz.izq, valor)
    return buscar(raiz.der, valor)
```

Si el árbol está balanceado, buscar es **O(log n)**. Las bases de datos usan variantes de árboles (como los *B-trees*) para sus índices.

> 💡 **Idea clave:** `class` define un nuevo tipo de objeto. No te preocupes si aún no dominas las clases; aquí lo importante es la idea de nodos conectados.

<!-- @lesson recursion-1 -->
## Recursión: funciones que se llaman a sí mismas

Una función **recursiva** resuelve un problema llamándose a sí misma con una versión más pequeña del mismo problema. Es como las muñecas rusas: abres una y dentro hay otra igual, pero más pequeña, hasta llegar a la última.

### Las dos partes obligatorias

1. **Caso base:** la situación más simple, que se responde sin volver a llamar a la función. Sin él, la recursión nunca termina.
2. **Caso recursivo:** la función se llama con un problema **más pequeño**, que se acerca al caso base.

### Ejemplo: factorial

El factorial de 5 (5!) es 5 × 4 × 3 × 2 × 1 = 120. Observa que 5! = 5 × 4!

```python
def factorial(n):
    if n <= 1:                  # caso base
        return 1
    return n * factorial(n - 1) # caso recursivo
```

Cómo se ejecuta `factorial(4)`:

```text
factorial(4) = 4 * factorial(3)
                   factorial(3) = 3 * factorial(2)
                                      factorial(2) = 2 * factorial(1)
                                                         factorial(1) = 1   ← caso base
             = 4 * 3 * 2 * 1 = 24
```

Cada llamada queda "en espera" en la **pila de llamadas** (¡la estructura que viste en el módulo anterior!) hasta que la de abajo responde.

### Ejemplo: sumar una lista

```python
def suma(lista):
    if not lista:               # lista vacía
        return 0
    return lista[0] + suma(lista[1:])
```

### Cuidado

- Si olvidas el caso base o el problema no se reduce, verás `RecursionError: maximum recursion depth exceeded`.
- Python limita la profundidad (unas 1.000 llamadas por defecto), así que para recorrer muchos datos suele ser mejor un bucle.

### ¿Cuándo usarla?

La recursión brilla con estructuras que **se contienen a sí mismas**: árboles, carpetas dentro de carpetas, menús con submenús, o problemas de "divide y vencerás" como merge sort.

> 💡 **Idea clave:** para escribir una función recursiva, confía en que la llamada interna ya funciona y pregúntate solo: "¿cómo uso la respuesta del problema más pequeño para resolver el mío?".

<!-- @lesson memoria-1 -->
## Memoria, referencias y depuración

### Las variables son etiquetas

En Python, una variable no "contiene" el valor: es una **etiqueta que apunta** a un objeto en memoria. Esto produce sorpresas con los objetos modificables, como las listas:

```python
a = [1, 2, 3]
b = a          # b apunta a la MISMA lista
b.append(4)
print(a)       # [1, 2, 3, 4]  ¡a también cambió!
```

Para tener una lista independiente, haz una **copia**:

```python
b = a.copy()   # o a[:]
```

Puedes comprobar si dos variables apuntan al mismo objeto con `is` (o viendo `id(a)` e `id(b)`). Usa `==` para comparar valores e `is` para comparar identidad (lo típico: `if x is None`).

### Mutables e inmutables

- **Inmutables:** `int`, `float`, `str`, `tuple`, `bool`. "Modificarlos" en realidad crea un objeto nuevo.
- **Mutables:** `list`, `dict`, `set`. Se modifican en el lugar.

Por eso, si una función recibe una lista y la modifica, el cambio se ve fuera de la función.

### Memoria automática

Python libera la memoria de los objetos que ya nadie usa (**recolector de basura**). En lenguajes como **C** eso lo haces tú a mano, como verás en el siguiente módulo.

### Depurar: encontrar el error con método

**Depurar** (*debugging*) es encontrar y corregir errores. Un buen proceso:

1. **Reproduce** el error de forma consistente.
2. **Lee** el mensaje completo (archivo, línea, tipo de error).
3. **Formula una hipótesis**: "creo que `total` vale 0 aquí".
4. **Compruébala** con `print()` o con el depurador.
5. **Corrige** y vuelve a probar, incluidos otros casos.

### El depurador de VS Code

1. Haz clic a la izquierda del número de línea para poner un **punto de interrupción** (punto rojo).
2. Presiona `F5` y elige *Python File*.
3. El programa se detiene en esa línea y puedes ver el valor de cada variable.
4. Avanza paso a paso con `F10` (siguiente línea) o `F11` (entrar a la función).

### El método del patito de goma

Explica tu código línea por línea en voz alta, a otra persona o a un patito de goma. Muy a menudo descubres el error mientras lo explicas.

> 💡 **Idea clave:** los errores más difíciles no muestran mensajes: el programa corre, pero da un resultado incorrecto. Para esos, el depurador y los `print()` estratégicos son tus mejores amigos.

<!-- @lesson c-1 -->
## Tu primer programa en C

**C** es un lenguaje creado en los años 70 que sigue siendo la base de sistemas operativos, bases de datos y dispositivos embebidos. Aprenderlo, aunque sea lo básico, te muestra lo que Python hace por ti "detrás de escena".

### Hola, mundo en C

```c
#include <stdio.h>

int main(void)
{
    printf("Hola, mundo\n");
    return 0;
}
```

- `#include <stdio.h>` trae la biblioteca de entrada/salida (donde está `printf`).
- `main` es la función donde empieza el programa.
- Cada instrucción termina en `;` y los bloques van entre `{ }`.
- `\n` es un salto de línea: `printf` no lo agrega solo.

### C se compila

Python se **interpreta** (se lee y ejecuta línea por línea). C se **compila**: un programa llamado compilador traduce tu código a lenguaje de máquina y genera un ejecutable.

```bash
gcc hola.c -o hola     # compila
./hola                 # ejecuta (en Windows: hola.exe)
```

La forma más fácil de practicar sin instalar nada es el entorno en línea de **CS50** (cs50.dev), que ya trae el compilador.

### Tipos explícitos

En C debes declarar el tipo de cada variable y no puede cambiar:

```c
int edad = 25;
float precio = 19.99;
char inicial = 'A';

printf("Edad: %i, precio: %.2f, inicial: %c\n", edad, precio, inicial);
```

Los `%i`, `%f` y `%c` son marcadores que `printf` reemplaza por los valores.

### Condicionales y bucles

```c
for (int i = 1; i <= 3; i++)
{
    if (i % 2 == 0)
    {
        printf("%i es par\n", i);
    }
    else
    {
        printf("%i es impar\n", i);
    }
}
```

### Python vs. C

| | Python | C |
|---|---|---|
| Ejecución | Interpretado | Compilado |
| Tipos | Dinámicos | Declarados y fijos |
| Memoria | Automática | Manual (`malloc` / `free`) |
| Velocidad | Buena | Muy alta |
| Bloques | Indentación | Llaves `{ }` |

> 💡 **Idea clave:** no necesitas dominar C para seguir la ruta. El objetivo es entender que la memoria, los tipos y la compilación existen aunque Python te los oculte.

<!-- @lesson sql-1 -->
## Bases de datos relacionales y SQL

Guardar datos en archivos sirve al comienzo, pero cuando hay miles de registros, varios usuarios a la vez y relaciones entre datos, necesitas una **base de datos**.

### Bases de datos relacionales

Organizan la información en **tablas**, como hojas de cálculo con reglas estrictas:

- Cada **fila** es un registro (un estudiante).
- Cada **columna** es un atributo con un tipo definido (nombre: texto, edad: entero).
- Cada tabla tiene una **clave primaria** (`id`) que identifica cada fila de forma única.
- Las tablas se conectan mediante **claves foráneas**.

```text
estudiantes                       cursos
┌────┬─────────┬──────┐           ┌────┬─────────┐
│ id │ nombre  │ edad │           │ id │ nombre  │
├────┼─────────┼──────┤           ├────┼─────────┤
│ 1  │ Sofía   │ 21   │           │ 1  │ Python  │
│ 2  │ Mateo   │ 25   │           │ 2  │ SQL     │
└────┴─────────┴──────┘           └────┴─────────┘
```

Sistemas populares: **SQLite** (un solo archivo, ideal para aprender), **PostgreSQL** y **MySQL** (servidores para aplicaciones reales).

### SQL: el lenguaje de las bases de datos

**SQL** (*Structured Query Language*) permite crear tablas y consultar datos. Se escribe casi como una frase en inglés:

```sql
CREATE TABLE estudiantes (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    edad INTEGER
);

INSERT INTO estudiantes (nombre, edad) VALUES ('Sofía', 21);
INSERT INTO estudiantes (nombre, edad) VALUES ('Mateo', 25);

SELECT nombre, edad FROM estudiantes WHERE edad > 22;
```

Resultado: `Mateo | 25`.

### Consultas útiles

```sql
SELECT * FROM estudiantes;                       -- todas las columnas
SELECT * FROM estudiantes ORDER BY edad DESC;    -- ordenar
SELECT COUNT(*) FROM estudiantes;                -- contar filas
SELECT AVG(edad) FROM estudiantes;               -- promedio
```

### SQLite desde Python

Python incluye el módulo `sqlite3`, sin instalar nada:

```python
import sqlite3

conexion = sqlite3.connect("escuela.db")
cursor = conexion.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS estudiantes (id INTEGER PRIMARY KEY, nombre TEXT, edad INTEGER)")
cursor.execute("INSERT INTO estudiantes (nombre, edad) VALUES (?, ?)", ("Sofía", 21))
conexion.commit()

for fila in cursor.execute("SELECT nombre, edad FROM estudiantes"):
    print(fila)
conexion.close()
```

⚠️ Usa siempre los signos `?` para pasar valores. **Nunca** armes la consulta pegando texto del usuario (`"... WHERE nombre = '" + nombre + "'"`): eso abre la puerta a la **inyección SQL**, uno de los ataques más comunes.

> 💡 **Idea clave:** en la etapa 4 profundizarás en SQL: actualizar, borrar, unir tablas con JOIN y diseñar bases de datos.
