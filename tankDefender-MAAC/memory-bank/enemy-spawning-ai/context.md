# Context — Enemy Spawning & AI

## Current Phase
**PHASE 2 — TASK_BREAKDOWN** ✅ COMPLETED

## Active Decisions
- Feature initialized: 2025-11-16
- ✅ PRD clarified and approved
- ✅ Design Doc generated and approved
- ✅ Task Breakdown generated with 16 tasks:
  - ENEMY-1 to ENEMY-4: Domain layer (Enemy, SpawnManager, TargetingService, EnemyAI)
  - ENEMY-5 to ENEMY-8: Application layer (ports, use cases)
  - ENEMY-9 to ENEMY-12: Adapters & infrastructure (rendering, GameScene, spawn config, HUD)
  - ENEMY-13 to ENEMY-16: Testing & demo (unit, integration, performance, demo page)
- Ready for `/implement <TASK_ID>` → PHASE 3 (Code Generation)

## Scope Notes
- Implementation order: Domain → Application → Adapters → Testing → Demo
- Critical path: ENEMY-1 → ENEMY-2 → ENEMY-4 → ENEMY-7 → ENEMY-10 → ENEMY-14
- Estimated effort: ~12-15 story points
- Performance target: ≥30 FPS with 4 enemies + 2 players

## Status
- ✅ Task Breakdown Complete (16 tasks defined)
- ⏸️ Paused — awaiting `/implement <TASK_ID>` command
- **Recommended start:** `/implement ENEMY-1` (Enemy Entity)
