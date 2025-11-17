# User Stories for Tank Defender

## US-01 — Seleccionar 1P o 2P para iniciar
Persona: 
1) Fan retro PC con teclado
2) Co‑op local en misma PC
Descripción: Como jugador, quiero elegir 1P o 2P en la pantalla de inicio para comenzar la partida adecuada en Nivel 1.
Prioridad: Alta
Dependencias: Pantalla de Inicio, gestor de input teclado, estado de juego, cargador de nivel, HUD.
Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: Selección de modo 1 jugador o 2 jugadores en Pantalla de Inicio
  Como jugador
  Quiero elegir 1P o 2P
  Para iniciar la partida adecuada en el Nivel 1

  Background:
    Given estoy en la Pantalla de Inicio

  Scenario: Selección por defecto
    Then "1 Jugador" está preseleccionado
    And el botón "Comenzar" está habilitado

  Scenario: Cambiar a 2 jugadores y comenzar
    When selecciono "2 Jugadores"
    And presiono "Comenzar"
    Then inicia el Nivel 1 con P1 y P2 en sus puntos de aparición
    And cada jugador tiene 3 vidas
    And el HUD muestra indicadores de P1 y P2

  Scenario: Navegación solo con teclado
    When navego la UI con Tab y Shift+Tab o con Flechas
    And confirmo con Enter
    Then la selección alterna entre "1 Jugador" y "2 Jugadores"
    And al confirmar inicia el juego con el modo seleccionado

  Scenario: Reiniciar desde Pantalla de Resultado mantiene modo
    Given finalicé una partida en modo "2 Jugadores"
    When presiono "Reiniciar"
    Then vuelve al Nivel 1 manteniendo el modo "2 Jugadores"

  Scenario: Rendimiento mínimo en arranque
    When inicia el Nivel 1
    Then el framerate se mantiene al menos 30 FPS durante los primeros 10 segundos
    And esto se cumple en Chrome, Firefox y Safari de escritorio

  Scenario: Restricciones de plataforma y entrada
    Then no se requiere audio
    And la entrada es únicamente por teclado
    And Microsoft Edge y dispositivos móviles no están soportados
```

Definición de hecho (DoD)
- Solo teclado (P1: WASD+V, P2: Flechas+L).
- Probado en Chrome/Firefox/Safari desktop.
- ≥ 30 FPS sostenidos al inicio del Nivel 1.
- Sin audio, sin mobile, sin Edge.
- HUD refleja correctamente 1P/2P y 3 vidas por jugador.
Estimación: 2 puntos

## US-02 — Comenzar en Nivel 1

Persona: 
1) Fan retro PC con teclado
2) Co‑op local en misma PC
Descripción: Como jugador, quiero que una nueva partida inicie en el Nivel 1 para empezar de inmediato.
Prioridad: Alta
Dependencias: Pantalla de Inicio, cargador de niveles, configuración de enemigos (L1=15), spawns de jugadores, HUD.
Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: Inicio en Nivel 1
  Como jugador
  Quiero que la partida inicie en el Nivel 1
  Para empezar a jugar de inmediato

  Background:
    Given estoy en la Pantalla de Inicio

  Scenario: Iniciar 1 Jugador en Nivel 1
    When selecciono "1 Jugador" y presiono "Comenzar"
    Then se carga el "Nivel 1"
    And P1 aparece en su punto de aparición con 3 vidas
    And el HUD muestra "Nivel 1" y 15 enemigos restantes

  Scenario: Iniciar 2 Jugadores en Nivel 1
    When selecciono "2 Jugadores" y presiono "Comenzar"
    Then se carga el "Nivel 1"
    And P1 y P2 aparecen en sus puntos de aparición con 3 vidas cada uno
    And el HUD muestra "Nivel 1" y 15 enemigos restantes

  Scenario: Reiniciar vuelve al Nivel 1
    Given estoy en la Pantalla de Resultado
    When presiono "Reiniciar"
    Then se carga nuevamente el "Nivel 1"
    And se mantiene el modo (1P o 2P) seleccionado previamente

  Scenario: Configuración de enemigos del Nivel 1
    When el "Nivel 1" inicia
    Then la reserva total de enemigos es 15
    And hay un máximo de 4 enemigos simultáneos
    And los spawns ocurren desde la parte superior del mapa

  Scenario: Rendimiento mínimo al iniciar el nivel
    When el "Nivel 1" inicia
    Then el framerate se mantiene al menos 30 FPS durante los primeros 10 segundos
    And esto se cumple en Chrome, Firefox y Safari de escritorio

  Scenario: Restricciones de plataforma y entrada
    Then no se requiere audio
    And la entrada es únicamente por teclado
    And Microsoft Edge y dispositivos móviles no están soportados
```

Definición de hecho (DoD):
- Arranque siempre en Nivel 1 para nuevas partidas (1P/2P).
- HUD refleja Nivel 1 y 15 enemigos restantes al inicio.
- Probado en Chrome/Firefox/Safari desktop; solo teclado; sin audio; sin Edge/mobile.
- ≥ 30 FPS sostenidos en los primeros 10 s del Nivel 1.
Estimación: 1 punto

## US-03 — P1 se mueve con WASD

Descripción: Como jugador 1, quiero moverme con WASD para controlar mi tanque en 4 direcciones.
Prioridad: Alta
Dependencias: Sistema de input teclado, física/colisiones, mapa/materiales, cámara/HUD.
Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: Movimiento de P1 con WASD
  Como jugador 1
  Quiero moverme con WASD
  Para controlar mi tanque en 4 direcciones

  Background:
    Given el juego está en el "Nivel 1"
    And P1 está en su punto de aparición

  Scenario: Movimiento básico en 4 direcciones
    When mantengo presionada "W"
    Then P1 se mueve hacia arriba a velocidad constante
    When mantengo presionada "A"
    Then P1 se mueve hacia la izquierda a velocidad constante
    When mantengo presionada "S"
    Then P1 se mueve hacia abajo a velocidad constante
    When mantengo presionada "D"
    Then P1 se mueve hacia la derecha a velocidad constante

  Scenario: Detenerse al soltar la tecla
    Given P1 se está moviendo con "D"
    When suelto "D"
    Then P1 se detiene sin inercia

  Scenario: Sin movimiento diagonal
    When presiono "W" y "D" al mismo tiempo
    Then P1 solo se mueve en una dirección cardinal
    And no hay desplazamiento diagonal

  Scenario: Colisiones con límites del mapa
    When P1 intenta salir del mapa por cualquier borde
    Then P1 no puede traspasar el límite
    And P1 permanece dentro del área jugable

  Scenario: Colisiones con materiales sólidos
    When P1 colisiona con ladrillo, acero o la base del águila
    Then P1 no puede atravesarlos
    And su posición se ajusta para evitar solapamiento

  Scenario: Interacción con agua y arbustos
    When P1 intenta moverse sobre agua
    Then P1 no puede entrar en el azulejo de agua
    When P1 se mueve sobre arbustos
    Then P1 puede atravesarlos sin bloqueo

  Scenario: Rendimiento mínimo durante movimiento
    When P1 se mueve continuamente por 10 segundos
    Then el framerate se mantiene al menos 30 FPS
    And esto se cumple en Chrome, Firefox y Safari de escritorio

  Scenario: Restricciones de plataforma y entrada
    Then no se requiere audio
    And la entrada es únicamente por teclado
    And Microsoft Edge y dispositivos móviles no están soportados
```
Definición de hecho (DoD):
- WASD mueve P1 en 4 direcciones, sin diagonales, con colisiones correctas.
- Agua bloquea, arbusto no; ladrillo/acero/base bloquean.
- Probado en Chrome/Firefox/Safari desktop; solo teclado; sin audio.
- ≥ 30 FPS sostenidos durante movimiento.
Estimación: 2 puntos

## US-04 — P2 se mueve con Flechas

Descripción: Como jugador 2, quiero moverme con las Flechas para controlar mi tanque en 4 direcciones.
Prioridad: Alta
Dependencias: Sistema de input teclado, física/colisiones, mapa/materiales, cámara/HUD.
Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: Movimiento de P2 con Flechas
  Como jugador 2
  Quiero moverme con las Flechas
  Para controlar mi tanque en 4 direcciones

  Background:
    Given el juego está en el "Nivel 1"
    And P2 está en su punto de aparición

  Scenario: Movimiento básico en 4 direcciones
    When mantengo presionada "Flecha Arriba"
    Then P2 se mueve hacia arriba a velocidad constante
    When mantengo presionada "Flecha Izquierda"
    Then P2 se mueve hacia la izquierda a velocidad constante
    When mantengo presionada "Flecha Abajo"
    Then P2 se mueve hacia abajo a velocidad constante
    When mantengo presionada "Flecha Derecha"
    Then P2 se mueve hacia la derecha a velocidad constante

  Scenario: Detenerse al soltar la tecla
    Given P2 se está moviendo con "Flecha Derecha"
    When suelto "Flecha Derecha"
    Then P2 se detiene sin inercia

  Scenario: Sin movimiento diagonal
    When presiono "Flecha Arriba" y "Flecha Derecha" al mismo tiempo
    Then P2 solo se mueve en una dirección cardinal
    And no hay desplazamiento diagonal

  Scenario: Colisiones con límites del mapa
    When P2 intenta salir del mapa por cualquier borde
    Then P2 no puede traspasar el límite
    And permanece dentro del área jugable

  Scenario: Colisiones con materiales sólidos
    When P2 colisiona con ladrillo, acero o la base del águila
    Then P2 no puede atravesarlos
    And su posición se ajusta para evitar solapamiento

  Scenario: Interacción con agua y arbustos
    When P2 intenta moverse sobre agua
    Then P2 no puede entrar en el azulejo de agua
    When P2 se mueve sobre arbustos
    Then puede atravesarlos sin bloqueo

  Scenario: Rendimiento mínimo durante movimiento
    When P2 se mueve continuamente por 10 segundos
    Then el framerate se mantiene al menos 30 FPS
    And esto se cumple en Chrome, Firefox y Safari de escritorio

  Scenario: Restricciones de plataforma y entrada
    Then no se requiere audio
    And la entrada es únicamente por teclado
    And Microsoft Edge y dispositivos móviles no están soportados
```
Definición de hecho (DoD):
- Flechas mueven P2 en 4 direcciones, sin diagonales, con colisiones correctas.
- Agua bloquea; arbusto no; ladrillo/acero/base bloquean.
- Probado en Chrome/Firefox/Safari desktop; solo teclado; sin audio.
- ≥ 30 FPS sostenidos durante movimiento.
Estimación: 2 puntos

## US-05 — Disparar con V/L con 1 proyectil activo

Descripción: Como jugador, quiero disparar con V (P1) o L (P2) y restringir a 1 proyectil activo por jugador para mantener el balance.
Prioridad: Alta
Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: Disparo con V/L y restricción de 1 proyectil por jugador
  Como jugador
  Quiero disparar con V (P1) o L (P2)
  Para atacar enemigos manteniendo 1 proyectil activo por jugador

  Background:
    Given el juego está en el "Nivel 1"

  Scenario: P1 dispara con V
    Given P1 no tiene proyectil activo
    When presiono "V"
    Then se crea un proyectil de P1 en la boca del cañón y avanza en la dirección actual de P1

  Scenario: P2 dispara con L
    Given P2 no tiene proyectil activo
    When presiono "L"
    Then se crea un proyectil de P2 en la boca del cañón y avanza en la dirección actual de P2

  Scenario: Restricción de 1 proyectil activo por jugador
    Given P1 ya tiene un proyectil activo
    When presiono "V" nuevamente
    Then no se crea un nuevo proyectil
    And el proyectil existente continúa su trayectoria

  Scenario: Impacto en enemigo
    Given hay un enemigo en la trayectoria del proyectil de P1
    When el proyectil impacta al enemigo
    Then el enemigo es eliminado
    And el contador de enemigos restantes disminuye en 1
    And el proyectil se destruye

  Scenario: Friendly fire aturde sin daño
    Given P2 está en la trayectoria del proyectil de P1
    When el proyectil impacta a P2
    Then P2 queda aturdido durante 1.5 a 2 segundos
    And P2 no pierde una vida
    And el proyectil se destruye

  Scenario: Interacción con materiales del mapa
    When el proyectil impacta ladrillo
    Then destruye el ladrillo y el proyectil se destruye
    When el proyectil impacta acero
    Then no lo destruye y el proyectil se destruye
    When el proyectil pasa por arbustos
    Then no se bloquea ni se destruye
    When el proyectil cruza sobre agua
    Then no se bloquea ni se destruye

  Scenario: Límite del mapa
    When el proyectil sale del área jugable
    Then el proyectil se destruye

  Scenario: Rendimiento durante disparos
    When disparo repetidamente manteniendo 1 proyectil activo por jugador por 10 segundos
    Then el framerate se mantiene al menos 30 FPS
    And esto se cumple en Chrome, Firefox y Safari de escritorio

  Scenario: Restricciones de plataforma y entrada
    Then no se requiere audio
    And la entrada es únicamente por teclado
    And Microsoft Edge y dispositivos móviles no están soportados
```
Definición de hecho (DoD):
- P1 dispara con V, P2 con L; máximo 1 proyectil activo por jugador.
- Colisiones: enemigo muere; ladrillo se destruye; acero bloquea; arbusto visual; agua no bloquea bala.
- Despawn al impacto o al salir del mapa.
- Probado en Chrome/Firefox/Safari; solo teclado; sin audio; ≥ 30 FPS.
Estimación: 1 puntos

## US-06 — Destruir ladrillos con disparos
Descripción: Como jugador, quiero destruir bloques de ladrillo con disparos para abrir caminos y crear nuevas rutas.
Prioridad: Media
Dependencias: Colisión proyectil-material, tilemap/materiales, sistema de destrucción/actualización de colisiones, HUD (sin cambios).
Definición de hecho (DoD)
- Un impacto de proyectil destruye solo el bloque de ladrillo alcanzado.
- Se actualizan colisiones del mapa inmediatamente tras la destrucción.
- No afecta a acero, agua ni arbustos.
- Probado en Chrome/Firefox/Safari desktop; ≥ 30 FPS bajo destrucciones repetidas.
Estimación: 2 puntos

Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: Destrucción de ladrillos por proyectiles
  Background:
    Given el juego está en el "Nivel 1"

  Scenario: Impacto destruye ladrillo
    Given hay un bloque de ladrillo frente al cañón
    When un proyectil impacta el ladrillo
    Then el ladrillo se destruye
    And el proyectil se destruye

  Scenario: Varias piezas de ladrillo
    Given hay dos bloques de ladrillo contiguos
    When el proyectil impacta el primero
    Then solo el bloque impactado se destruye
```

## US-07 — Acero bloquea movimiento y disparos
Descripción: Como jugador, quiero que el acero bloquee tanques y proyectiles para generar barreras defensivas.
Prioridad: Media
Dependencias: Física/colisiones tanque-material, colisión proyectil-material, tilemap/materiales.
Definición de hecho (DoD)
- Los tanques no atraviesan acero y los proyectiles se destruyen al impactar acero.
- El acero es indestructible en el MVP.
- Sin solapamientos, rebotes falsos ni jitter en colisiones.
- Probado en Chrome/Firefox/Safari desktop; ≥ 30 FPS.
Estimación: 1 punto

Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: Acero bloquea tanques y proyectiles
  Background:
    Given hay un bloque de acero en el mapa

  Scenario: Bloqueo a tanque
    When P1 intenta avanzar contra el acero
    Then P1 no puede atravesarlo

  Scenario: Bloqueo a proyectil
    When un proyectil impacta el acero
    Then el acero no se destruye
    And el proyectil se destruye
```

## US-08 — Atravesar arbustos (solo visual)
Descripción: Como jugador, quiero atravesar arbustos sin bloqueo para mantener el ritmo de juego.
Prioridad: Baja
Dependencias: Capa visual de arbustos, orden de render, configuración sin colisión en tilemap.
Definición de hecho (DoD)
- Tanques y proyectiles atraviesan arbustos sin bloqueo ni desvío.
- Los arbustos no alteran físicas ni colisiones; son solo visuales.
- Probado en Chrome/Firefox/Safari desktop; ≥ 30 FPS.
Estimación: 1 punto

Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: Arbustos no bloquean
  Background:
    Given hay un arbusto entre P1 y un camino

  Scenario: Tanque atraviesa arbusto
    When P1 avanza hacia el arbusto
    Then P1 lo atraviesa sin bloqueo

  Scenario: Proyectil atraviesa arbusto
    When un proyectil pasa por un arbusto
    Then el proyectil no se bloquea ni se desvía
```

## US-09 — Agua bloquea tanque, no proyectil
Descripción: Como jugador, quiero que el agua bloquee mi tanque pero no las balas para añadir decisiones tácticas.
Prioridad: Media
Dependencias: Colisión tanque-agua, ignorar colisión bala-agua, tilemap/materiales.
Definición de hecho (DoD)
- Los tanques no pueden entrar en tiles de agua; los proyectiles pasan sin bloquearse.
- Sin deslizamientos ni enganches en bordes de agua.
- Probado en Chrome/Firefox/Safari desktop; ≥ 30 FPS.
Estimación: 1 punto
Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: Agua bloquea tanques, no balas
  Background:
    Given hay un azulejo de agua frente a P1

  Scenario: Tanque no entra en agua
    When P1 intenta moverse hacia el agua
    Then P1 no puede entrar al azulejo de agua

  Scenario: Proyectil cruza el agua
    When un proyectil viaja sobre agua
    Then el proyectil no se bloquea
```
## US-10 — Friendly fire aturde 1.5–2 s sin daño
Descripción: Como jugador, quiero que el fuego amigo aturda 1.5–2 s sin daño para fomentar coordinación.
Prioridad: Media
Dependencias: Detección de impactos entre jugadores, estado “aturdido” con temporizador, bloqueo de input, indicador en HUD.
Definición de hecho (DoD)
- Impacto amigo aplica aturdimiento 1.5–2 s y no resta vidas.
- El aturdimiento no se acumula con impactos adicionales.
- HUD indica aturdimiento activo; input de movimiento/disparo deshabilitado mientras dure.
- Probado en Chrome/Firefox/Safari desktop; ≥ 30 FPS con dos jugadores.
Estimación: 2 puntos
Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: Fuego amigo aturde sin dañar
  Background:
    Given P1 y P2 están alineados en la misma fila

  Scenario: Impacto de P1 a P2
    When el proyectil de P1 impacta a P2
    Then P2 queda aturdido durante 1.5 a 2 segundos
    And P2 no pierde una vida
    And el proyectil se destruye

  Scenario: Sin acumulación de aturdimiento
    Given P2 está aturdido
    When otro proyectil impacta a P2
    Then la duración de aturdimiento no se acumula
```

## US-11 — Recibir daño enemigo, perder vida y reaparecer
Descripción: Como jugador, quiero que el daño enemigo me quite una vida y reaparecer para continuar hasta agotarlas.
Prioridad: Alta
Dependencias: Colisión proyectil enemigo-jugador, contador de vidas, lógica de respawn, HUD.
Definición de hecho (DoD)
- Al impacto de proyectil enemigo, se reduce en 1 la vida del jugador impactado.
- El jugador reaparece en su punto de aparición; el estado del nivel se mantiene.
- HUD actualiza el contador de vidas.
- Si vidas llegan a 0, se delega a la lógica de derrota (US-16).
- Probado en Chrome/Firefox/Safari desktop; ≥ 30 FPS.
Estimación: 2 puntos
Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: Daño de enemigo reduce vidas y respawn
  Background:
    Given P1 tiene 3 vidas

  Scenario: Disparo enemigo quita 1 vida
    When un proyectil enemigo impacta a P1
    Then P1 pierde 1 vida
    And el proyectil se destruye

  Scenario: Reaparición tras perder vida
    Given P1 perdió 1 vida
    When el nivel continúa
    Then P1 reaparece en su punto de aparición
    And el HUD actualiza las vidas de P1
```

## US-12 — Reiniciar nivel al perder una vida, hasta agotar 3
Descripción: Como jugador, quiero que el nivel se reinicie al morir consumiendo una vida, hasta agotar mis 3 vidas.
Prioridad: Media
Dependencias: Gestor de estados/recarga de nivel, contador de vidas, preservación del modo (1P/2P), flujo de pantallas.
Definición de hecho (DoD)
- Si el jugador muere con vidas > 0, se reinicia el nivel y se consume 1 vida.
- Se mantiene el modo 1P/2P y la configuración del nivel.
- Con 0 vidas se muestra la Pantalla de Derrota (US-16).
- Probado en Chrome/Firefox/Safari desktop; ≥ 30 FPS en reinicios.
Estimación: 2 puntos
Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: Reinicio de nivel al perder una vida
  Background:
    Given estoy jugando el "Nivel 1"

  Scenario: Reinicio tras muerte de P1 en 1P
    Given P1 pierde su última vida del intento actual
    When se procesa la muerte
    Then el nivel se reinicia manteniendo el modo actual
    And el conteo de vidas de P1 se reduce en 1

  Scenario: Fin de partida al agotar vidas
    Given P1 tiene 0 vidas restantes
    When P1 muere
    Then se muestra la Pantalla de Derrota
```

## US-13 — Pala refuerza base 10–15 s y revierte
Descripción: Como jugador, quiero usar la Pala para reforzar temporalmente la base y que luego revierta.
Prioridad: Media
Dependencias: Sistema de power-ups, temporizador, modificación temporal de tiles alrededor de la base, HUD indicador.
Definición de hecho (DoD)
- Al recoger Pala, los bloques alrededor de la base se convierten a acero inmediatamente.
- Temporizador de 10–15 s; al expirar, los bloques vuelven a su material original.
- HUD muestra Pala activa y se desactiva al expirar.
- La reversión ocurre también al cambiar/reiniciar nivel.
- Probado en Chrome/Firefox/Safari desktop; ≥ 30 FPS.
Estimación: 2 puntos
Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: Pala refuerza temporalmente la base
  Background:
    Given hay un power-up "Pala" en el mapa

  Scenario: Recolección aplica refuerzo
    When P1 recoge la "Pala"
    Then los bloques alrededor de la base se convierten en acero
    And se inicia un temporizador de 10 a 15 segundos
    And el HUD indica "Pala" activa

  Scenario: Expiración revierte refuerzo
    Given el refuerzo está activo
    When el temporizador expira
    Then los bloques vuelven a su material original
    And el HUD deja de mostrar "Pala"
```

## US-14 — Vida Extra suma +1 vida
Descripción: Como jugador, quiero recoger Vida Extra para aumentar mis vidas en +1.
Prioridad: Baja
Dependencias: Sistema de power-ups, contador de vidas, HUD.
Definición de hecho (DoD)
- Al recoger, aumenta en 1 la vida del jugador que lo toma.
- HUD refleja el nuevo total de vidas.
- Sin límite superior definido en el MVP.
- Probado en Chrome/Firefox/Safari desktop; ≥ 30 FPS.
Estimación: 1 punto
Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: Vida Extra incrementa vidas del jugador
  Background:
    Given hay un power-up "Vida Extra" en el mapa

  Scenario: Recolección otorga una vida
    When P2 recoge "Vida Extra"
    Then las vidas de P2 aumentan en 1
    And el HUD actualiza las vidas de P2
```

## US-15 — Generar enemigos L1=15, L2=25, L3=35; máx. 4; spawns arriba; IA básica
Descripción: Como sistema, quiero gestionar la reserva y aparición de enemigos por nivel con un máximo de 4 simultáneos y spawns superiores.
Prioridad: Alta
Dependencias: Gestor de spawns/oleadas, puntos de spawn, IA básica de movimiento/disparo, contador de reserva, HUD de enemigos restantes.
Definición de hecho (DoD)
- Nunca hay más de 4 enemigos activos simultáneamente.
- Al destruir un enemigo y existir reserva, aparece otro desde un spawn superior.
- Reserva por nivel: 15 (L1), 25 (L2), 35 (L3); HUD sincronizado.
- Mantiene ≥ 30 FPS con 4 enemigos activos.
Estimación: 3 puntos
Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: Spawns e IA básica de enemigos
  Background:
    Given estoy en un nivel con spawns superiores

  Scenario: Reserva y simultáneos por nivel
    When inicia el "Nivel 1"
    Then la reserva total de enemigos es 15
    And hay un máximo de 4 enemigos simultáneos

  Scenario: Avance de reserva
    Given un enemigo es destruido
    When hay menos de 4 enemigos activos y quedan en reserva
    Then aparece un nuevo enemigo desde un punto de spawn superior

  Scenario: Conteos por nivel
    When inicia el "Nivel 2"
    Then la reserva total de enemigos es 25
    When inicia el "Nivel 3"
    Then la reserva total de enemigos es 35
```

## US-16 — HUD y pantallas de Victoria/Derrota
Descripción: Como jugador, quiero un HUD claro y pantallas de Victoria/Derrota con opciones de Reiniciar/Salir navegables por teclado.
Prioridad: Alta
Dependencias: Sistema UI/HUD, integración con estado de juego, gestor de entrada de teclado para UI.
Definición de hecho (DoD)
- HUD muestra: vidas P1/P2, enemigos restantes, número de nivel, estado de Pala e indicador de aturdimiento.
- Pantallas de Victoria/Derrota aparecen con sus condiciones y permiten Reiniciar/Salir con teclado.
- Al Reiniciar, vuelve al Nivel 1 manteniendo el modo (1P/2P).
- Probado en Chrome/Firefox/Safari desktop.
Estimación: 2 puntos
Criterios de aceptación (BDD — Gherkin):
```gherkin
Feature: HUD y pantallas de resultado
  Background:
    Given el juego está en curso

  Scenario: HUD muestra estado
    Then el HUD muestra vidas de P1 y P2
    And muestra enemigos restantes y el número de nivel
    And muestra si "Pala" está activa
    And muestra estado de aturdimiento cuando aplica

  Scenario: Victoria
    Given la reserva de enemigos llega a 0
    And la Base del Águila está intacta
    When el último enemigo es destruido
    Then se muestra la Pantalla de Victoria con opciones "Reiniciar" y "Salir"

  Scenario: Derrota por base destruida
    Given la Base del Águila es destruida
    Then se muestra la Pantalla de Derrota con opciones "Reiniciar" y "Salir"

  Scenario: Navegación por teclado en pantallas
    When navego con Tab/Shift+Tab o Flechas
    And confirmo con Enter
    Then puedo activar "Reiniciar" o "Salir"
```