# Task Breakdown — Enemy Spawning & AI (US-15)

**Status:** PHASE 2 (Generated after `/approve design`)  
**Ready for implementation with `/implement <TASK_ID>`**

---

## Task List

### ENEMY-1 — Domain: Enemy Entity
**Description:** Create `Enemy` entity that extends/mirrors the `Tank` entity with additional properties for enemy-specific behavior (type, targeting, timers).

**Acceptance Criteria:**
- Enemy entity has properties: `id`, `position`, `direction`, `speed`, `isAlive`, `type`, `isPlayer=false`
- Property `type` supports 'regular' (70% speed) and 'fast' (100% speed)
- Speed calculation: regular=84 (0.7*120), fast=120 (1.0*120)
- Properties for AI state: `targetPriority`, `lastShotTime`, `lastDirectionChangeTime`, `directionChangeInterval`
- Method `_randomInterval(min, max)` generates random time intervals
- Constructor initializes all properties with sensible defaults
- Unit tests verify enemy creation with both types
- Unit tests verify speed calculation for regular vs fast enemies

**Effort:** S  
**Status:** ✅ Completed
**Files/Modules:** `/src/domain/entities/Enemy.js`, `/tests/unit/enemy/enemy.test.js`

---

### ENEMY-2 — Domain: SpawnManager Service
**Description:** Create `SpawnManager` service to manage enemy spawning lifecycle (reserve, active enemies, spawn limits, timing).

**Acceptance Criteria:**
- Properties: `totalReserve`, `remainingReserve`, `activeEnemies[]`, `maxSimultaneous=4`, `spawnPoints[]`, `lastSpawnTime`, `spawnDelay=2000ms`
- Method `canSpawn(currentTime)` returns true if: reserve>0 AND active<4 AND delay elapsed
- Method `getRandomSpawnPoint()` selects random spawn point from array
- Method `spawnEnemy(currentTime)` creates new Enemy, decrements reserve, adds to active list
- Method `removeEnemy(enemyId)` removes enemy from active list
- Method `getRemainingCount()` returns reserve + active count
- Method `_determineEnemyType()` returns 'regular' (75%) or 'fast' (25%)
- Unit tests verify spawn logic, reserve tracking, limit enforcement
- Unit tests verify 2-second spawn delay enforcement
- Unit tests verify enemy type distribution

**Effort:** M  
**Status:** ✅ Completed
**Files/Modules:** `/src/domain/services/SpawnManager.js`, `/tests/unit/enemy/spawnManager.test.js`

---

### ENEMY-3 — Domain: TargetingService
**Description:** Create `TargetingService` with pure functions for direction calculation, alignment detection, and nearest target selection.

**Acceptance Criteria:**
- Method `getDirectionToTarget(source, target)` returns cardinal direction ('up'|'down'|'left'|'right')
- Direction logic: prefer horizontal if |dx|>|dy|, else prefer vertical
- Method `isAlignedWithTarget(enemyPos, basePos, players[])` returns true if same row/column (±32px tolerance)
- Method `getNearestPlayer(enemyPos, players[])` returns nearest player by Euclidean distance
- Helper method `_distance(pos1, pos2)` calculates Euclidean distance
- Unit tests verify direction calculations for all quadrants
- Unit tests verify alignment detection with threshold
- Unit tests verify nearest player selection with multiple players
- No external dependencies (pure functions)

**Effort:** M  
**Status:** ✅ Completed
**Files/Modules:** `/src/domain/services/TargetingService.js`, `/tests/unit/enemy/targetingService.test.js`

---

### ENEMY-4 — Domain: EnemyAI Service
**Description:** Create `EnemyAI` service with behavior logic for decision-making (targeting priority, shooting, direction changes).

**Acceptance Criteria:**
- Constructor accepts `targetingService` dependency
- Property `shootingInterval=3000ms`
- Method `update(enemy, currentTime, gameState)` returns `{ direction, shouldShoot }`
- Shooting logic: if 3s elapsed AND aligned with target → shouldShoot=true, reset timer
- Direction change logic: if 2-4s elapsed → recalculate direction based on priority
- Priority logic: 70% chance → move toward base, 30% chance → move toward nearest player
- Helper method `_randomInterval(min, max)` generates random intervals
- Unit tests verify shooting timer (3s interval)
- Unit tests verify 70/30 priority split (mock random)
- Unit tests verify direction change timer (2-4s intervals)
- Integration test with TargetingService

**Effort:** M  
**Status:** Not started  
**Files/Modules:** `/src/domain/services/EnemyAI.js`, `/tests/unit/enemy/enemyAI.test.js`

---

### ENEMY-5 — Application: Port Interfaces (ISpawnManager, IAI, IEnemyRenderer)
**Description:** Define port interfaces for spawn management, AI behavior, and enemy rendering with JSDoc type annotations.

**Acceptance Criteria:**
- `ISpawnManager` interface documented:
  - `canSpawn(currentTime: number): boolean`
  - `spawnEnemy(currentTime: number): Enemy | null`
  - `removeEnemy(enemyId: string): void`
  - `getRemainingCount(): number`
  - `getActiveEnemies(): Enemy[]`
- `IAI` interface documented:
  - `update(enemy: Enemy, currentTime: number, gameState: object): { direction: string, shouldShoot: boolean }`
- `IEnemyRenderer` interface documented:
  - `createEnemy(enemy: Enemy): void`
  - `updateEnemy(enemy: Enemy, direction: string, velocity: {x, y}): void`
  - `removeEnemy(enemyId: string): void`
- JSDoc comments include parameter types and return types
- Interfaces exported for adapter implementations

**Effort:** S  
**Status:** Not started  
**Files/Modules:** `/src/application/ports/ISpawnManager.js`, `/src/application/ports/IAI.js`, `/src/application/ports/IEnemyRenderer.js`

---

### ENEMY-6 — Application: SpawnEnemy Use Case
**Description:** Implement `SpawnEnemy` use case that orchestrates enemy spawning through spawn manager, renderer, and physics ports.

**Acceptance Criteria:**
- Constructor accepts dependencies: `spawnManager`, `enemyRenderer`, `physicsPort`
- Method `execute(currentTime)` returns spawned Enemy or null
- Calls `spawnManager.spawnEnemy(currentTime)` to get new enemy
- If enemy created: calls `enemyRenderer.createEnemy(enemy)` and `physicsPort.enableBody(enemyId, position)`
- Returns spawned enemy instance or null
- Unit tests verify spawning flow and port calls
- Unit tests verify null return when spawn conditions not met
- No direct Phaser dependencies (uses ports)

**Effort:** S  
**Status:** Not started  
**Files/Modules:** `/src/application/use-cases/SpawnEnemy.js`, `/tests/unit/enemy/spawnEnemy.test.js`

---

### ENEMY-7 — Application: UpdateEnemyAI Use Case
**Description:** Implement `UpdateEnemyAI` use case that orchestrates AI decision-making, movement updates, and shooting through ports.

**Acceptance Criteria:**
- Constructor accepts dependencies: `enemyAI`, `movementService`, `enemyRenderer`, `projectileSystem`
- Method `execute(enemy, currentTime, gameState)` updates enemy behavior
- Calls `enemyAI.update()` to get decisions
- Calculates velocity using `movementService.calculateVelocity()`
- Calls `enemyRenderer.updateEnemy()` with direction and velocity
- If `shouldShoot=true`: calls `projectileSystem.fireProjectile()`
- Unit tests verify AI → movement → rendering flow
- Unit tests verify shooting trigger
- No direct Phaser dependencies (uses ports)

**Effort:** M  
**Status:** Not started  
**Files/Modules:** `/src/application/use-cases/UpdateEnemyAI.js`, `/tests/unit/enemy/updateEnemyAI.test.js`

---

### ENEMY-8 — Application: DestroyEnemy Use Case
**Description:** Implement `DestroyEnemy` use case that handles enemy destruction and cleanup through spawn manager, renderer, physics, and HUD ports.

**Acceptance Criteria:**
- Constructor accepts dependencies: `spawnManager`, `enemyRenderer`, `physicsPort`, `hudPort`
- Method `execute(enemyId)` removes enemy from game
- Calls `spawnManager.removeEnemy(enemyId)` to update active list
- Calls `enemyRenderer.removeEnemy(enemyId)` to remove sprite
- Calls `physicsPort.disableBody(enemyId)` to cleanup physics
- Calls `hudPort.updateEnemiesRemaining()` with new count
- Unit tests verify cleanup flow and port calls
- No direct Phaser dependencies (uses ports)

**Effort:** S  
**Status:** Not started  
**Files/Modules:** `/src/application/use-cases/DestroyEnemy.js`, `/tests/unit/enemy/destroyEnemy.test.js`

---

### ENEMY-9 — Adapter: EnemySpriteAdapter
**Description:** Implement `EnemySpriteAdapter` that wraps Phaser sprite rendering for enemies and implements `IEnemyRenderer` interface.

**Acceptance Criteria:**
- Implements `IEnemyRenderer` interface
- Constructor accepts Phaser scene and sprite registry
- `createEnemy(enemy)` creates Phaser sprite at spawn position, adds to registry
- `updateEnemy(enemy, direction, velocity)` updates sprite rotation and physics velocity
- `removeEnemy(enemyId)` destroys sprite and removes from registry
- Uses placeholder sprite (colored rectangle or circle) if no texture available
- Enemy sprites visually distinct from player sprites (different color)
- Integration test with Phaser scene

**Effort:** M  
**Status:** Not started  
**Files/Modules:** `/src/adapters/rendering/EnemySpriteAdapter.js`, `/tests/integration/enemy/enemySpriteAdapter.test.js`

---

### ENEMY-10 — Infrastructure: GameScene Enemy Integration
**Description:** Integrate enemy spawning and AI into `GameScene.js` update loop with initialization, spawning, AI updates, and collision handling.

**Acceptance Criteria:**
- In `create()`: initialize SpawnManager with level config (enemyCount, spawnPoints)
- In `create()`: instantiate EnemyAI, TargetingService, use cases
- In `update()`: call SpawnEnemy use case every frame
- In `update()`: iterate active enemies and call UpdateEnemyAI use case
- Collision setup: enemy-to-wall, enemy-to-water, enemy-to-player (blocking)
- HUD displays "Enemies Remaining: X" synchronized with SpawnManager
- Level config includes spawn points: `[{x:100,y:50},{x:300,y:50},{x:500,y:50},{x:700,y:50}]`
- Integration test verifies enemy spawning in GameScene
- Integration test verifies AI behavior (movement, shooting)

**Effort:** L  
**Status:** Not started  
**Files/Modules:** `/src/infrastructure/scenes/GameScene.js`, `/tests/integration/enemy/gameSceneEnemy.test.js`

---

### ENEMY-11 — Infrastructure: Spawn Point Configuration
**Description:** Add spawn point configuration to level JSON files with validation and default fallbacks.

**Acceptance Criteria:**
- Level JSON includes `spawnPoints` array: `[{x:100,y:50,id:'SP1'}, ...]`
- LevelJSONRepository loads spawn points from level data
- Default spawn points if missing: 4 points evenly spaced across top edge (y=50)
- Validation: spawn points must be within map bounds
- Unit tests verify spawn point loading from JSON
- Unit tests verify default fallback behavior

**Effort:** S  
**Status:** Not started  
**Files/Modules:** `/src/adapters/repositories/LevelJSONRepository.js`, `/tests/unit/enemy/levelConfig.test.js`

---

### ENEMY-12 — Infrastructure: HUD Enemies Remaining Counter
**Description:** Add "Enemies Remaining" counter to HUD that updates as enemies spawn and are destroyed.

**Acceptance Criteria:**
- HUDAdapter method `updateEnemiesRemaining(count)` updates text display
- Display format: "Enemies: X" where X = reserve + active
- Counter positioned in top-right or top-center of screen
- Counter updates immediately on enemy spawn/destruction
- ES6 module exports (no CommonJS)
- Integration test verifies HUD updates on spawn/destroy events

**Effort:** S  
**Status:** Not started  
**Files/Modules:** `/src/adapters/hud/HUDAdapter.js`, `/tests/integration/enemy/hudEnemyCounter.test.js`

---

### ENEMY-13 — Testing: Unit Tests Suite
**Description:** Create comprehensive unit test suite covering all domain entities and services with 100% code coverage.

**Acceptance Criteria:**
- Enemy entity tests (creation, type, speed, state)
- SpawnManager tests (spawning, limits, reserve tracking, delay)
- TargetingService tests (direction, alignment, nearest player)
- EnemyAI tests (shooting timer, priority split, direction changes)
- Use case tests (SpawnEnemy, UpdateEnemyAI, DestroyEnemy)
- All tests pass with 100% success rate
- Code coverage ≥90% for domain/application layers
- Use Jest or Vitest framework (matching existing tests)

**Effort:** M  
**Status:** Not started  
**Files/Modules:** `/tests/unit/enemy/*.test.js`

---

### ENEMY-14 — Testing: Integration Tests Suite
**Description:** Create integration tests for enemy spawning flow, AI behavior, collision detection, and HUD synchronization.

**Acceptance Criteria:**
- Test: Enemy spawns from random spawn point with 2s delay
- Test: Max 4 simultaneous enemies enforced
- Test: Enemy AI moves toward base (70% priority verified)
- Test: Enemy shoots when aligned with player/base
- Test: Enemy collision with walls/water blocks movement
- Test: Enemy destruction updates HUD counter
- Test: Reserve → active → destroyed → respawn flow
- All tests pass with 100% success rate
- Use Phaser test environment (headless or mock)

**Effort:** L  
**Status:** Not started  
**Files/Modules:** `/tests/integration/enemy/*.test.js`

---

### ENEMY-15 — Testing: Performance QA
**Description:** Create performance test suite to verify ≥30 FPS with 4 enemies + 2 players active and measure input latency.

**Acceptance Criteria:**
- Performance test script measures FPS over 10-second period
- Test scenario: 4 enemies + 2 players moving + shooting simultaneously
- FPS threshold: ≥30 FPS sustained (no drops below 25 FPS)
- Input latency: <100ms from keypress to tank movement
- Performance report generated with statistics (avg FPS, min FPS, max FPS)
- Test runs in Chrome, Firefox, Safari (desktop)
- Performance test fails if thresholds not met
- Reuse existing performance tooling from MOVE-13

**Effort:** M  
**Status:** Not started  
**Files/Modules:** `/tests/qa/enemy-performance.test.js`, `/tests/qa/ENEMY-15-checklist.md`

---

### ENEMY-16 — Demo: Enemy Spawning Demo Page
**Description:** Create standalone demo page showcasing enemy spawning, AI behavior, and player interaction in isolation.

**Acceptance Criteria:**
- Demo page at `/demos/enemy.html` loads successfully
- Demo initializes GameScene with 4 spawn points
- Demo spawns enemies with visual feedback (different colors for regular/fast)
- Demo shows AI behavior: movement toward center (mock base), random direction changes
- Demo includes on-screen debug info: active count, reserve count, spawn timer
- Demo includes P1 controls (WASD) for testing enemy-player interaction
- Demo uses modern CSS matching `/demos/styles.css`
- ES6 module imports (no CommonJS)
- Demo verified in Chrome, Firefox, Safari

**Effort:** M  
**Status:** Not started  
**Files/Modules:** `/demos/enemy.html`, `/demos/enemy.js`

---

## Implementation Order (Recommended)

**Phase 1: Domain Layer (Pure Logic)**
1. ENEMY-1 → ENEMY-2 → ENEMY-3 → ENEMY-4

**Phase 2: Application Layer (Use Cases & Ports)**
2. ENEMY-5 → ENEMY-6 → ENEMY-7 → ENEMY-8

**Phase 3: Adapters & Infrastructure**
3. ENEMY-9 → ENEMY-11 → ENEMY-12 → ENEMY-10

**Phase 4: Testing & Demo**
4. ENEMY-13 → ENEMY-14 → ENEMY-15 → ENEMY-16

---

## Summary

- **Total Tasks:** 16
- **Estimated Effort:** 2 Small, 8 Medium, 2 Large = ~12-15 story points
- **Critical Path:** ENEMY-1 → ENEMY-2 → ENEMY-4 → ENEMY-7 → ENEMY-10 → ENEMY-14
- **Dependencies:** Requires existing Tank entity, MovementService, GameScene, collision system
- **Risk Areas:** Performance (ENEMY-15), AI behavior tuning (ENEMY-4), spawn point validation (ENEMY-11)

---

**Next Steps:**
- User selects a task ID and runs `/implement <TASK_ID>` (e.g., `/implement ENEMY-1`)
- Kiro-Lite will implement only that task, show diffs, tests, and pause with `/review complete`
