# Modelo 
Modelo: ChatGPT

# Prompts
```
Conoces el videojuego Frogger?
```

```
[ROL Y CONTEXTO]

Actúa como un Ingeniero de Desarrollo de Videojuegos especializado en desarrollo web (HTML5, CSS, JavaScript) con experiencia en el framework Phaser 3. Tu objetivo es diseñar, codificar y estructurar un juego completo, de un solo nivel, inspirado en el clásico "Frogger".

[OBJETIVO PRINCIPAL]

Generar todo el código fuente y los recursos necesarios en una estructura de archivos que permita la descarga y ejecución inmediata y local por parte del usuario.

[RESTRICCIONES TÉCNICAS]
Tecnología Mandatoria: HTML5, CSS (usando Tailwind CSS CDN para estética), JavaScript.

Motor de Juego: Phaser 3

Persistencia: Para el manejo de puntuaciones (High Scores), se debe utilizar localStorage de forma obligatoria, simulando el almacenamiento local sin depender de una base de datos o servidor.

Entrega (IMPORTANTE): Todo el código (HTML, CSS, JS, lógica de Phaser y manejo de High Scores) debe estar contenido en distintos archivos .html, .css, js y asi seguir buenas practicas de separar responsabilidades. y debes entregar un .zip con todo lo necesario.

[ESPECIFICACIONES DEL JUEGO]
Nivel: Un solo nivel fijo.

Personaje del Jugador: Una rana de color verde (Rana / Frog).

Obstáculos: Debe incluir al menos cuatro (4) "carreteras" llenas de vehículos que se mueven horizontalmente a diferentes velocidades.

Identificador de Jugador: Al iniciar el juego o al completar/perder, se debe solicitar un identificador de tres (3) letras (iniciales).

Sistema de Puntuación: El tiempo se mide desde el inicio del nivel hasta su finalización.

Condición de Victoria (Pantalla de "Completo"):

Activada al alcanzar la zona segura final.

Mostrar el texto "¡COMPLETO!".

Mostrar el tiempo exacto que tardó el jugador.

El tiempo se guarda en localStorage solo si el nivel fue completado.

Condición de Derrota (Pantalla de "Perdiste"):

Activada al colisionar con cualquier vehículo en la carretera.

Mostrar el texto "PERDISTE" o "GAME OVER".

Historial de Tiempos (High Scores):

Tanto en la pantalla de "Completo" como en la de "Perdiste", se deben mostrar los 3 mejores tiempos históricos (iniciales y tiempo) recuperados de localStorage.

[FORMATO DE SALIDA FINAL] Archivo .zip con todos los recursos necearios para que yo pueda extraer su contenido y probar de forma local.


Tambien debes contemplar lo siguiente: 

** Debes cuidar que tenga un diseño moderno tanto el juego como la HU (Lo mensajes de "completo", "perdiste")** 

** Los vehiculos si se muevan en distintas velocidades** 

** El personaje del jugador debe tener forma de ranita** 

**Los vehiculos deben tener forma de vehiculo** 

** Y que se distingan las carreteras donde pasa **
```

```
Solicitud de Debugging: Problema de Carga de Assets en "Frogger" (Clon de Konami 1981)
Objetivo
Necesito tu ayuda para depurar un problema de carga de imágenes (assets) en mi implementación de un clon del juego "Frogger" (basado en el original de Konami de 1981).

Problema Específico
Actualmente, el juego no está cargando correctamente las imágenes (sprites) necesarias para dos elementos clave del juego:
Carros (Cars): Las imágenes de los vehículos.
Rana (Frog): La imagen del personaje principal.

Contexto y Archivo Relevante
Te estoy proporcionando el código fuente completo del juego (el codebase).
El código responsable de la carga de estos assets se encuentra específicamente en el archivo: GameScene.

Pregunta/Tarea
Analiza el código en el archivo GameScene.
Identifica la causa raíz del fallo en la carga de las imágenes de car y frog.
Sugiere la solución o corrección de código específica dentro de GameScene (o cualquier archivo relacionado si es necesario).

Si es aplicable, indica si hay algún error en las rutas de archivo o en el método de carga que esté violando las mejores prácticas para la gestión de assets.
```
---

# Modelo 
Modelo: Github Copilot desde Vscode

# Prompts
```
Solicitud de Debugging: Problema de Carga de Assets en "Frogger" (Clon de Konami 1981)
Objetivo
Necesito tu ayuda para depurar un problema de carga de imágenes (assets) en mi implementación de un clon del juego "Frogger" (basado en el original de Konami de 1981).

Problema Específico
Actualmente, el juego no está cargando correctamente las imágenes (sprites) necesarias para dos elementos clave del juego:
Carros (Cars): Las imágenes de los vehículos.
Rana (Frog): La imagen del personaje principal.

Contexto y Archivo Relevante
Te estoy proporcionando el código fuente completo del juego (el codebase).
El código responsable de la carga de estos assets se encuentra específicamente en el archivo: GameScene.

Pregunta/Tarea
Analiza el código en el archivo GameScene.
Identifica la causa raíz del fallo en la carga de las imágenes de car y frog.
Sugiere la solución o corrección de código específica dentro de GameScene (o cualquier archivo relacionado si es necesario).

Si es aplicable, indica si hay algún error en las rutas de archivo o en el método de carga que esté violando las mejores prácticas para la gestión de assets.
```

```
Solicitud: Creación de Archivo README.md
Tarea Principal
Debes generar el contenido completo para el archivo README.md.

Ubicación y Alcance
Este archivo debe residir en la raíz de la carpeta del proyecto, es decir: frogger-MAAC/README.md.

Contenido Requerido (Instrucciones Operacionales)
El README.md debe ser conciso, profesional y contener las instrucciones esenciales para que un nuevo colaborador pueda levantar, ejecutar y jugar el proyecto. Asegúrate de incluir las siguientes secciones:
Título y Descripción: Nombre del proyecto (Frogger-MAAC) y una breve descripción.
Tecnologías Utilizadas: Listado de los principales lenguajes y frameworks requeridos (Ej: Python, JavaScript, un motor de juego específico, etc.).
Prerrequisitos: Software que debe estar instalado antes de comenzar (Ej: Node.js, Python 3.x, npm/pip).
Instalación: Pasos claros para clonar el repositorio e instalar las dependencias (Ej: $ git clone [URL], $ npm install o $ pip install -r requirements.txt).
Ejecución del Juego: El comando o método específico para iniciar el juego (Ej: $ npm start o $ python main.py).
Controles del Juego: Cómo interactuar con Frogger (teclas de movimiento, etc.).
#codebase 
```
---