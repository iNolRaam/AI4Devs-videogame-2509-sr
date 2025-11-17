# Indice
- [1. Definir GDD](#1-definir-gdd)
- [2. Definir tecnologia](#2-definir-tecnologia)
- [3. Construir PRD](#3-construir-prd)
- [4. Implementación](#4-implementación)
---

# 1. Definir GDD
## Prompts:

```
Conoces el juego Battle City (Tank 1990)?. Unicamente responde a la pregunta
```


```
Como experto en Battle City (Tank 1990) y desarrollador de videojuegos: 
Hazme un descripción de juego con: 
 - Objetivo del juego 
 - Como ganar 
 - Como perder 
 - Tipos de materiales que salian en el escenario 
 - Mecanicas importantes de juego - tipos de enemigos - Poderes que aparecian - Colores de jugador y enemigos - Cualquier otra información que consideres necesaria para poder replicar/recrear el juego.
 - tipos de enemigos 
 - Poderes que aparecian 
 - Colores de jugador y enemigos 
 - Cualquier otra información que consideres necesaria para poder replicar/recrear el juego.
```


```
Generame un GDD Considerando lo siguiente: 
- El numero de vidas de cada jugador debe ser de 3. 
- Para nuestra versión seran solo 2 power-ups: 
1. Pala / Shovel 
2. Vida extra 
- En friendly fire haremos que cuando un jugador dispare a un amigo este sera aturdido. 
- En los tipos de materiales del escenario solo nos quedaremos con: 
1. Ladrillo 2. Acero 3. Arbustos 4. Base del aguila (Importante) 5. Agua
2. Acero 
3. Arbustos 
4. Base del aguila (Importante) 
5. Agua
```


```
Dame el GDD en formato para pegarlo en un archivo .md
```
---

# 2. Definir tecnologia

## Prompts:
``` 
Solicitud de Apoyo: Elección de Stack Tecnológico para "Tank Defender"
Agradecería mucho su orientación para elegir la mejor herramienta o framework para el desarrollo del juego "Tank Defender".

Contexto del Proyecto
Nombre del Juego: Tank Defender
Documentación: Ya contamos con el Game Design Document (GDD) completo.
Plataforma de Destino: Web (Desktop y Mobile compatible).
Tecnologías Base Requeridas: El desarrollo debe utilizar HTML5, CSS y JavaScript como base fundamental.

Pregunta Principal
¿Cuál es la herramienta o framework de desarrollo de juegos 2D (Game Engine) más adecuada y eficiente que aproveche al máximo HTML5/CSS/JavaScript para construir un juego con las características de "Tank Defender"?
```
---

# 3. Construir PRD
## Prompts:
```
Solicitud: Creación de Product Requirements Document (PRD)
Adopta el rol de Product Owner (PO).

Necesito que elabores un Product Requirements Document (PRD) detallado para el juego "Tank Defender". Este PRD servirá como el documento guía esencial para la visión, el valor y el desarrollo del producto.

Documentación Base
Game Design Document (GDD): Contamos con el GDD completo, el cual ya especifica "cómo" se construirá el juego (mecánicas, niveles, arte).

Stack Tecnológico Confirmado:
- HTML5
- CSS
- JavaScript
- Phaser 3 (como Game Framework principal).

Objetivos del PRD
El PRD debe complementar el GDD, enfocándose en el "qué" y el "por qué" del producto desde una perspectiva de producto y usuario. Querio que nos enfoquemos en lo necesario para el desarrollo del juego y no en como generar monetización o temas de lanzamiento.
Debe incluir, como mínimo, las siguientes secciones:

Requerimientos Funcionales de Alto Nivel (enfocados en la experiencia de usuario/jugador).
Requerimientos Técnicos (mencionando la tecnología y posibles desafíos de rendimiento/compatibilidad).

Proceso a Seguir
Como PO, si encuentras alguna ambigüedad o necesitas información que no está en el GDD (relacionada con el desarrollo del juego), por favor formúlame las preguntas necesarias para poder completar este PRD de manera efectiva.

Comencemos el proceso de descubrimiento.
```

```
¿El MVP incluye 1 nivel, una serie de niveles (5–10) o un modo infinito?
Enfocate en desarrollar 3 niveles por ahora.


¿Pantalla de inicio?
Si, debera seleccionar si son 1 o 2 jugadores y tener un boton de comenzar. (Puedes basarte del juego original "Battle City (Tank 1990)")
¿Pantalla de victoria/derrota?
Al perder que no bloque la jugabiliodad y muestr el score de los jugadores y el nivel donde se quedaron. y un boton de "reiniciar o salir"
Si dan reiniciar, inicie desde el primer nivel, si dan salir debera mandarlo al menu o pantalla inicial.
¿Pantalla de pausa?
Sin pantalla de pausa

¿El MVP incluye modo 2 jugadores?
Si, podran jugar 1 o 2 jugadores segun seleccione en la pantalla de inicio.
Primer jugador usara las teclas "w", "a", "s" y "d" para moverse y "v" para disparar:
w: arriba
a: izquierda
s: abajo
d: derecha
v: dispara

Segundo jugador usara las teclas de flecha del teclado para moverse y "L" para disparar: 
flecha hacia arrriba: arriba
flecha hacia la izquierda: izquierda 
flecha hacia abajo: abajo 
flecha hacia la derecha: derecha 
l: dispara


Compatibilidad Web: Solo su uso en desktop navegador (Chrome, Edge, Firefox)
Tipos de control permitidos: Teclado

¿El juego incluirá audio?: No incluiremos audio.
No guardar nada (se pierde al refrescar)

¿Dónde se hospedará el juego?: Servidor propio, se correra de forma local

¿El MVP debe correr a?: 30 FPS en desktop

¿Tu intención es que el MVP sea…? Solo una demo jugable
```

```
Solicitud de Arquitecto de Software: Creación de Diagrama Lean Canvas
Adopta el rol de Arquitecto de Software Senior con experiencia en diseño de arquitectura para aplicaciones web interactivas y videojuegos 2D.

🎯 Tarea Principal
Tu objetivo es analizar y crear el diagrama lean canvas para el desarrollo del juego "Tank Defender".

Contexto y Recursos
Debes basarte exclusivamente en la información contenida en los siguientes documentos que te serán provistos:

Game Design Document (GDD)
Product Requirements Document (PRD)
Formato de salida:
Debera estar en formato mermaid con orientación de izquierda a derecha

Asegurate de que el diagrama contenga una sintaxis correcta y recuerda que tiene problemas con parentesis.
```

```
Solicitud de Arquitecto de Software: Creación de Diagrama Lean Canvas
Adopta el rol de Arquitecto de Software Senior con experiencia en diseño de arquitectura para aplicaciones web interactivas y videojuegos 2D.

🎯 Tarea Principal
Tu objetivo es analizar y crear el diagrama lean canvas para el desarrollo del juego "Tank Defender".

Contexto y Recursos
Debes basarte exclusivamente en la información contenida en los siguientes documentos que te serán provistos:

Game Design Document (GDD)
Product Requirements Document (PRD)
Formato de salida:
Debera estar en formato mermaid con orientación de izquierda a derecha

Asegurate de que el diagrama contenga una sintaxis correcta y recuerda que tiene problemas con parentesis.
```

```
Solicitud de Arquitecto de Software: Creación de casos de uso
Adopta el rol de Arquitecto de Software Senior con experiencia en diseño de arquitectura para aplicaciones web interactivas y videojuegos 2D.

🎯 Tareas Principales
Tu objetivo es analizar y extraer los casos de uso para el desarrollo del juego "Tank Defender" y mostarlos en un listado para que pueda validarlos.
Despues generaremos los diagramas de casos de uso en formato plantuml, pero yo te indicare que diagramas de casos de uso generaremos o en su defecto puedo decir "genera todos" para que generes todos.

Contexto y Recursos
Debes basarte exclusivamente en la información contenida en los siguientes documentos que te serán provistos:

Game Design Document (GDD)
Product Requirements Document (PRD)
Formato de salida:
Los diagramas que se generen deberan estar en formato PlantUML

Asegurate de que el diagrama contenga una sintaxis correcta y homologado en español.
```

```
Rol del Asistente
Actúa como un Arquitecto de Software Senior altamente experimentado en diseño de arquitectura para aplicaciones web interactivas y videojuegos 2D.

Expertise Tecnológico
Tu diseño debe estar optimizado para el siguiente stack:
- Core: HTML5, JavaScript (ES6+), CSS.
- Game Framework: Phaser 3.

🎯 Tarea Principal
Diseñar y documentar una Arquitectura de Alto Nivel completa para el juego "Tank Defender", basada en los principios de diseño y los requisitos no funcionales especificados.

📜 Principios de Diseño y Restricciones
El diseño de la arquitectura debe adherirse estrictamente a:
Patrones Arquitectónicos:
Clean Architecture (Arquitectura Limpia).
Domain-Driven Design (DDD).
Principios de Desarrollo:
Principios SOLID (Responsabilidad Única, Abierto/Cerrado, Sustitución de Liskov, Segregación de Interfaces, Inversión de Dependencia).
KISS (Keep It Simple, Stupid).
YAGNI (You Ain't Gonna Need It).
Prácticas de TDD (Test-Driven Development) (el diseño debe facilitar la implementación de TDD).

Requisitos No Funcionales (NFR):
Escalabilidad.
Seguridad.
Mantenibilidad.
Alta Disponibilidad.

Contexto y Base de Datos
Considera y refleja en el diseño toda la información de contexto obtenida previamente de los documentos hipotéticos PRD (requisitos de negocio) y GDD (diseño de juego).

Formato de Entregables (Artefactos Separados)
El resultado debe ser presentado en español y dividido en dos secciones distintas:
Explicación General del Diseño de la Arquitectura a Alto Nivel: Descripción detallada de las capas (Dominio, Aplicación, Adaptadores, Infraestructura), cómo interactúan, y cómo se mapean las tecnologías (Phaser 3) a la Arquitectura Limpia. Incluye una justificación de cómo se cumplen los NFRs y principios.

Diagrama del Sistema en formato Mermaid: Un diagrama de flujo que represente la estructura de capas y el flujo de dependencias. Verifica y corrige la sintaxis de Mermaid para asegurar que el código sea correcto y funcional.
```


```
Rol del Asistente
Actúa como un Arquitecto de Software Senior altamente experimentado en diseño de arquitectura para aplicaciones web interactivas y videojuegos 2D.

Tareas principales:
- Analizar y validar que todos los elementos que conforman los diagramas sean correctos con respecto a la documentación y revisar si algun elemento no tiene relación con los demás y en ese caso validar contra documentación si es correcto.
- Analiza y crea los diagrmas C4 de contexto y contenedor
- Analiza y crear todos los diagramas C4 de componentes.
**El analisis debe ser con base al document PRD que estoy adjuntando**
** Los diagramas deben estar en formato**
Haz uso del lenguaje PlantUML y de la siguiente referencia para darme el código necesario:
@startuml C4_Elements
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(personAlias, "Label", "Optional Description")
Container(containerAlias, "Label", "Technology", "Optional Description")
System(systemAlias, "Label", "Optional Description")

Rel(personAlias, containerAlias, "Label", "Optional Technology")
@enduml
```

** Para generar las historias de usuario, lo hice mediante sudolang**


---

# 4. Implementación
## Prompts:

