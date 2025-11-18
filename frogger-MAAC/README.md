# Frogger-MAAC 🐸

Una implementación moderna del clásico juego **Frogger** de Konami (1981), desarrollada con **Phaser 3** y JavaScript. El objetivo es guiar a la rana a través del tráfico y los obstáculos para alcanzar la seguridad en la parte superior de la pantalla.

---

## 📋 Descripción del Proyecto

**Frogger-MAAC** es un clon funcional del juego arcade original que mantiene la mecánica principal: controlar una rana para evitar vehículos en movimiento y llegar a la meta. Este proyecto incluye:

- 🎮 Mecánica de juego interactiva
- 🏆 Sistema de puntuaciones y ranking
- 🎨 Interfaz gráfica moderna con Tailwind CSS
- ⌨️ Controles flexibles (teclado de flechas o WASD)
- 💾 Persistencia de datos en localStorage

---

## 🛠️ Tecnologías Utilizadas

- **JavaScript (ES6+)** - Lógica del juego
- **Phaser 3.60.0** - Motor de juego basado en Canvas/WebGL
- **HTML5** - Estructura del documento
- **CSS3 + Tailwind CSS** - Estilos y diseño responsivo
- **LocalStorage** - Almacenamiento de puntuaciones

---

## 📦 Prerrequisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Python 3.x** (para servir el servidor local)
  - En Windows: Descarga desde [python.org](https://www.python.org/downloads/)
  - En macOS/Linux: Generalmente ya viene preinstalado
  
- **Un navegador web moderno** (Chrome, Firefox, Edge, Safari)

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/iNolRaam/AI4Devs-videogame-2509-sr.git
cd AI4Devs-videogame-2509-sr/frogger-MAAC
```

### 2. Verificar la Estructura del Proyecto

Asegúrate de que los archivos estén en el siguiente orden:

```
frogger-MAAC/
├── index.html          # Página principal
├── main.js             # Lógica de inicialización
├── style.css           # Estilos
├── README.md           # Este archivo
├── img/                # Carpeta de assets
│   ├── frog.png        # Sprite de la rana
│   └── car.webp        # Sprite de los vehículos
└── scenes/             # Carpeta con escenas del juego
    ├── GameScene.js    # Lógica principal del juego
    └── UIScene.js      # Interfaz de usuario
```

---

## ▶️ Ejecución del Juego

### Opción 1: Servidor Python (Recomendado)

```bash
# Navega a la carpeta del proyecto
cd frogger-MAAC

# Inicia el servidor local
python -m http.server 8000
```

Luego abre tu navegador en: **http://localhost:8000**

### Opción 2: Usar un Servidor Web Alternativo

Si prefieres Node.js:
```bash
# Con http-server (instalar si no lo tienes: npm install -g http-server)
http-server
```

---

## 🎮 Controles del Juego

### Movimiento de la Rana

- **Flecha Arriba** o **W** - Mover arriba
- **Flecha Abajo** o **S** - Mover abajo
- **Flecha Izquierda** o **A** - Mover a la izquierda
- **Flecha Derecha** o **D** - Mover a la derecha

### Objetivo del Juego

1. **Inicia el juego** ingresando tus iniciales (3 letras)
2. **Evita los vehículos** mientras te mueves hacia arriba
3. **Llega a la meta** en la parte superior de la pantalla
4. **Maximiza tu puntuación** completando el nivel en el menor tiempo posible
5. **Consulta el ranking** con los "High Scores"

---

## 📊 Sistema de Puntuaciones

- Las puntuaciones se almacenan localmente en tu navegador
- Se registra tu nombre (iniciales) y el tiempo empleado
- El ranking muestra los 3 mejores tiempos
- Los datos se guardan automáticamente en localStorage

---

## 🐛 Solución de Problemas

### Error CORS al cargar imágenes
Si ves un error de "Cross-Origin Request Blocked", asegúrate de:
- Ejecutar el juego mediante un servidor HTTP (no directamente desde `file://`)
- Usar `python -m http.server` o similar

### Las imágenes no se cargan
- Verifica que los archivos `frog.png` y `car.webp` estén en la carpeta `img/`
- Recarga el navegador (Ctrl+F5 o Cmd+Shift+R)
- Abre la consola del navegador (F12) para ver mensajes de error

### El juego funciona lentamente
- Cierra otras pestañas para liberar recursos
- Asegúrate de tener un navegador actualizado
- Intenta con otro navegador

---

## 🎯 Características Implementadas

✅ Movimiento fluido de la rana
✅ Vehículos con velocidades aleatorias
✅ Detección de colisiones
✅ Estados de victoria/derrota
✅ Sistema de puntuaciones persistente
✅ Interfaz intuitiva
✅ Controles duales (flechas + WASD)

---

## 📝 Notas de Desarrollo

- El proyecto fue desarrollado siguiendo las especificaciones del juego clásico Frogger
- Utiliza Phaser 3 como motor de juego principal
- El código está estructurado en escenas reutilizables
- Assets optimizados en WebP y PNG

---

## 👥 Contribuidor

**Desarrollado por:** MAAC Team
**Basado en:** Frogger (Konami, 1981)

---

## 📄 Licencia

Este proyecto es un clon educativo del juego clásico Frogger. Consulta los términos de uso aplicables.

---

¡A jugar! 🎮 Mueve la rana y ¡consigue el mejor tiempo! 🐸
