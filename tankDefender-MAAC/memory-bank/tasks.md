# Global Backlog (from User Stories)

This backlog maps PRD/GDD to User Stories for the Tank Defender MVP.

| ID     | Title                                                        | Priority | Effort | Status       | Affects |
|--------|--------------------------------------------------------------|----------|--------|--------------|---------|
| US-01  | Select 1P or 2P on menu and start                           | High     | 2      | ✅ Completed  | Menu, Game, HUD |
| US-02  | Start new game at Level 1                                    | High     | 1      | ✅ Completed  | Loader, HUD |
| US-03  | P1 movement with WASD (no diagonals, collisions)             | High     | 2      | Not started  | Input, Physics, Map |
| US-04  | P2 movement with Arrows (no diagonals, collisions)           | High     | 2      | Not started  | Input, Physics, Map |
| US-05  | Shooting with V/L; 1 active projectile per player            | High     | 1      | Not started  | Combat, Physics |
| US-06  | Destroy bricks with bullets                                   | Medium   | 2      | Not started  | Map, Physics |
| US-07  | Steel blocks tanks and bullets (indestructible)               | Medium   | 1      | Not started  | Map, Physics |
| US-08  | Bushes are visual only; traversal allowed                     | Low      | 1      | Not started  | Rendering, Map |
| US-09  | Water blocks tanks, not bullets                               | Medium   | 1      | Not started  | Map, Physics |
| US-10  | Friendly fire stuns 1.5–2s, no damage                         | Medium   | 2      | Not started  | Combat, Status, HUD |
| US-11  | Enemy damage reduces life; respawn player                     | High     | 2      | Not started  | Combat, Lives, Respawn, HUD |
| US-12  | Restart level on death while lives > 0                        | Medium   | 2      | Not started  | Flow, Loader, Lives |
| US-13  | Shovel reinforces base 10–15s and reverts                     | Medium   | 2      | Not started  | PowerUps, Map, HUD, Timing |
| US-14  | Extra Life grants +1 life                                     | Low      | 1      | Not started  | PowerUps, HUD |
| US-15  | Enemy spawns: L1=15, L2=25, L3=35; ≤4 simultaneous; top spawns | High   | 3      | Not started  | Spawner, AI, HUD |
| US-16  | HUD + Win/Lose screens with keyboard navigation               | High     | 2      | Not started  | HUD, UI, Result |

Notes:
- Performance: Maintain ≥30 FPS during continuous movement/shooting and with 4 enemies.
- Platform: Desktop Chrome/Firefox/Safari; keyboard only; no audio; no Edge/mobile.
- Source docs: `../prd.md`, `../gdd.md`, `../user-stories.md`.
