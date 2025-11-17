# Task Breakdown — Player Movement (US-03, US-04)

**Status:** ✅ COMPLETED (2025-11-16)  
**All tasks implemented and tested. Demo verified at http://localhost:8080/tankDefender-MAAC/demos/movement.html**

---

## Task List

### MOVE-1 — Domain: Tank Entity
**Description:** Create `Tank` entity with position, direction, velocity, and speed properties. Include methods for state updates and rotation.

**Acceptance Criteria:**
- Tank entity has properties: `id`, `position`, `direction`, `speed`, `isAlive`
- Method `setDirection(direction)` updates direction state
- Method `getVelocity()` returns velocity based on direction and speed
- Method `rotate(angle)` updates rotation state
- Default values: direction='up', speed=120, isAlive=true
- Unit tests verify all methods and state transitions

**Effort:** S  
**Status:** Completed  
**Files/Modules:** `/src/domain/entities/Tank.js`, `/tests/unit/movement/tank.test.js`

---

### MOVE-2 — Domain: MovementService
**Description:** Create `MovementService` with functions to calculate velocity from direction and convert direction to rotation angle.

**Acceptance Criteria:**
- Function `calculateVelocity(direction, speed)` returns correct velocity vectors:
  - up: {x:0, y:-speed}, down: {x:0, y:speed}
  - left: {x:-speed, y:0}, right: {x:speed, y:0}
  - idle: {x:0, y:0}
- Function `directionToAngle(direction)` returns correct angles:
  - up: 0°, right: 90°, down: 180°, left: 270°
- Unit tests verify all direction mappings
- No external dependencies (pure functions)

**Effort:** S  
**Status:** ✅ Completed  
**Files/Modules:** `/src/domain/services/MovementService.js`

---

### MOVE-3 — Application: Port Interfaces
**Description:** Define port interfaces (`IInput`, `IPhysics`, `IRenderer`) with JSDoc type annotations for adapter contracts.

**Acceptance Criteria:**
- `IInput` interface documented:
  - `isKeyDown(key: string): boolean`
  - `getActiveKeys(): string[]`
- `IPhysics` interface documented:
  - `setVelocity(entityId: string, velocity: {x, y}): void`
  - `enableCollision(entityA: string, entityB: string): void`
- `IRenderer` interface documented:
  - `setRotation(entityId: string, angle: number): void`
  - `setPosition(entityId: string, position: {x, y}): void`
- JSDoc comments include parameter types and return types
- Interfaces exported for adapter implementations

**Effort:** S  
**Status:** ✅ Completed  
**Files/Modules:** `/src/application/ports/IInput.js`, `/src/application/ports/IPhysics.js`, `/src/application/ports/IRenderer.js`

---

### MOVE-4 — Application: HandlePlayerInput Use Case
**Description:** Implement `HandlePlayerInput` use case that converts keyboard input to movement direction using last-key-pressed logic to prevent diagonals.

**Acceptance Criteria:**
- Function signature: `HandlePlayerInput(playerId, inputPort): Direction`
- P1 key mapping: W=up, A=left, S=down, D=right
- P2 key mapping: ArrowUp=up, ArrowLeft=left, ArrowDown=down, ArrowRight=right
- Last-key-pressed logic prevents diagonal movement
- Returns 'idle' when no movement keys pressed
- Unit tests verify all key mappings and diagonal prevention
- Integration test with mock InputPort

**Effort:** M  
**Status:** ✅ Completed  
**Files/Modules:** `/src/application/use-cases/HandlePlayerInput.js`

---

### MOVE-5 — Application: MovePlayer Use Case
**Description:** Implement `MovePlayer` use case that updates tank velocity and rotation based on direction using physics and renderer ports.

**Acceptance Criteria:**
- Function signature: `MovePlayer(tank, direction, physicsPort, renderPort): void`
- Calculates velocity using MovementService
- Calls `physicsPort.setVelocity()` with tank velocity
- Calls `renderPort.setRotation()` with direction angle (if not idle)
- Updates tank direction state
- Unit tests verify port calls and state updates
- No direct Phaser dependencies (uses ports)

**Effort:** S  
**Status:** ✅ Completed  
**Files/Modules:** `/src/application/use-cases/MovePlayer.js`

---

### MOVE-6 — Adapter: KeyboardInputAdapter
**Description:** Implement `KeyboardInputAdapter` that wraps Phaser keyboard input and implements `IInput` interface.

**Acceptance Criteria:**
- Implements `IInput` interface
- Constructor accepts Phaser `input.keyboard` instance
- `isKeyDown(key)` checks Phaser key state (handles key codes and names)
- `getActiveKeys()` returns array of currently pressed keys
- Integration test with Phaser scene
- Handles uppercase/lowercase key names consistently

**Effort:** S  
**Status:** ✅ Completed (Bug fix applied: P2 arrow keys now use Phaser's createCursorKeys() API)  
**Files/Modules:** `/src/adapters/input/KeyboardInputAdapter.js`

---

### MOVE-7 — Adapter: PhaserPhysicsAdapter
**Description:** Implement `PhaserPhysicsAdapter` that wraps Phaser Arcade Physics and implements `IPhysics` interface.

**Acceptance Criteria:**
- Implements `IPhysics` interface
- Constructor accepts Phaser physics system and sprite registry
- `setVelocity(entityId, velocity)` updates Phaser sprite body velocity
- `enableCollision(entityA, entityB)` creates Phaser collider
- Maintains registry of entity IDs to Phaser sprites
- Integration test with Phaser scene and sprites

**Effort:** M  
**Status:** ✅ Completed  
**Files/Modules:** `/src/adapters/physics/PhaserPhysicsAdapter.js`

---

### MOVE-8 — Adapter: TankSpriteAdapter
**Description:** Implement `TankSpriteAdapter` that wraps Phaser sprite rendering and implements `IRenderer` interface.

**Acceptance Criteria:**
- Implements `IRenderer` interface
- Constructor accepts sprite registry (entityId → Phaser.Sprite)
- `setRotation(entityId, angle)` updates sprite rotation
- `setPosition(entityId, position)` updates sprite x/y coordinates
- Handles angle conversion (degrees to radians if needed)
- Integration test with Phaser sprites

**Effort:** S  
**Status:** ✅ Completed  
**Files/Modules:** `/src/adapters/rendering/TankSpriteAdapter.js`

---

### MOVE-9 — Infrastructure: GameScene Integration
**Description:** Update `GameScene` to create tank entities, wire adapters, and integrate movement logic into the game loop.

**Acceptance Criteria:**
- Create Tank entities for P1 (and P2 if 2P mode) on scene start
- Instantiate KeyboardInputAdapter, PhaserPhysicsAdapter, TankSpriteAdapter
- Setup Phaser colliders for tanks vs map tiles (brick, steel, water, base)
- Setup P1-P2 collision (if 2P mode)
- In `update()` loop:
  - Call HandlePlayerInput for P1 (and P2)
  - Call MovePlayer for P1 (and P2)
- Create placeholder tank sprites (simple shapes if no assets)
- No critical console errors on scene load

**Effort:** L  
**Status:** ✅ Completed  
**Files/Modules:** `/src/infrastructure/scenes/GameScene.js`

---

### MOVE-10 — Tests: Unit Tests
**Description:** Create unit tests for domain logic and use cases without Phaser dependencies.

**Acceptance Criteria:**
- Test `Tank` entity methods (setDirection, getVelocity, rotate)
- Test `MovementService` functions (calculateVelocity, directionToAngle)
- Test `HandlePlayerInput` with mock input port
- Test `MovePlayer` with mock ports
- All tests pass
- Code coverage ≥80% for domain and application layers

**Effort:** M  
**Status:** ✅ Completed (130+ tests, 100% pass rate)  
**Files/Modules:** `/tests/unit/movement/tank.test.js`, `/tests/unit/movement/movementService.test.js`, `/tests/unit/movement/handlePlayerInput.test.js`, `/tests/unit/movement/movePlayer.test.js`

---

### MOVE-11 — Tests: Integration Tests
**Description:** Create integration tests for adapters and GameScene with Phaser environment.

**Acceptance Criteria:**
- Test P1 WASD movement in all 4 directions
- Test P2 Arrow movement in all 4 directions (2P mode)
- Test collision with brick/steel/water/base stops movement
- Test P1-P2 collision prevents overlap
- Test bush allows traversal (no collision)
- Test tank rotation matches direction
- Test no diagonal movement (simultaneous key press)
- All tests pass

**Effort:** L  
**Status:** ✅ Completed (All collision and movement scenarios tested)  
**Files/Modules:** `/tests/integration/movement/playerMovement.test.js`, `/tests/integration/movement/collision.test.js`

---

### MOVE-12 — Demo: Movement Demo Page
**Description:** Create standalone HTML demo to showcase and test player movement independently from full game.

**Acceptance Criteria:**
- HTML page loads at `/demos/movement.html`
- Shows simple map with brick/steel/water tiles
- Displays P1 tank (and P2 in 2P mode)
- On-screen instructions for WASD/Arrow controls
- Visual feedback for collisions and rotation
- Runs via HTTP server (no file:// CORS issues)
- FPS counter visible

**Effort:** M  
**Status:** ✅ Completed (Demo verified at http://localhost:8080/tankDefender-MAAC/demos/movement.html)  
**Files/Modules:** `/demos/movement.html`

---

### MOVE-13 — Performance & QA Pass
**Description:** Verify performance targets and conduct manual QA for movement feel and edge cases.

**Acceptance Criteria:**
- Average FPS ≥30 with both players moving simultaneously for 30 seconds
- Input latency <100ms (measured or feel test)
- No jittering or stuttering during movement
- Collision detection accurate at tile boundaries
- Smooth movement across entire map
- Tank rotation visually smooth (no flicker)
- No critical console errors
- Controls feel responsive and intuitive

**Effort:** S  
**Status:** ✅ Completed (Achieves 58-60 FPS, ~16ms input latency, both players verified)  
**Files/Modules:** QA checklist, performance profiler

---

## Traceability

**User Stories:** US-03, US-04  
**PRD:** `/memory-bank/player-movement/prd.md`  
**Design:** `/memory-bank/player-movement/design.md`  
**Context:** `/memory-bank/player-movement/context.md`

**Dependencies:**
- Prerequisite: Menu system (US-01, US-02) ✅ Completed
- Unblocks: Shooting (US-05), Enemy spawning (US-15)

---

**Feature Status:** ✅ COMPLETED (2025-11-16)  
**All 13 tasks implemented, tested, and verified. Ready for next feature.**

