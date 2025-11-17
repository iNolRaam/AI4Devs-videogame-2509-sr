# PRD — Player Movement (US-03, US-04)

**Status:** PHASE 2 (Tasks ready for implementation)  
**Feature:** player-movement  
**User Stories:** US-03, US-04  
**Priority:** High  
**Effort:** 4 (combined)

---

## Problem Statement

Players need responsive, collision-aware tank movement controls to navigate the battlefield. Currently, the game lacks player input handling and physics-based movement. Without this foundation, players cannot interact with the game environment or engage in combat.

## Goals

1. **P1 Movement (US-03):** Implement WASD keyboard controls for Player 1 tank
2. **P2 Movement (US-04):** Implement Arrow keys for Player 2 tank (when in 2P mode)
3. **Movement Constraints:**
   - 4-directional only (up, down, left, right)
   - No diagonal movement
   - Collision detection with walls, bricks, steel, water, and other tanks
   - Smooth movement within tile-based grid
4. **Performance:** Maintain ≥30 FPS with both players moving simultaneously

## Scope

### In Scope
- Keyboard input handling for P1 (WASD) and P2 (Arrow keys)
- 4-directional movement logic (no diagonals)
- Collision detection with:
  - Map boundaries
  - Brick tiles (solid)
  - Steel tiles (solid)
  - Water tiles (solid for tanks)
  - Eagle Base (solid)
  - Other player tank (solid, no overlap)
- Tank rotation to face movement direction
- Movement speed configuration (pixels per frame/second)
- Physics integration with Phaser Arcade Physics
- Bush traversal (visual only, no collision)

### Out of Scope
- Shooting mechanics (US-05)
- Enemy AI movement (US-15)
- Gamepad/touch input
- Movement animations (sprite frames)
- Sound effects
- Power-up effects on movement (separate feature)
- Pause functionality

## User Stories

**US-03:** As Player 1, I want to move my tank using WASD keys with proper collisions, so I can navigate the battlefield effectively.

**US-04:** As Player 2, I want to move my tank using Arrow keys with proper collisions, so I can coordinate with Player 1 in 2P mode.

## Success Criteria

### Functional Requirements
1. **P1 Controls:**
   - W: Move up
   - A: Move left
   - S: Move down
   - D: Move right
   - Tank rotates to face movement direction
   
2. **P2 Controls (2P mode only):**
   - ↑: Move up
   - ←: Move left
   - ↓: Move down
   - →: Move right
   - Tank rotates to face movement direction

3. **Collision Behavior:**
   - Tank stops when hitting solid tiles (brick, steel, water, base)
   - Tank stops when hitting map boundaries
   - Tanks cannot overlap (P1/P2 collision)
   - Bush tiles allow traversal (no collision)

4. **Movement Quality:**
   - Responsive input (no noticeable lag <100ms)
   - Smooth movement at consistent speed
   - No jittering or stuttering
   - Tank stays aligned to grid when stopped

### Non-Functional Requirements
1. **Performance:** ≥30 FPS with both players moving simultaneously
2. **Compatibility:** Desktop Chrome/Firefox/Safari, keyboard only
3. **Architecture:** Clean separation between input handling, movement logic, and physics
4. **Testing:** Unit tests for movement logic, integration tests for collision detection

## Technical Considerations

### Architecture
- **Input Port:** `IInput` interface for keyboard state polling
- **Physics Port:** `IPhysics` interface for collision detection and body management
- **Movement Service:** Domain logic for direction, speed, and constraints
- **Player Entity:** Contains position, direction, velocity state

### Phaser 3 Integration
- Arcade Physics for collision detection
- Sprite rotation based on direction (0°, 90°, 180°, 270°)
- Velocity-based movement (pixels/second)
- Collider setup for static map layers and dynamic entities

### Data Model
```typescript
interface PlayerState {
  id: 'P1' | 'P2';
  position: { x: number; y: number };
  direction: 'up' | 'down' | 'left' | 'right';
  velocity: { x: number; y: number };
  speed: number; // pixels/second
  isMoving: boolean;
}

interface InputMapping {
  up: string;    // 'W' or 'ArrowUp'
  down: string;  // 'S' or 'ArrowDown'
  left: string;  // 'A' or 'ArrowLeft'
  right: string; // 'D' or 'ArrowRight'
}
```

## Acceptance Criteria

1. ✅ P1 moves with WASD in all 4 directions
2. ✅ P2 moves with Arrows in all 4 directions (2P mode)
3. ✅ No diagonal movement possible
4. ✅ Tanks collide with solid tiles (brick, steel, water, base)
5. ✅ Tanks collide with each other (no overlap)
6. ✅ Tanks pass through bushes without collision
7. ✅ Tank sprite rotates to face movement direction
8. ✅ Movement speed is consistent and configurable
9. ✅ Performance: ≥30 FPS with both players moving
10. ✅ No critical console errors during movement

## Dependencies

- **Prerequisite:** Menu system (US-01, US-02) ✅ Completed
- **Blocks:** Shooting mechanics (US-05), Enemy spawning (US-15)
- **Assets Needed:** Tank sprite (placeholder or simple shape acceptable for MVP)

## Open Questions

1. **Movement Speed:** What is the optimal speed (pixels/second)? Recommend: 100-120 px/s
2. **Grid Alignment:** Should tanks snap to grid when stopped? Recommend: No (smooth movement)
3. **Input Priority:** If both horizontal and vertical keys pressed, which takes priority? Recommend: Last pressed
4. **Collision Buffer:** Should there be a small buffer around tank hitbox? Recommend: Yes, 2-4px for smoother navigation

---

**Next Step:** Review and clarify any open questions, then use `/approve prd` to move to Design phase.
