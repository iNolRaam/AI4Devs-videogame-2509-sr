# 🎮 GDD – Proyecto “Tank Defender MVP”
*Inspirado en Battle City / Tank 1990*  

---

## 1. Visión General del Juego
**Tank Defender** es un juego de acción y estrategia en vista cenital donde 1 o 2 jugadores controlan tanques para defender la **Base del Águila**. El objetivo es eliminar todos los tanques enemigos del nivel mientras se protege la base y se gestionan movimientos tácticos en un mapa con obstáculos destructibles, indestructibles y elementos visuales.

---

## 2. Plataformas Objetivo
- PC (Windows/Mac/Linux)
- Controles: Teclado / Gamepad

---

## 3. Objetivo Principal del Juego
- Defender la **Base del Águila**.
- Eliminar todos los tanques enemigos del nivel.
- Mantenerse con vida con el número limitado de vidas.

---

## 4. Condiciones de Victoria
- Derrotar a todos los enemigos del nivel actual.
- La Base del Águila permanece intacta.

---

## 5. Condiciones de Derrota
- La Base del Águila es destruida.
- El jugador pierde todas sus vidas (cada jugador inicia con **3 vidas**).

---

## 6. Jugadores
### 6.1 Número de jugadores
- 1 o 2 jugadores cooperativos.

### 6.2 Vidas
- Cada jugador inicia con **3 vidas**.

### 6.3 Colores de los jugadores
- Jugador 1: **Amarillo**
- Jugador 2: **Verde**

### 6.4 Friendly Fire
- Los jugadores pueden impactarse entre sí.
- Al recibir un disparo de un compañero:
  - El jugador queda **aturdido por 1.5–2 segundos**.
  - No recibe daño.
  - No pierde vidas.

---

## 7. Controles
### Jugador 1
- W → arriba  
- A → izquierda  
- S → abajo  
- D → derecha  
- V → disparar  

### Jugador 2
- Flecha arriba → arriba  
- Flecha izquierda → izquierda  
- Flecha abajo → abajo  
- Flecha derecha → derecha  
- L → disparar 

---

## 8. Mecánicas de Juego
### 8.1 Movimiento
- Movimiento en 4 direcciones.
- Velocidad estándar.
- Colisiones sólidas con tanques, ladrillos, acero y la base.

### 8.2 Disparo
- 1 proyectil en pantalla por jugador.
- Los disparos destruyen ladrillos.
- El acero es indestructible.

### 8.3 Respawn de jugadores
- Tras morir, el jugador reaparece en una zona segura.
- Cada reaparición consume 1 vida.

---

## 9. Tipos de Materiales del Escenario
*(Solo los seleccionados para esta versión MVP)*

### 1. Ladrillo
- Destructible con 1 disparo.
- Se usa para caminos y proteger la base.

### 2. Acero
- Indestructible.
- Bloquea movimiento y disparos.

### 3. Arbustos
- Los tanques y los disparos pueden atravesarlos.
- Ocultan visualmente al tanque.

### 4. Base del Águila
- Elemento crítico del nivel.
- Si es destruido → fin de la partida.
- Protegido inicialmente por ladrillos.

### 5. Agua
- Los tanques no pueden atravesarla.
- Los proyectiles sí.

---

## 10. Enemigos
### Tipos disponibles
1. **Tanque básico**
   - Lento.
   - 1 impacto para destruirlo.

2. **Tanque rápido**
   - Mayor velocidad.
   - 1 impacto para destruirlo.

3. **Tanque disparo rápido**
   - Alta cadencia de disparo.
   - 1 impacto para destruirlo.

4. **Tanque blindado**
   - Requiere 3 impactos.
   - Mayor agresividad.

### Aparición
- Spawns fijos en la parte superior del mapa.
- Máximo 4 enemigos simultáneos.
- Por cada nivel, generar enemigos:
  - Nivel 1: 15 enemigos  
  - Nivel 2: 25 enemigos  
  - Nivel 3: 35 enemigos

---

## 11. Power-Ups
*(Solo los 2 permitidos en esta versión MVP)*

### 1. Pala / Shovel
- Refuerza temporalmente la Base del Águila.
- Convierte las paredes de ladrillo alrededor de la base en acero.
- Duración: 10–15 segundos.
- Después, las paredes vuelven a ladrillo.

### 2. Vida Extra
- Otorga una vida adicional al jugador que lo recoja.

---

## 12. IA de Enemigos
- Movimiento pseudoaleatorio.
- Tendencia a acercarse a la base.
- Algunos enemigos intentan bloquear al jugador.
- Frecuencia de disparo depende del tipo de enemigo.

---

## 13. HUD
Debe mostrar:
- Vidas de cada jugador.
- Contador de enemigos restantes.
- Nivel actual.
- Power-up activo (Pala).
- Indicador de aturdimiento (cuando aplica).

---

## 14. Progresión
- Cada nivel aumenta dificultad con:
  - Más enemigos rápidos o blindados.
  - Mapas con menos cobertura o más exposiciones.
  - Distribución estratégica de agua y arbustos.

---

## 15. Audio
Sonidos mínimos requeridos:
- Disparo.
- Impacto.
- Destrucción.
- Recolección de power-up.
- Música del nivel.

---

## 16. Estilo Visual
- Pixel art estilo 8-bit NES.
- Paleta simple.
- Animaciones básicas para tanques y explosiones.

---

## 17. Mapa
- Rejilla de **26x26 celdas**.
- Base del Águila en la parte inferior central.
- Spawns de enemigos en la parte superior.
- Spawns de jugadores:
  - P1: inferior izquierda.
  - P2: inferior derecha.

---

## 18. Parámetros Clave (MVP)
- 3 vidas por jugador.
- 2 power-ups: **Pala** y **Vida Extra**.
- Friendly fire → **aturdimiento**, no daño.
- Elementos de escenario limitados a 5 tipos.

---
