# Tech Context

_The tech stack, tools, and constraints._

## Technology Stack

### Core Technologies
- **JavaScript ES6+**: Modern JavaScript with ES modules for browser compatibility
- **HTML5 Canvas**: Rendering via Phaser 3 game engine
- **CSS3**: Minimalist styling for menu and HUD components
- **Phaser 3**: Game framework with Arcade Physics engine

### Testing Framework
- **Vitest 4.0.9**: Modern test runner with native ES module support
- **jsdom**: Browser API simulation for integration tests
- **Test Environment**: Node.js with ES module support (`"type": "module"` in package.json)
- **Coverage**: 197 tests across unit, integration, application, and QA layers

### Architecture Patterns
- **Clean Architecture**: Separation of concerns with clear dependency rules
  - **Domain Layer**: Entities (Tank, Enemy), Services (MovementService, SpawnManager)
  - **Application Layer**: Use cases (HandlePlayerInput, MovePlayer), Ports (IInput, IPhysics, IRenderer)
  - **Adapters Layer**: Phaser adapters (KeyboardInputAdapter, PhaserPhysicsAdapter, TankSpriteAdapter)
  - **Infrastructure Layer**: Scenes (MenuScene, GameScene), Config (GameState)

### Code Standards
- **Use Cases**: Class-based architecture with constructor dependency injection and `execute()` methods
- **Direction Constants**: Lowercase strings ('up', 'down', 'left', 'right', 'idle')
- **Module System**: ES6 `import`/`export` for all files
- **Mock Objects**: Full method implementations matching real adapter behavior

### Development Environment
- **Dev Server**: Python HTTP server (`python -m http.server 8080`)
- **Port**: 8080
- **Working Directory**: `tankDefender-MAAC/`
- **Demo URLs**:
  - Menu: `http://localhost:8080/demos/menu.html`
  - Movement: `http://localhost:8080/demos/movement.html`

### Performance Targets
- **Target FPS**: 30 FPS minimum (current: 58-60 FPS)
- **Input Latency**: <100ms (current: ~16ms)
- **Browser Support**: Desktop Chrome, Firefox, Safari
- **Not Supported**: Edge, mobile, touch, gamepad, pause functionality

### Key Technical Decisions
1. **Vitest over Jest**: Native ES module support, faster execution, better browser API mocking
2. **Class-based Use Cases**: Better testability, explicit dependencies, clear instantiation pattern
3. **Lowercase Direction Constants**: Consistency across domain, application, and test layers
4. **jsdom Environment**: Enables integration tests with browser APIs without full browser
5. **Phaser `createCursorKeys()`**: Proper arrow key detection for P2 controls