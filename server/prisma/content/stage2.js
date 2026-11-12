import { challenge, choice, fill, output, q, res } from "./helpers.js";

const pyTutorial = (path, title) => res(`Tutorial oficial de Python: ${title}`, `https://docs.python.org/es/3/tutorial/${path}`);

export default {
  slug: "python",
  order: 2,
  icon: "🐍",
  title: "Programación con Python",
  subtitle: "Tu primer lenguaje, paso a paso",
  duration: "8 a 10 semanas",
  description:
    "Aprende a programar desde cero con Python: variables, decisiones, bucles, funciones, colecciones, errores, archivos y entornos virtuales. Terminarás construyendo tus propias herramientas.",
  modules: [
    {
      slug: "python-instalacion",
      title: "Instalación de Python y VS Code",
      description: "Prepara tu entorno y ejecuta tu primer programa.",
      duration: "1 día",
      level: "principiante",
      objectives: ["Instalar Python 3 y comprobar la versión.", "Instalar VS Code con la extensión de Python.", "Ejecutar un archivo .py desde la terminal.", "Usar el intérprete interactivo."],
      checklist: ["python --version muestra Python 3.x", "Ejecuté hola.py desde la terminal de VS Code", "Probé operaciones en el modo interactivo >>>"],
      resources: [
        res("Descargar Python (sitio oficial)", "https://www.python.org/downloads/", "Inglés"),
        res("Visual Studio Code: Python en VS Code", "https://code.visualstudio.com/docs/python/python-tutorial", "Inglés"),
        pyTutorial("interpreter.html", "Usando el intérprete"),
      ],
      lessons: [
        {
          key: "py-instalacion-1",
          title: "Instala Python y VS Code",
          summary: "Tu taller de trabajo listo en 20 minutos.",
          minutes: 25,
          exercises: [
            choice("En Windows, ¿qué casilla debes marcar al instalar Python para usarlo desde la terminal?", ["Install for all users", "Add python.exe to PATH", "Disable path length limit", "Install launcher"], 1, "Agregar Python al PATH permite que la terminal encuentre el comando python."),
            output("¿Qué imprime este código?", 'print("Hola" * 2)', ["HolaHola"], "Multiplicar un texto por un número lo repite."),
          ],
        },
      ],
      quiz: [
        q("¿Qué extensión tienen los archivos de Python?", [".js", ".py", ".txt", ".exe"], 1, ".py identifica el código Python."),
        q("¿Qué comando muestra la versión de Python instalada?", ["python --version", "python run", "pip version", "py -install"], 0, "python --version (o python3 --version) muestra la versión."),
        q("¿Qué hace print()?", ["Guarda un archivo", "Muestra datos en pantalla", "Imprime en papel siempre", "Cierra el programa"], 1, "print muestra texto o valores en la consola."),
        q("¿Cómo sales del intérprete interactivo?", ["exit()", "close", "Ctrl + S", "stop()"], 0, "exit() (o Ctrl + D en macOS/Linux, Ctrl + Z y Enter en Windows)."),
        q("¿Qué es VS Code?", ["Un lenguaje", "Un editor de código", "Un sistema operativo", "Una base de datos"], 1, "Es un editor gratuito con extensiones para muchos lenguajes."),
      ],
    },
    {
      slug: "python-variables-operadores",
      title: "Variables, tipos de datos y operadores",
      description: "Guarda información, conoce los tipos básicos y haz cálculos y comparaciones.",
      duration: "1 semana",
      level: "principiante",
      objectives: ["Crear variables con nombres claros.", "Distinguir str, int, float y bool.", "Convertir tipos y usar input().", "Usar operadores aritméticos, de comparación y lógicos."],
      checklist: ["Sé por qué int(input()) es necesario para hacer cuentas", "Uso f-strings para mostrar resultados", "Entiendo la diferencia entre = y ==", "Sé usar % para saber si un número es par"],
      resources: [pyTutorial("introduction.html", "Una introducción informal"), res("freeCodeCamp en español: currículo interactivo", "https://www.freecodecamp.org/espanol/learn")],
      lessons: [
        {
          key: "py-variables-1",
          title: "Variables y tipos de datos",
          summary: "Etiquetas para guardar texto, números y valores lógicos.",
          minutes: 25,
          exercises: [
            output("¿Qué imprime este código?", 'nombre = "Ana"\nedad = 30\nprint(f"{nombre} tiene {edad + 1}")', ["Ana tiene 31"], "La f-string inserta las variables y evalúa edad + 1."),
            fill("Completa para convertir el texto que entrega input() en un número entero.", 'edad = ___(input("Edad: "))', [["int"]], "input() siempre devuelve texto; int() lo convierte a entero."),
            choice("¿Qué tipo de dato es 3.5?", ["int", "str", "float", "bool"], 2, "Los números con decimales son float."),
          ],
        },
        {
          key: "py-variables-2",
          title: "Operadores",
          summary: "Cuentas, comparaciones y lógica.",
          minutes: 25,
          exercises: [
            output("¿Qué imprime este código?", "print(17 % 5)", ["2"], "17 entre 5 da 3 y sobra 2: el operador % devuelve el residuo."),
            output("¿Qué imprime este código?", "print(10 // 3, 10 / 2)", ["3 5.0"], "// es división entera (3); / siempre devuelve float (5.0)."),
            challenge(
              "Escribe la función es_par(numero) que devuelva True si el número es par y False si no.",
              {
                functionName: "es_par",
                starter: "def es_par(numero):\n    # Escribe tu código aquí\n    pass\n",
                tests: [{ args: [4], expected: true }, { args: [7], expected: false }, { args: [0], expected: true }, { args: [-3], expected: false }],
                solution: "def es_par(numero):\n    return numero % 2 == 0",
              },
              "Un número es par si al dividirlo entre 2 el residuo es 0: numero % 2 == 0 ya es True o False."
            ),
          ],
        },
      ],
      quiz: [
        q("¿Qué devuelve type(\"42\")?", ["int", "str", "float", "bool"], 1, "Entre comillas es texto (str), aunque parezca número."),
        q("¿Cuál es un nombre de variable válido y recomendado?", ["2precio", "precio total", "precio_total", "precio-total"], 2, "snake_case, sin espacios ni guiones, sin empezar por número."),
        q("¿Cuánto es 2 + 3 * 4?", ["20", "14", "24", "9"], 1, "Primero la multiplicación: 3*4=12, luego +2 = 14."),
        q("¿Qué devuelve 5 > 3 and 2 > 4?", ["True", "False", "None", "Error"], 1, "and exige que ambas sean verdaderas; 2 > 4 es False."),
        q("¿Qué pasa con \"Edad: \" + 25?", ["Imprime Edad: 25", "TypeError", "Suma 25", "Devuelve None"], 1, "No se puede sumar str con int; usa f-strings o str(25)."),
      ],
    },
    {
      slug: "python-condicionales",
      title: "Condicionales",
      description: "Haz que tus programas tomen decisiones con if, elif y else.",
      duration: "4 días",
      level: "principiante",
      objectives: ["Escribir condiciones con if, elif y else.", "Respetar la indentación.", "Combinar condiciones con and, or y not.", "Ordenar las condiciones de la más específica a la más general."],
      checklist: ["Escribí un programa que clasifica un número como positivo, negativo o cero", "Entiendo por qué importa el orden de los elif", "Sé qué valores se consideran falsos"],
      resources: [pyTutorial("controlflow.html#if-statements", "La sentencia if")],
      lessons: [
        {
          key: "py-condicionales-1",
          title: "if, elif y else",
          summary: "Decisiones paso a paso y la importancia de la indentación.",
          minutes: 30,
          exercises: [
            output("¿Qué imprime este código?", 'x = 15\nif x > 20:\n    print("A")\nelif x > 10:\n    print("B")\nelse:\n    print("C")', ["B"], "15 no es mayor que 20, pero sí que 10: entra al elif."),
            challenge(
              "Escribe clasificar(nota) que devuelva \"Excelente\" si la nota es 4.5 o más, \"Aprobado\" si es 3.0 o más y \"Reprobado\" en otro caso.",
              {
                functionName: "clasificar",
                starter: "def clasificar(nota):\n    # Escribe tu código aquí\n    pass\n",
                tests: [{ args: [4.8], expected: "Excelente" }, { args: [4.5], expected: "Excelente" }, { args: [3.0], expected: "Aprobado" }, { args: [2.9], expected: "Reprobado" }],
                solution: 'def clasificar(nota):\n    if nota >= 4.5:\n        return "Excelente"\n    elif nota >= 3.0:\n        return "Aprobado"\n    else:\n        return "Reprobado"',
              },
              "Revisa primero el caso más exigente (4.5) y luego el siguiente; el else cubre el resto."
            ),
          ],
        },
      ],
      quiz: [
        q("¿Qué indica en Python qué líneas pertenecen a un if?", ["Las llaves {}", "La indentación", "El punto y coma", "Los paréntesis"], 1, "Python usa la indentación (4 espacios) para definir bloques."),
        q("¿Cuándo se ejecuta el else?", ["Siempre", "Cuando ninguna condición anterior se cumple", "Antes del if", "Nunca"], 1, "else es el caso por defecto."),
        q("¿Qué imprime: if \"\": print(\"sí\") else: print(\"no\")?", ["sí", "no", "Error", "Nada"], 1, "El texto vacío se considera falso."),
        q("¿Qué operador invierte una condición?", ["and", "or", "not", "is"], 2, "not convierte True en False y viceversa."),
        q("Si x = 7, ¿qué devuelve x > 5 or x < 0?", ["True", "False", "7", "Error"], 0, "Basta con que una condición sea verdadera en un or."),
      ],
    },
    {
      slug: "python-bucles",
      title: "Bucles for y while",
      description: "Repite tareas automáticamente sin copiar código.",
      duration: "1 semana",
      level: "principiante",
      objectives: ["Recorrer listas y textos con for.", "Usar range() con inicio, fin y paso.", "Usar while con una condición de salida clara.", "Aplicar break y continue."],
      checklist: ["Imprimí una tabla de multiplicar con for", "Hice un menú con while True y break", "Sé detener un bucle infinito con Ctrl + C", "Usé una variable acumuladora"],
      resources: [pyTutorial("controlflow.html#for-statements", "La sentencia for"), pyTutorial("controlflow.html#the-range-function", "La función range()")],
      lessons: [
        {
          key: "py-bucles-1",
          title: "for y range",
          summary: "Recorre colecciones y cuenta sin esfuerzo.",
          minutes: 30,
          exercises: [
            output("¿Qué imprime este código? (escribe cada número en una línea)", "for i in range(2, 8, 2):\n    print(i)", ["2\n4\n6"], "range(2, 8, 2) empieza en 2, avanza de 2 en 2 y se detiene antes de 8."),
            fill("Completa para recorrer los números del 1 al 10 (incluido).", "for n in range(1, ___):\n    print(n)", [["11"]], "range no incluye el valor final, así que para llegar a 10 escribes 11."),
            challenge(
              "Escribe suma_hasta(n) que devuelva la suma de todos los números de 1 a n. Ejemplo: suma_hasta(4) = 10.",
              {
                functionName: "suma_hasta",
                starter: "def suma_hasta(n):\n    total = 0\n    # usa un bucle for\n    return total\n",
                tests: [{ args: [4], expected: 10 }, { args: [10], expected: 55 }, { args: [1], expected: 1 }, { args: [0], expected: 0 }],
                solution: "def suma_hasta(n):\n    total = 0\n    for i in range(1, n + 1):\n        total += i\n    return total",
              },
              "Recorre range(1, n + 1) y acumula cada número en total."
            ),
          ],
        },
        {
          key: "py-bucles-2",
          title: "while, break y continue",
          summary: "Repite hasta que se cumpla una condición.",
          minutes: 25,
          exercises: [
            output("¿Qué imprime este código? (una línea por valor)", "n = 3\nwhile n > 0:\n    print(n)\n    n -= 1", ["3\n2\n1"], "El bucle se repite mientras n > 0 y n disminuye en cada vuelta."),
            challenge(
              "Escribe contar_vocales(texto) que devuelva cuántas vocales (a, e, i, o, u, en minúscula o mayúscula) tiene el texto.",
              {
                functionName: "contar_vocales",
                starter: "def contar_vocales(texto):\n    # Escribe tu código aquí\n    pass\n",
                tests: [{ args: ["hola"], expected: 2 }, { args: ["PYTHON"], expected: 1 }, { args: ["Murcielago"], expected: 5 }, { args: [""], expected: 0 }],
                solution: 'def contar_vocales(texto):\n    cuenta = 0\n    for letra in texto.lower():\n        if letra in "aeiou":\n            cuenta += 1\n    return cuenta',
              },
              "Pasa el texto a minúsculas con .lower() y cuenta las letras que estén en \"aeiou\"."
            ),
          ],
        },
      ],
      quiz: [
        q("¿Qué números genera range(3)?", ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3"], 1, "range(3) va de 0 a 2."),
        q("¿Qué hace break?", ["Salta a la siguiente vuelta", "Sale del bucle", "Reinicia el bucle", "Detiene Python"], 1, "break termina el bucle inmediatamente."),
        q("¿Cuándo conviene usar while en lugar de for?", ["Para recorrer una lista", "Cuando repites hasta que ocurra algo y no sabes cuántas vueltas habrá", "Nunca", "Para contar del 1 al 10"], 1, "while depende de una condición, no de una secuencia conocida."),
        q("¿Qué causa un bucle infinito?", ["Usar range", "Una condición que nunca se vuelve falsa", "Usar break", "Usar listas"], 1, "Si nada cambia la condición, el bucle nunca termina."),
        q("¿Qué hace continue?", ["Sale del programa", "Salta el resto de la vuelta actual y sigue con la siguiente", "Repite la vuelta", "Pausa el programa"], 1, "continue pasa directamente a la siguiente iteración."),
      ],
    },
    {
      slug: "python-funciones",
      title: "Funciones",
      description: "Organiza tu código en bloques reutilizables con parámetros y return.",
      duration: "1 semana",
      level: "principiante",
      objectives: ["Definir funciones con def.", "Diferenciar parámetros y argumentos.", "Usar return para devolver resultados.", "Entender el alcance de las variables."],
      checklist: ["Sé la diferencia entre print y return", "Escribí una función con un parámetro por defecto", "Documenté una función con un docstring", "Refactoricé código repetido en una función"],
      resources: [pyTutorial("controlflow.html#defining-functions", "Definiendo funciones")],
      lessons: [
        {
          key: "py-funciones-1",
          title: "Define y usa funciones",
          summary: "Parámetros, return, valores por defecto y alcance.",
          minutes: 35,
          exercises: [
            output("¿Qué imprime este código?", "def doble(x):\n    return x * 2\n\nprint(doble(doble(3)))", ["12"], "doble(3) = 6 y doble(6) = 12."),
            fill("Completa para que la función DEVUELVA el resultado.", "def area(base, altura):\n    ___ base * altura", [["return"]], "return entrega el valor a quien llamó la función."),
            challenge(
              "Escribe precio_con_descuento(precio, porcentaje=10) que devuelva el precio con el descuento aplicado. Ejemplo: precio_con_descuento(200) = 180.",
              {
                functionName: "precio_con_descuento",
                starter: "def precio_con_descuento(precio, porcentaje=10):\n    # Escribe tu código aquí\n    pass\n",
                tests: [{ args: [200], expected: 180 }, { args: [100, 50], expected: 50 }, { args: [80, 0], expected: 80 }],
                solution: "def precio_con_descuento(precio, porcentaje=10):\n    return precio - precio * porcentaje / 100",
              },
              "Resta al precio el valor del descuento: precio * porcentaje / 100."
            ),
          ],
        },
      ],
      quiz: [
        q("¿Qué palabra define una función?", ["func", "def", "function", "lambda"], 1, "def define funciones (lambda crea funciones anónimas cortas)."),
        q("¿Qué devuelve una función sin return?", ["0", "\"\"", "None", "Un error"], 2, "Por defecto, una función devuelve None."),
        q("En def saludar(nombre):, ¿qué es 'nombre'?", ["Un argumento", "Un parámetro", "Un módulo", "Un tipo"], 1, "Es el parámetro; el valor que pasas al llamarla es el argumento."),
        q("¿Qué pasa al usar fuera de la función una variable creada dentro?", ["Funciona", "NameError", "Devuelve None", "Se crea vacía"], 1, "Las variables locales solo existen dentro de su función."),
        q("¿Qué es un docstring?", ["Un error", "Texto que documenta lo que hace la función", "Un tipo de bucle", "Un archivo"], 1, "Se escribe entre triples comillas al inicio de la función."),
      ],
    },
    {
      slug: "python-colecciones",
      title: "Listas, tuplas, diccionarios y conjuntos",
      description: "Agrupa y organiza datos con las estructuras más usadas de Python.",
      duration: "1 a 2 semanas",
      level: "principiante",
      objectives: ["Crear y modificar listas.", "Usar índices y rebanadas.", "Representar fichas con diccionarios.", "Eliminar repetidos con conjuntos.", "Elegir la estructura adecuada para cada caso."],
      checklist: ["Sé que los índices empiezan en 0", "Usé append, remove y pop", "Recorrí un diccionario con .items()", "Conté palabras con un diccionario", "Escribí una comprensión de listas"],
      resources: [pyTutorial("datastructures.html", "Estructuras de datos")],
      lessons: [
        {
          key: "py-colecciones-1",
          title: "Listas y tuplas",
          summary: "Colecciones ordenadas, índices y rebanadas.",
          minutes: 35,
          exercises: [
            output("¿Qué imprime este código?", 'colores = ["rojo", "verde", "azul"]\nprint(colores[-1], len(colores))', ["azul 3"], "El índice -1 es el último elemento y len cuenta los elementos."),
            output("¿Qué imprime este código?", "nums = [5, 10, 15, 20]\nprint(nums[1:3])", ["[10, 15]"], "La rebanada [1:3] toma los índices 1 y 2."),
            challenge(
              "Escribe promedio(numeros) que devuelva el promedio de una lista de números. Si la lista está vacía devuelve 0.",
              {
                functionName: "promedio",
                starter: "def promedio(numeros):\n    # Escribe tu código aquí\n    pass\n",
                tests: [{ args: [[2, 4, 6]], expected: 4 }, { args: [[5]], expected: 5 }, { args: [[]], expected: 0 }, { args: [[1, 2]], expected: 1.5 }],
                solution: "def promedio(numeros):\n    if not numeros:\n        return 0\n    return sum(numeros) / len(numeros)",
              },
              "sum() suma los elementos y len() los cuenta; revisa primero la lista vacía para no dividir entre cero."
            ),
          ],
        },
        {
          key: "py-colecciones-2",
          title: "Diccionarios y conjuntos",
          summary: "Pares clave-valor y colecciones sin repetidos.",
          minutes: 35,
          exercises: [
            fill("Completa para obtener el valor de 'ciudad' o 'desconocida' si no existe.", 'ciudad = persona.___("ciudad", "desconocida")', [["get"]], ".get(clave, por_defecto) evita el KeyError."),
            output("¿Qué imprime este código?", "print(len({1, 2, 2, 3, 3, 3}))", ["3"], "Un conjunto elimina los repetidos: queda {1, 2, 3}."),
            challenge(
              "Escribe contar_palabras(texto) que devuelva un diccionario con cuántas veces aparece cada palabra. Ejemplo: \"la casa la\" → {\"la\": 2, \"casa\": 1}.",
              {
                functionName: "contar_palabras",
                starter: "def contar_palabras(texto):\n    conteo = {}\n    # Escribe tu código aquí\n    return conteo\n",
                tests: [{ args: ["la casa la"], expected: { la: 2, casa: 1 } }, { args: ["hola"], expected: { hola: 1 } }, { args: [""], expected: {} }],
                solution: "def contar_palabras(texto):\n    conteo = {}\n    for palabra in texto.split():\n        conteo[palabra] = conteo.get(palabra, 0) + 1\n    return conteo",
              },
              "texto.split() separa por espacios; con conteo.get(palabra, 0) + 1 sumas uno a cada palabra."
            ),
          ],
        },
      ],
      quiz: [
        q("¿Cuál es el índice del primer elemento de una lista?", ["1", "0", "-1", "Depende"], 1, "En Python los índices empiezan en 0."),
        q("¿Qué estructura NO se puede modificar después de crearla?", ["Lista", "Diccionario", "Tupla", "Conjunto"], 2, "Las tuplas son inmutables."),
        q("¿Qué estructura usarías para la ficha de un usuario (nombre, correo, edad)?", ["Lista", "Diccionario", "Conjunto", "Tupla de un elemento"], 1, "Un diccionario asocia cada dato a una clave descriptiva."),
        q("¿Qué hace lista.append(x)?", ["Borra x", "Agrega x al final", "Ordena la lista", "Busca x"], 1, "append agrega un elemento al final."),
        q("¿Qué devuelve [n * 2 for n in [1, 2, 3]]?", ["[1, 2, 3]", "[2, 4, 6]", "6", "[1, 4, 9]"], 1, "La comprensión multiplica cada elemento por 2."),
      ],
    },
    {
      slug: "python-errores",
      title: "Manejo de errores",
      description: "Lee los mensajes de error y evita que tus programas se detengan con try/except.",
      duration: "4 días",
      level: "principiante",
      objectives: ["Leer un traceback de abajo hacia arriba.", "Reconocer los errores más comunes.", "Usar try, except, else y finally.", "Lanzar errores propios con raise."],
      checklist: ["Leí un traceback e identifiqué archivo, línea y tipo de error", "Validé una entrada numérica con try/except", "Sé por qué no conviene un except vacío"],
      resources: [pyTutorial("errors.html", "Errores y excepciones")],
      lessons: [
        {
          key: "py-errores-1",
          title: "Errores y excepciones",
          summary: "Entiende los errores y manéjalos con elegancia.",
          minutes: 30,
          exercises: [
            choice("¿Qué error produce int(\"hola\")?", ["TypeError", "ValueError", "NameError", "SyntaxError"], 1, "El tipo es correcto (texto) pero el valor no se puede convertir: ValueError."),
            fill("Completa para atrapar la división entre cero.", "try:\n    r = 10 / 0\nexcept ___:\n    print(\"No se puede dividir entre cero\")", [["ZeroDivisionError"]], "Cada error tiene su nombre; ZeroDivisionError es el de dividir entre cero."),
            challenge(
              "Escribe convertir_numero(texto) que devuelva el número entero si el texto es válido, o None si no lo es. Usa try/except.",
              {
                functionName: "convertir_numero",
                starter: "def convertir_numero(texto):\n    # Escribe tu código aquí\n    pass\n",
                tests: [{ args: ["42"], expected: 42 }, { args: ["abc"], expected: null }, { args: ["-7"], expected: -7 }, { args: ["3.5"], expected: null }],
                solution: "def convertir_numero(texto):\n    try:\n        return int(texto)\n    except ValueError:\n        return None",
              },
              "Intenta int(texto) dentro de try y devuelve None en el except ValueError."
            ),
          ],
        },
      ],
      quiz: [
        q("¿Cómo se lee un traceback?", ["De arriba hacia abajo", "De abajo hacia arriba", "Solo la primera línea", "No se lee"], 1, "La última línea dice el tipo de error; las anteriores, dónde ocurrió."),
        q("¿Qué error indica que usaste una variable que no existe?", ["KeyError", "NameError", "IndexError", "ValueError"], 1, "NameError: el nombre no está definido."),
        q("¿Cuándo se ejecuta el bloque finally?", ["Solo si hay error", "Solo si no hay error", "Siempre", "Nunca"], 2, "finally se ejecuta pase lo que pase."),
        q("¿Qué hace raise ValueError(\"...\")?", ["Ignora un error", "Lanza un error a propósito", "Corrige el error", "Imprime una advertencia"], 1, "raise genera una excepción intencionalmente."),
        q("¿Por qué evitar 'except:' sin especificar el error?", ["Es más lento", "Oculta errores inesperados y dificulta encontrar fallos", "No funciona en Python 3", "Borra el archivo"], 1, "Atrapa todo, incluso errores que deberías ver y corregir."),
      ],
    },
    {
      slug: "python-archivos",
      title: "Archivos",
      description: "Guarda y lee información en archivos de texto, CSV y JSON.",
      duration: "1 semana",
      level: "principiante",
      objectives: ["Leer y escribir archivos de texto con with open.", "Diferenciar los modos r, w y a.", "Trabajar con archivos CSV y JSON.", "Manejar rutas con pathlib."],
      checklist: ["Guardé datos en un archivo y los leí de nuevo", "Leí un CSV con csv.DictReader", "Guardé una lista de diccionarios en JSON", "Usé encoding=\"utf-8\""],
      resources: [pyTutorial("inputoutput.html#reading-and-writing-files", "Leyendo y escribiendo archivos"), res("Documentación de Python: módulo csv", "https://docs.python.org/es/3/library/csv.html"), res("Documentación de Python: módulo json", "https://docs.python.org/es/3/library/json.html")],
      lessons: [
        {
          key: "py-archivos-1",
          title: "Texto, CSV y JSON",
          summary: "Haz que tus datos sobrevivan al cerrar el programa.",
          minutes: 35,
          exercises: [
            choice("¿Qué modo de open() agrega texto al final sin borrar lo que había?", ['"r"', '"w"', '"a"', '"x"'], 2, '"a" (append) agrega al final; "w" sobrescribe todo el archivo.'),
            fill("Completa para que el archivo se cierre solo al terminar.", '___ open("notas.txt", encoding="utf-8") as f:\n    print(f.read())', [["with"]], "with garantiza que el archivo se cierre, incluso si hay un error."),
            choice("¿Qué formato es mejor para guardar una lista de diccionarios?", ["TXT", "JSON", "MP3", "PNG"], 1, "JSON representa listas y diccionarios de forma natural."),
          ],
        },
      ],
      quiz: [
        q("¿Qué hace el modo \"w\" si el archivo ya existe?", ["Agrega al final", "Lo sobrescribe", "Da error", "Lo lee"], 1, "\"w\" borra el contenido anterior."),
        q("¿Qué error obtienes al leer un archivo que no existe?", ["FileNotFoundError", "KeyError", "ValueError", "IOErrorNotFound"], 0, "FileNotFoundError indica que la ruta no lleva a ningún archivo."),
        q("¿Para qué sirve encoding=\"utf-8\"?", ["Para comprimir", "Para manejar bien tildes y caracteres especiales", "Para cifrar", "Para acelerar"], 1, "UTF-8 representa correctamente tildes, eñes y emojis."),
        q("¿Qué función guarda un objeto Python en un archivo JSON?", ["json.load", "json.dump", "json.read", "json.save"], 1, "json.dump escribe; json.load lee."),
        q("¿Qué es un archivo CSV?", ["Una imagen", "Una tabla en texto separada por comas", "Un programa", "Una base de datos SQL"], 1, "Cada línea es una fila y las comas separan columnas."),
      ],
    },
    {
      slug: "python-modulos-entornos",
      title: "Módulos, paquetes y entornos virtuales",
      description: "Reutiliza código, instala paquetes con pip y aísla cada proyecto.",
      duration: "4 días",
      level: "intermedio",
      objectives: ["Importar módulos de la biblioteca estándar.", "Crear y usar tus propios módulos.", "Instalar paquetes con pip.", "Crear y activar entornos virtuales.", "Generar requirements.txt."],
      checklist: ["Importé random, math y datetime", "Separé mi código en dos archivos y los conecté con import", "Creé un entorno virtual y lo activé", "Agregué .venv/ al .gitignore"],
      resources: [pyTutorial("modules.html", "Módulos"), pyTutorial("venv.html", "Entornos virtuales y paquetes"), res("PyPI: índice de paquetes de Python", "https://pypi.org/", "Inglés")],
      lessons: [
        {
          key: "py-modulos-1",
          title: "Módulos, pip y entornos virtuales",
          summary: "Reutiliza código y mantén cada proyecto ordenado.",
          minutes: 35,
          exercises: [
            fill("Completa el comando que crea un entorno virtual llamado .venv.", "python -m ___ .venv", [["venv"]], "El módulo venv de la biblioteca estándar crea entornos virtuales.", "bash"),
            fill("Completa para importar solo la función sqrt del módulo math.", "___ math import sqrt", [["from"]], "from módulo import nombre trae solo lo que necesitas."),
            choice("¿Qué archivo lista las dependencias de un proyecto Python?", ["README.md", "requirements.txt", ".gitignore", "main.py"], 1, "pip freeze > requirements.txt guarda la lista; pip install -r requirements.txt la instala."),
          ],
        },
      ],
      quiz: [
        q("¿Qué es la biblioteca estándar?", ["Paquetes que vienen incluidos con Python", "Una tienda de libros", "Un editor", "Un tipo de dato"], 0, "Python trae módulos como math, random, json o datetime."),
        q("¿Para qué sirve un entorno virtual?", ["Para navegar en internet", "Para aislar los paquetes de cada proyecto", "Para acelerar Python", "Para ocultar el código"], 1, "Evita conflictos de versiones entre proyectos."),
        q("¿Qué comando instala un paquete externo?", ["python install", "pip install nombre", "import install", "get nombre"], 1, "pip es el instalador de paquetes de Python."),
        q("¿Qué hace el bloque if __name__ == \"__main__\":?", ["Siempre se ejecuta", "Se ejecuta solo cuando corres el archivo directamente", "Importa módulos", "Crea un entorno"], 1, "Evita que el código principal se ejecute al importar el archivo."),
        q("¿Debes subir la carpeta .venv a GitHub?", ["Sí, siempre", "No, se sube solo requirements.txt", "Solo en Windows", "Solo si es pequeña"], 1, "El entorno se recrea con requirements.txt; se ignora con .gitignore."),
      ],
    },
  ],
};
