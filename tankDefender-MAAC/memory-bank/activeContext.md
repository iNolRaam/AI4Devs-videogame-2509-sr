# Active Context — Tank Defender (MVP)

Last updated: 2025-11-16

Sources of truth:
- PRD: `../prd.md`
- GDD: `../gdd.md`
- User Stories: `../user-stories.md`

## MVP Objectives
- Playable demo with 3 complete levels.
- 1–2 players (local co-op) with keyboard only.
- Stable 30 FPS on desktop browsers (Chrome/Firefox/Safari).
- Simple flow: Menu → Game → Result (Win/Lose) → Restart/Exit.
- Out of scope: audio, save/progress, mobile, Edge, gamepad, pause.

## Core Gameplay (consolidated)
- Movement: 4 directions, no diagonals; solid collisions with bricks, steel, base; water blocks tanks; bushes are visual only.
- Shooting: key `V` (P1) and `L` (P2); max 1 active projectile per player.
- Map materials: Brick (destructible), Steel (indestructible, blocks shots), Bush (visual only), Water (blocks tank, not bullets), Eagle Base (lose if destroyed).
- Enemies: basic set per GDD; simple AI (patrol, limited chase, periodic fire).
- Spawning: fixed top-side spawn points; max 4 simultaneous enemies; total per level — L1=15, L2=25, L3=35.
- Friendly fire: stuns ally for 1.5–2s; no damage, no life loss.
- Lives: each player starts with 3; on death, respawn at spawn point and consume 1 life.
- HUD: lives (P1/P2), enemies remaining, level number, shovel active, stun indicator.

## Win/Lose Conditions
- Win level: eliminate all enemies; advance to next level.
- Win game: complete all 3 levels.
- Lose: Eagle Base destroyed or all players out of lives.

## Performance & Platform
- Target: 30 FPS sustained during movement, shooting, and with up to 4 active enemies.
- Supported: Desktop Chrome/Firefox/Safari. Not supported: Edge, mobile, touch, gamepad.

## Tech Stack & Runtime
- HTML5, CSS, JavaScript.
- Phaser 3 with Arcade Physics.
- Static web hosting; no backend; levels/waves via static JSON.

## Architecture (high-level)
- Clean Architecture + DDD; TDD-friendly core.
- Layers: Domain (entities/VOs/services/events), Application (use-cases, ports, view models), Adapters (Phaser drivers + driven adapters), Infrastructure (DI, scenes, event bus).
- Ports: `IInput`, `IRenderer`, `IPhysics`, `ITilemap`, `ITime`, `IRand`, `ILevelRepository`, `IHUD`.
- Scenes: Boot (preload), Menu (1P/2P), Game (loop), Result (Win/Lose).

## Acceptance Criteria (PRD-aligned summary)
- 1P and 2P run simultaneously; controls per spec.
- Levels 1–3 load correctly; enemy counts and max-simultaneous respected.
- Friendly fire causes stun without damage.
- Power-ups: Shovel (temporary base reinforcement 10–15s), ExtraLife (+1 life) work and revert as specified.
- Eagle Base destruction triggers defeat; restart returns to Level 1 preserving selected mode.
- Stable 30 FPS; no critical console errors; MVP is completable in one session.

## Current Focus
- **Feature `menu-1p-2p-start` completed** (US-01, US-02):
  - All tasks MENU-1 through MENU-6 implemented and verified
  - Modern minimalist UI with keyboard navigation
  - GameState persistence across scenes
  - ES6 modules converted (GameState, StartGame, LevelJSONRepository, HUDAdapter)
  - Demo functional at `/demos/menu.html`
  - QA tooling created for performance verification
- Phase: Feature complete. Awaiting `/start feature <name>` for next user story.

## Notes
- Documentation source language (PRD/GDD/US) is Spanish; Memory Bank is summarized in English for consistency per project conventions.