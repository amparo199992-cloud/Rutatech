import { challenge, choice, fill, output, q, res } from "./helpers.js";

const cs50 = res("CS50x de Harvard (curso completo y gratuito)", "https://cs50.harvard.edu/x/", "Inglés (subtítulos en español)");

export default {
  slug: "ciencias-computacion",
  order: 3,
  icon: "🧠",
  title: "Fundamentos de Ciencias de la Computación",
  subtitle: "Piensa como un ingeniero de software",
  duration: "8 a 10 semanas",
  description:
    "Aprende a diseñar algoritmos, medir su eficiencia, elegir estructuras de datos, usar recursión, depurar con método, dar tus primeros pasos en C y guardar datos en bases de datos relacionales con SQL.",
  modules: [
    {
      slug: "pensamiento-algoritmico",
      title: "Pensamiento algorítmico",
      description: "Descompón problemas, reconoce patrones y escribe pseudocódigo antes de programar.",
      duration: "1 semana",
      level: "principiante",
      objectives: ["Definir qué es un algoritmo.", "Aplicar descomposición, patrones y abstracción.", "Escribir pseudocódigo.", "Seguir un método para resolver ejercicios."],
      checklist: ["Escribí el pseudocódigo de un problema antes de programarlo", "Probé mi solución con casos extremos (lista vacía, un elemento)", "Puedo explicar qué es la descomposición con un ejemplo"],
      resources: [cs50, res("Khan Academy: Algoritmos", "https://es.khanacademy.org/computing/computer-science/algorithms")],
      lessons: [
        {
          key: "pensamiento-1",
          title: "Descomponer problemas y pseudocódigo",
          summary: "Del problema en palabras a pasos que una máquina puede seguir.",
          minutes: 30,
          exercises: [
            choice("Necesitas calcular el IVA de 50 productos con la misma fórmula. ¿Qué herramienta del pensamiento computacional aplicas al notar eso?", ["Abstracción", "Reconocimiento de patrones", "Compilación", "Depuración"], 1, "Detectar una operación que se repite es reconocer un patrón; en código se convierte en un bucle."),
            challenge(
              "Escribe mayor(lista) que devuelva el número más grande SIN usar max(). Asume que la lista tiene al menos un elemento.",
              {
                functionName: "mayor",
                starter: "def mayor(lista):\n    # Sigue el pseudocódigo de la lección\n    pass\n",
                tests: [{ args: [[3, 9, 2]], expected: 9 }, { args: [[-5, -1, -8]], expected: -1 }, { args: [[7]], expected: 7 }],
                solution: "def mayor(lista):\n    resultado = lista[0]\n    for n in lista:\n        if n > resultado:\n            resultado = n\n    return resultado",
              },
              "Empieza con el primer elemento como 'mayor' y reemplázalo cada vez que encuentres uno más grande."
            ),
          ],
        },
      ],
      quiz: [
        q("¿Qué característica debe tener un algoritmo?", ["Ser ambiguo", "Ser finito y preciso", "Estar escrito en inglés", "Usar solo números"], 1, "Un algoritmo termina y cada paso tiene un único significado."),
        q("¿Qué es la descomposición?", ["Borrar código", "Dividir un problema grande en partes pequeñas", "Compilar un programa", "Ordenar una lista"], 1, "Resolver partes pequeñas es más fácil que atacar todo a la vez."),
        q("¿Qué es el pseudocódigo?", ["Un lenguaje de programación oficial", "Una descripción estructurada del algoritmo en lenguaje humano", "Código con errores", "Un virus"], 1, "Permite pensar la lógica sin preocuparse por la sintaxis."),
        q("¿Qué es la abstracción?", ["Quedarse con lo esencial e ignorar detalles irrelevantes", "Repetir código", "Usar muchos bucles", "Escribir comentarios"], 0, "Simplifica el problema a lo que realmente importa."),
        q("¿Cuál es un buen caso extremo para probar una función que promedia una lista?", ["Una lista de 3 números", "Una lista vacía", "Una lista ordenada", "Una lista de pares"], 1, "La lista vacía puede provocar división entre cero."),
      ],
    },
    {
      slug: "algoritmos-complejidad",
      title: "Algoritmos y complejidad básica",
      description: "Búsqueda lineal y binaria, ordenamiento y notación Big O.",
      duration: "1 a 2 semanas",
      level: "intermedio",
      objectives: ["Implementar búsqueda lineal y binaria.", "Explicar cómo funciona el ordenamiento burbuja.", "Estimar la complejidad Big O de un fragmento de código.", "Mejorar un algoritmo usando estructuras adecuadas."],
      checklist: ["Implementé la búsqueda binaria y la probé", "Sé por qué la búsqueda binaria necesita una lista ordenada", "Puedo identificar código O(n²)", "Reemplacé un bucle anidado por un conjunto"],
      resources: [cs50, res("VisuAlgo: visualización de algoritmos", "https://visualgo.net/es", "Español e inglés")],
      lessons: [
        {
          key: "algoritmos-1",
          title: "Búsqueda y ordenamiento",
          summary: "Lineal vs. binaria y el ordenamiento burbuja.",
          minutes: 40,
          exercises: [
            choice("¿Qué condición necesita la búsqueda binaria?", ["Que la lista tenga números pares", "Que la lista esté ordenada", "Que la lista sea pequeña", "Ninguna"], 1, "Solo puede descartar la mitad si sabe que los datos están ordenados."),
            challenge(
              "Implementa busqueda_binaria(lista, objetivo) que devuelva el índice del objetivo en una lista ordenada, o -1 si no está.",
              {
                functionName: "busqueda_binaria",
                starter: "def busqueda_binaria(lista, objetivo):\n    inicio, fin = 0, len(lista) - 1\n    # completa el algoritmo\n    return -1\n",
                tests: [{ args: [[1, 3, 5, 7, 9], 7], expected: 3 }, { args: [[1, 3, 5, 7, 9], 1], expected: 0 }, { args: [[1, 3, 5, 7, 9], 4], expected: -1 }, { args: [[], 2], expected: -1 }],
                solution: "def busqueda_binaria(lista, objetivo):\n    inicio, fin = 0, len(lista) - 1\n    while inicio <= fin:\n        medio = (inicio + fin) // 2\n        if lista[medio] == objetivo:\n            return medio\n        elif lista[medio] < objetivo:\n            inicio = medio + 1\n        else:\n            fin = medio - 1\n    return -1",
              },
              "Mira el elemento del medio: si es menor que el objetivo, descarta la izquierda; si es mayor, la derecha."
            ),
          ],
        },
        {
          key: "algoritmos-2",
          title: "Complejidad y notación Big O",
          summary: "Cómo crece el trabajo cuando crecen los datos.",
          minutes: 35,
          exercises: [
            choice("¿Qué complejidad tiene recorrer una lista una vez con un for?", ["O(1)", "O(log n)", "O(n)", "O(n²)"], 2, "El trabajo crece en proporción al número de elementos."),
            choice("Un bucle for dentro de otro bucle for, ambos sobre la misma lista, es:", ["O(n)", "O(n²)", "O(log n)", "O(1)"], 1, "Por cada elemento recorres de nuevo toda la lista: n × n."),
            challenge(
              "Escribe tiene_repetidos(lista) que devuelva True si algún valor aparece más de una vez. Hazlo en O(n) usando un conjunto.",
              {
                functionName: "tiene_repetidos",
                starter: "def tiene_repetidos(lista):\n    vistos = set()\n    # Escribe tu código aquí\n    return False\n",
                tests: [{ args: [[1, 2, 3, 2]], expected: true }, { args: [[1, 2, 3]], expected: false }, { args: [[]], expected: false }, { args: [["a", "b", "a"]], expected: true }],
                solution: "def tiene_repetidos(lista):\n    vistos = set()\n    for x in lista:\n        if x in vistos:\n            return True\n        vistos.add(x)\n    return False",
              },
              "Guarda cada valor en un set; si al llegar un valor ya estaba en el set, hay repetido."
            ),
          ],
        },
      ],
      quiz: [
        q("¿Cuántas comparaciones necesita aproximadamente la búsqueda binaria en un millón de elementos?", ["1.000.000", "500.000", "Unas 20", "1"], 2, "log₂(1.000.000) ≈ 20."),
        q("¿Qué complejidad tiene acceder a lista[10]?", ["O(1)", "O(n)", "O(n²)", "O(log n)"], 0, "El acceso por índice es directo."),
        q("¿Cómo se simplifica O(n² + 3n + 5)?", ["O(n)", "O(n²)", "O(5)", "O(3n)"], 1, "Domina el término de mayor crecimiento."),
        q("¿Por qué el ordenamiento burbuja es lento con muchos datos?", ["Usa mucha memoria", "Es O(n²)", "Solo ordena texto", "No es lento"], 1, "Compara pares repetidamente: crece de forma cuadrática."),
        q("¿Qué estructura de Python permite buscar si un elemento existe en O(1) promedio?", ["Lista", "Tupla", "Conjunto (set)", "String"], 2, "Los set y dict son tablas hash."),
      ],
    },
    {
      slug: "estructuras-de-datos",
      title: "Estructuras de datos",
      description: "Arreglos, listas enlazadas, pilas, colas, tablas hash y árboles.",
      duration: "2 semanas",
      level: "intermedio",
      objectives: ["Comparar arreglos y listas enlazadas.", "Usar pilas (LIFO) y colas (FIFO).", "Explicar cómo funciona una tabla hash.", "Entender la estructura de un árbol binario de búsqueda."],
      checklist: ["Implementé una pila con una lista", "Usé collections.deque como cola", "Puedo explicar por qué las claves de un dict deben ser inmutables", "Dibujé un árbol binario de búsqueda a mano"],
      resources: [cs50, res("Documentación de Python: collections.deque", "https://docs.python.org/es/3/library/collections.html#collections.deque"), res("VisuAlgo: listas, pilas, colas y árboles", "https://visualgo.net/es", "Español e inglés")],
      lessons: [
        {
          key: "estructuras-1",
          title: "Arreglos, listas, pilas y colas",
          summary: "Cómo organizar datos según cómo los vas a usar.",
          minutes: 35,
          exercises: [
            choice("El botón 'Deshacer' de un editor funciona como una…", ["Cola", "Pila", "Tabla hash", "Árbol"], 1, "Deshace primero la última acción: el último en entrar es el primero en salir (LIFO)."),
            output("¿Qué imprime este código?", "pila = [1, 2, 3]\npila.append(4)\npila.pop()\nprint(pila.pop())", ["3"], "Se agrega 4, el primer pop quita 4 y el segundo quita 3."),
            challenge(
              "Escribe parentesis_balanceados(texto) que devuelva True si cada '(' tiene su ')' correspondiente en orden correcto. Pista: usa una pila.",
              {
                functionName: "parentesis_balanceados",
                starter: "def parentesis_balanceados(texto):\n    pila = []\n    # Escribe tu código aquí\n    return True\n",
                tests: [{ args: ["(())"], expected: true }, { args: ["(()"], expected: false }, { args: [")("], expected: false }, { args: ["a(b)c"], expected: true }, { args: [""], expected: true }],
                solution: "def parentesis_balanceados(texto):\n    pila = []\n    for c in texto:\n        if c == '(':\n            pila.append(c)\n        elif c == ')':\n            if not pila:\n                return False\n            pila.pop()\n    return len(pila) == 0",
              },
              "Apila cada '('. Con cada ')' desapila; si la pila está vacía en ese momento, está desbalanceado. Al final la pila debe quedar vacía."
            ),
          ],
        },
        {
          key: "estructuras-2",
          title: "Tablas hash y árboles",
          summary: "Búsquedas casi instantáneas y datos jerárquicos.",
          minutes: 35,
          exercises: [
            choice("En un árbol binario de búsqueda, ¿dónde se insertaría el 3 si la raíz es 8?", ["A la derecha de 8", "A la izquierda de 8", "Reemplaza a 8", "En una lista aparte"], 1, "Los valores menores que el nodo van a la izquierda."),
            choice("¿Cuál de estos valores NO puede ser clave de un diccionario de Python?", ["\"nombre\"", "42", "(1, 2)", "[1, 2]"], 3, "Las listas son mutables, por eso no tienen hash y no pueden ser claves."),
          ],
        },
      ],
      quiz: [
        q("¿Qué principio sigue una cola?", ["LIFO", "FIFO", "Aleatorio", "Por prioridad siempre"], 1, "First In, First Out: el primero en llegar es el primero en salir."),
        q("¿Qué estructura de Python es una tabla hash?", ["list", "tuple", "dict", "str"], 2, "Los diccionarios (y conjuntos) usan tablas hash."),
        q("¿Qué es la raíz de un árbol?", ["El nodo sin hijos", "El nodo superior del que parten los demás", "El nodo más grande", "Un error"], 1, "Es el punto de partida de la jerarquía."),
        q("¿Qué operación es lenta (O(n)) en una lista de Python?", ["Acceder por índice", "append al final", "Insertar al inicio", "len()"], 2, "Hay que correr todos los elementos una posición."),
        q("¿Cuál es un ejemplo real de árbol?", ["Una fila de banco", "El sistema de carpetas", "Una contraseña", "Un número binario"], 1, "Carpetas dentro de carpetas forman una jerarquía."),
      ],
    },
    {
      slug: "recursion",
      title: "Recursión",
      description: "Resuelve problemas con funciones que se llaman a sí mismas.",
      duration: "1 semana",
      level: "intermedio",
      objectives: ["Identificar caso base y caso recursivo.", "Trazar la ejecución de una función recursiva.", "Reconocer problemas naturalmente recursivos.", "Evitar RecursionError."],
      checklist: ["Escribí factorial de forma recursiva", "Tracé a mano factorial(4)", "Sé qué pasa si falta el caso base"],
      resources: [cs50, res("Khan Academy: Algoritmos (incluye recursión)", "https://es.khanacademy.org/computing/computer-science/algorithms")],
      lessons: [
        {
          key: "recursion-1",
          title: "Funciones que se llaman a sí mismas",
          summary: "Caso base, caso recursivo y la pila de llamadas.",
          minutes: 35,
          exercises: [
            output("¿Qué imprime este código?", "def f(n):\n    if n == 0:\n        return 0\n    return n + f(n - 1)\n\nprint(f(4))", ["10"], "f(4) = 4 + 3 + 2 + 1 + 0 = 10."),
            challenge(
              "Escribe potencia(base, exponente) de forma RECURSIVA (sin usar **). Ejemplo: potencia(2, 3) = 8. El exponente es entero y mayor o igual a 0.",
              {
                functionName: "potencia",
                starter: "def potencia(base, exponente):\n    # caso base: exponente 0\n    pass\n",
                tests: [{ args: [2, 3], expected: 8 }, { args: [5, 0], expected: 1 }, { args: [3, 4], expected: 81 }],
                solution: "def potencia(base, exponente):\n    if exponente == 0:\n        return 1\n    return base * potencia(base, exponente - 1)",
              },
              "Cualquier número elevado a 0 es 1 (caso base); base^n = base × base^(n-1)."
            ),
          ],
        },
      ],
      quiz: [
        q("¿Qué es el caso base?", ["La primera línea", "La situación que se resuelve sin llamar de nuevo a la función", "Un tipo de error", "La llamada recursiva"], 1, "Es lo que detiene la recursión."),
        q("¿Qué pasa si una función recursiva no tiene caso base?", ["Termina rápido", "RecursionError", "Devuelve 0", "Funciona igual"], 1, "Se llama infinitamente hasta superar el límite."),
        q("¿Qué estructura usa la computadora para guardar las llamadas pendientes?", ["Una cola", "Una pila", "Un árbol", "Un conjunto"], 1, "La pila de llamadas (call stack)."),
        q("¿Cuánto es factorial(5)?", ["25", "60", "120", "15"], 2, "5 × 4 × 3 × 2 × 1 = 120."),
        q("¿Qué problema es naturalmente recursivo?", ["Sumar dos números", "Recorrer carpetas dentro de carpetas", "Imprimir un saludo", "Leer una variable"], 1, "Cada carpeta contiene una estructura igual a sí misma."),
      ],
    },
    {
      slug: "memoria-depuracion",
      title: "Memoria, variables y depuración",
      description: "Cómo se guardan los datos en memoria y cómo encontrar errores con método.",
      duration: "1 semana",
      level: "intermedio",
      objectives: ["Entender las variables como referencias.", "Diferenciar objetos mutables e inmutables.", "Usar == e is correctamente.", "Depurar con puntos de interrupción en VS Code."],
      checklist: ["Expliqué por qué b = a no copia una lista", "Usé .copy() para duplicar una lista", "Puse un punto de interrupción y revisé variables en VS Code", "Apliqué el método del patito de goma"],
      resources: [res("VS Code: Depurar Python", "https://code.visualstudio.com/docs/python/debugging", "Inglés"), res("Python Tutor: visualiza la memoria de tu código", "https://pythontutor.com/", "Inglés")],
      lessons: [
        {
          key: "memoria-1",
          title: "Referencias, mutabilidad y depuración",
          summary: "Entiende lo que pasa en memoria y encuentra errores rápido.",
          minutes: 35,
          exercises: [
            output("¿Qué imprime este código?", "a = [1, 2]\nb = a\nb.append(3)\nprint(len(a))", ["3"], "b y a apuntan a la misma lista, así que el append se ve desde ambas."),
            output("¿Qué imprime este código?", "a = [1, 2]\nb = a.copy()\nb.append(3)\nprint(len(a))", ["2"], "copy() crea una lista nueva: modificar b no afecta a a."),
            choice("¿Qué tecla inicia la depuración en VS Code?", ["F2", "F5", "F12", "Ctrl + D"], 1, "F5 inicia el depurador; F10 avanza línea por línea."),
          ],
        },
      ],
      quiz: [
        q("¿Qué tipo es mutable?", ["str", "tuple", "list", "int"], 2, "Las listas se pueden modificar en el lugar."),
        q("¿Qué compara 'is'?", ["Si dos valores son iguales", "Si dos variables apuntan al mismo objeto", "El tamaño", "El tipo"], 1, "is compara identidad; == compara valor."),
        q("¿Qué es un punto de interrupción (breakpoint)?", ["Un error grave", "Un lugar donde el depurador detiene el programa", "El final del archivo", "Un comentario"], 1, "Permite inspeccionar las variables en ese momento."),
        q("¿Qué hace el recolector de basura de Python?", ["Borra archivos", "Libera memoria de objetos que nadie usa", "Corrige errores", "Elimina comentarios"], 1, "Gestiona la memoria automáticamente."),
        q("¿Cuál es el primer paso para depurar?", ["Reescribir todo", "Reproducir el error de forma consistente", "Borrar el archivo", "Pedir otro computador"], 1, "Si no puedes reproducirlo, no puedes confirmar que lo corregiste."),
      ],
    },
    {
      slug: "introduccion-c",
      title: "Introducción a C",
      description: "Compila tu primer programa y descubre lo que Python hace por ti.",
      duration: "1 a 2 semanas",
      level: "intermedio",
      objectives: ["Escribir y compilar un programa en C.", "Declarar variables con tipos.", "Usar printf con marcadores de formato.", "Comparar lenguajes compilados e interpretados."],
      checklist: ["Compilé y ejecuté hola.c", "Escribí un bucle for en C", "Sé qué significa %i, %f y %c", "Puedo explicar la diferencia entre compilar e interpretar"],
      resources: [res("CS50x: semanas 1 a 5 (C)", "https://cs50.harvard.edu/x/", "Inglés (subtítulos en español)"), res("CS50 Manual pages: referencia de C para principiantes", "https://manual.cs50.io/", "Inglés"), res("cppreference: referencia de C", "https://en.cppreference.com/w/c", "Inglés")],
      lessons: [
        {
          key: "c-1",
          title: "Tu primer programa en C",
          summary: "Sintaxis, tipos, compilación y diferencias con Python.",
          minutes: 40,
          exercises: [
            fill("Completa la línea que incluye la biblioteca donde está printf.", "#include <___>", [["stdio.h"]], "stdio.h (standard input/output) contiene printf.", "c"),
            output("¿Qué imprime este programa en C?", '#include <stdio.h>\n\nint main(void)\n{\n    int x = 7;\n    printf("%i\\n", x * 3);\n    return 0;\n}', ["21"], "%i se reemplaza por el valor entero de x * 3.", "c"),
            choice("¿Qué hace el comando gcc hola.c -o hola?", ["Ejecuta el programa", "Compila hola.c y genera el ejecutable hola", "Borra hola.c", "Abre un editor"], 1, "gcc es un compilador de C; -o define el nombre del ejecutable."),
          ],
        },
      ],
      quiz: [
        q("¿Cómo terminan las instrucciones en C?", ["Con un salto de línea", "Con punto y coma", "Con dos puntos", "Con llaves"], 1, "Cada instrucción termina en ;"),
        q("¿Dónde empieza la ejecución de un programa en C?", ["En la primera línea", "En la función main", "En printf", "En #include"], 1, "main es el punto de entrada."),
        q("¿Qué diferencia principal hay entre C y Python?", ["C se compila y declara tipos fijos", "C no tiene bucles", "Python es más rápido siempre", "Son iguales"], 0, "C compila a lenguaje máquina y exige tipos explícitos."),
        q("¿Qué marcador de printf imprime un número decimal (float)?", ["%i", "%c", "%f", "%s"], 2, "%f es para float; %.2f muestra 2 decimales."),
        q("En C, ¿quién libera la memoria pedida con malloc?", ["Un recolector de basura", "El programador, con free", "El compilador", "Nadie"], 1, "En C la gestión de memoria es manual."),
      ],
    },
    {
      slug: "sql-bases-relacionales",
      title: "SQL y bases de datos relacionales",
      description: "Tablas, claves y tus primeras consultas SQL con SQLite y Python.",
      duration: "1 a 2 semanas",
      level: "principiante",
      objectives: ["Explicar tablas, filas, columnas y claves.", "Crear tablas e insertar datos.", "Consultar con SELECT, WHERE y ORDER BY.", "Usar sqlite3 desde Python con parámetros seguros."],
      checklist: ["Creé una tabla con clave primaria", "Hice consultas con WHERE y ORDER BY", "Conecté Python con SQLite", "Sé por qué usar ? en lugar de concatenar texto"],
      resources: [res("SQLite: documentación oficial", "https://www.sqlite.org/docs.html", "Inglés"), res("Documentación de Python: sqlite3", "https://docs.python.org/es/3/library/sqlite3.html"), res("DB Browser for SQLite (herramienta gratuita)", "https://sqlitebrowser.org/", "Inglés")],
      lessons: [
        {
          key: "sql-1",
          title: "Tablas, claves y consultas",
          summary: "Organiza datos en tablas y consulta con SQL.",
          minutes: 40,
          exercises: [
            fill("Completa la consulta para obtener todas las columnas de la tabla estudiantes.", "SELECT ___ FROM estudiantes;", [["*"]], "El asterisco significa 'todas las columnas'.", "sql"),
            fill("Completa para filtrar solo los mayores de 18.", "SELECT nombre FROM personas ___ edad > 18;", [["WHERE", "where"]], "WHERE filtra las filas que cumplen una condición.", "sql"),
            choice("¿Qué identifica de forma única cada fila de una tabla?", ["La clave foránea", "La clave primaria", "El nombre de la tabla", "La primera columna siempre"], 1, "La clave primaria (normalmente id) no se repite."),
          ],
        },
      ],
      quiz: [
        q("¿Qué es una clave foránea?", ["Una contraseña", "Una columna que apunta a la clave primaria de otra tabla", "Una tabla vacía", "Un índice de texto"], 1, "Conecta tablas entre sí."),
        q("¿Qué consulta cuenta las filas de una tabla?", ["SELECT SUM(*)", "SELECT COUNT(*) FROM tabla", "COUNT tabla", "SELECT LEN(tabla)"], 1, "COUNT(*) cuenta todas las filas."),
        q("¿Qué hace ORDER BY edad DESC?", ["Borra por edad", "Ordena de mayor a menor edad", "Filtra por edad", "Agrupa por edad"], 1, "DESC = descendente."),
        q("¿Qué ventaja tiene SQLite para aprender?", ["Es un solo archivo y no requiere servidor", "Es el más rápido del mundo", "Solo funciona en la nube", "No usa SQL"], 0, "No necesita instalar ni configurar un servidor."),
        q("¿Cómo se previene la inyección SQL?", ["Usando mayúsculas", "Con consultas parametrizadas (?)", "Borrando la tabla", "Con contraseñas largas"], 1, "Los parámetros separan los datos del código SQL."),
      ],
    },
  ],
};
