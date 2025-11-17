# PRD — Enemy Spawning & AI

## Problem Statement
Players can currently move around the map, but there's no challenge or objective. We need to introduce enemy tanks that spawn dynamically, patrol the map, and create combat scenarios for players to defend against.

## Goals
1. **Spawn Management**: Implement a system that manages enemy reserves and enforces the "max 4 simultaneous enemies" rule
2. **Spawn Points**: Create spawn points at the top edge of the map (4 positions)
3. **Basic AI**: Enemies patrol randomly, shoot at players when aligned, and attempt to destroy the base
4. **Level Scaling**: Support different enemy counts per level (L1=15, L2=25, L3=35)
5. **Performance**: Maintain ≥30 FPS with 4 active enemies + 2 players moving and shooting

## User Stories Covered
- **US-15**: Generate enemies L1=15, L2=25, L3=35; max 4 simultaneous; spawns from top; basic AI

## Success Criteria

### Functional Requirements
- ✅ Never more than 4 enemies active simultaneously on the map
- ✅ Enemy reserve system tracks remaining enemies per level (15/25/35)
- ✅ When an enemy is destroyed, spawn a new one if reserve > 0
- ✅ 4 spawn points positioned at the top edge of the map
- ✅ Enemies spawn with random selection from spawn points
- ✅ Basic AI behavior:
  - Random movement in 4 directions (no diagonals)
  - Periodic direction changes every 2-4 seconds
  - Shoot when aligned with player or base (same row/column)
  - Avoid getting stuck in corners/walls
- ✅ HUD displays "Enemies Remaining: X" synchronized with reserve

### Non-Functional Requirements
- ✅ Performance: ≥30 FPS with 4 enemies + 2 players active
- ✅ Tested on Chrome, Firefox, Safari (desktop only)
- ✅ Keyboard-only input (no audio, no mobile, no Edge)
- ✅ Collision detection: enemies blocked by walls, water, other tanks
- ✅ Clean Architecture maintained (Domain → Application → Adapters → Infrastructure)

## Out of Scope (MVP)
- Enemy types/variants (all enemies identical in MVP)
- Advanced AI (pathfinding, flanking, coordinated attacks)
- Enemy-to-enemy collision avoidance (simple blocking only)
- Enemy health/armor (1-hit destruction)
- Special enemy abilities
- Enemy spawn animations/effects

## Dependencies
- Existing: Tank entity, MovementService, collision system, GameScene
- New: Enemy domain entity, SpawnManager service, EnemyAI behavior, spawn point configuration

## Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| AI gets stuck in loops | High | Implement direction change timer + random unstuck logic |
| Performance degrades with 4 enemies | High | Profile early, optimize collision checks, limit AI computation frequency |
| Spawn points overlap with static obstacles | Medium | Validate spawn points in level config, test all 3 levels |

## Clarified Requirements

### Spawn Behavior
- **Spawn Delay**: 2 seconds between each enemy spawn
- Spawns occur from 4 top-edge spawn points (random selection)
- Max 4 simultaneous enemies enforced at all times

### Enemy AI Behavior
- **Movement Speed**: Slower than players by default
  - Regular enemies: 70% of player speed
  - Fast enemies: 100% of player speed (same as players)
- **Shooting Frequency**: Every 3 seconds
- **Target Priority**: 
  - 70% of the time: prioritize moving toward the base
  - 30% of the time: engage players if in line of sight
- **Movement Pattern**: Random patrol with direction changes every 2-4 seconds

### Enemy Types (MVP Scope)
- **Regular Enemy**: Slower movement (70% player speed), standard behavior
- **Fast Enemy**: Player-speed movement (100%), appears in later waves

---

**Next Steps**: 
- ✅ PRD clarified and ready for approval
- User runs `/approve prd` to move to Design phase
