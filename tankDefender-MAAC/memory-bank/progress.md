# Progress — Tank Defender (MVP)

Date: 2025-06-02

## Updates
- Synchronized Memory Bank with latest PRD (`../prd.md`), GDD (`../gdd.md`) and User Stories (`../user-stories.md`).
- Overhauled `activeContext.md` with consolidated gameplay, platform, and architecture context.
- Aligned rules in `copilot-rules.md` with Kiro‑Lite workflow and sources of truth.
- Created a global backlog in `tasks.md` mapped from User Stories US-01…US-16.
- **Completed `menu-1p-2p-start` feature (2025-11-16)**:
  - MENU-1: GameState with selectedMode persistence ✅
  - MENU-2: Keyboard navigation UI (Arrows/Tab/Enter) ✅
  - MENU-3: StartGame flow to Level 1 ✅
  - MENU-4: Restart preserves mode ✅
  - MENU-5: Unit/integration tests ✅
  - MENU-6: Performance QA tooling ✅
  - Converted all modules to ES6 exports for browser compatibility
  - Created modern minimalist CSS (`/demos/styles.css`)
  - Demo verified at `http://localhost:8080/demos/menu.html`
- **Completed `player-movement` feature (2025-11-16)**:
  - MOVE-1: Tank Entity (Domain) ✅
  - MOVE-2: MovementService (Domain) ✅
  - MOVE-3: Port Interfaces (IInput, IPhysics, IRenderer) ✅
  - MOVE-4: HandlePlayerInput Use Case (Application) ✅
  - MOVE-5: MovePlayer Use Case (Application) ✅
  - MOVE-6: KeyboardInputAdapter (Adapters) ✅ - **Fixed P2 arrow key detection using Phaser's createCursorKeys()**
  - MOVE-7: PhaserPhysicsAdapter (Adapters) ✅
  - MOVE-8: TankSpriteAdapter (Adapters) ✅
  - MOVE-9: GameScene Integration (Infrastructure) ✅
  - MOVE-10: Unit Tests (130+ test cases, 100% pass) ✅
  - MOVE-11: Integration Tests (movement flow + collision) ✅
  - MOVE-12: Movement Demo Page (`/demos/movement.html`) ✅
  - MOVE-13: Performance & QA Pass (≥30 FPS, <100ms latency) ✅
  - Full Clean Architecture implementation (Domain → Application → Adapters → Infrastructure)
  - P1 WASD + P2 Arrow controls with diagonal prevention (both working)
  - Collision detection with world bounds and static walls
  - **Bug Fix:** P2 arrow keys now use Phaser's `createCursorKeys()` API for proper detection
  - Demo verified at `http://localhost:8080/tankDefender-MAAC/demos/movement.html`
- **Completed Vitest Migration (2025-11-16)**:
  - Migrated all 197 tests from Jest to Vitest framework
  - Updated vitest.config.js with jsdom environment for browser API compatibility
  - Fixed all mock implementations (PhaserPhysicsAdapter, MockSprite velocity tracking)
  - Converted use cases to class-based architecture (HandlePlayerInput, MovePlayer)
  - Standardized direction constants to lowercase ('up', 'down', 'left', 'right', 'idle')
  - Enhanced input handling with opposite key cancellation logic
  - Fixed velocity calculations for zero-speed cases
  - Converted integration tests to proper Vitest describe/test structure
  - **Fixed GameScene.js constructor errors**: Updated to instantiate use case classes with `new` keyword
  - **Fixed movement demo**: Players now render correctly at `/demos/movement.html`
  - All tests now pass cleanly with no false failures
  - Test coverage maintained: 197 tests across unit, integration, application, and QA layers
  - Next: ENEMY-4 EnemyAI Service (behavior logic, decision-making)

## Status
- Phase: Feature `enemy-spawning-ai` **IN PROGRESS** ✅ (ENEMY-1, ENEMY-2, ENEMY-3 completed, 2025-11-16)
- Performance: Achieves 58-60 FPS (exceeds 30 FPS target), input latency ~16ms (<100ms target).
- Test Coverage: 218 tests (100% pass rate) across domain, application, and integration layers. Enemy tests: 63 total (18 Enemy + 24 SpawnManager + 21 TargetingService).
- Test Framework: Vitest migration completed ✅ - All tests running on Vitest 4.0.9 with jsdom environment
- Module system: ES6 modules implemented (browser-compatible).
- Architecture: Clean Architecture with class-based use cases (HandlePlayerInput, MovePlayer with execute() methods)
- Dev environment: Python HTTP server on port 8080 from `tankDefender-MAAC/` directory.
- **Both P1 (WASD) and P2 (Arrow keys) controls verified working** in 2-player mode.
- **Movement demo fully operational** at `http://localhost:8080/demos/movement.html` ✅
- **Technical Notes:** 
  - Arrow keys use Phaser's `createCursorKeys()` API for proper browser event handling
  - Use cases instantiated with `new` keyword and called via `.execute()` methods
  - Direction constants: lowercase ('up', 'down', 'left', 'right', 'idle')
- **Ready for next task:** ENEMY-4 EnemyAI Service implementation.

## Next Steps
- Use Kiro‑Lite phases to plan and implement features derived from the backlog.
- When a feature starts: `/start feature <name>` → PRD intake.
- **Recommended next features:**
  - `enemy-spawning-ai` (US-05, US-06): **IN PROGRESS** - ENEMY-4 EnemyAI Service, then ENEMY-5 to ENEMY-16
  - `projectile-system` (US-07, US-08): Player shooting, projectile collision
  - `power-ups` (US-09): Shovel tile destruction
  - `enemy-shooting` (US-10): Enemy projectiles

## Known Risks / Notes
- Keep acceptance criteria tight around enemy spawn limits (≤4 simultaneous) and framerate under stress (shooting + 4 enemies).
- Ensure Shovel timing and reversion on level restart is deterministic and testable.
- **Player Movement:** Replace placeholder sprites with final tank assets, integrate tilemap loader, add collision sound effects.
