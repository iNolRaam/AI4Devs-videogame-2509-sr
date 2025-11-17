# Task Breakdown — Menu: 1P/2P Start (US-01, US-02)

Status: PHASE 2 (Ready for implementation by tasks)
Do not implement code until PHASE 3 (`/implement <TASK_ID>`)

---

ID: MENU-1 — Initialize GameState.selectedMode
- Description: Add an in-memory `GameState` with `selectedMode` defaulting to `"1P"`. Ensure value persists across scene transitions and is read on Restart.
- Acceptance:
	- Default `selectedMode` is `"1P"` on app boot.
	- Updating mode to `"2P"` is reflected in state immediately.
	- On Restart from Result, the game uses the last `selectedMode` without resetting to `"1P"`.
	- No critical console errors.
- Effort: S
- Status: Completed
- Files/Modules: `/tankDefender-MAAC/src/infrastructure/config/GameState.js`, DI wiring, scene bootstraps

---

ID: MENU-2 — Menu UI and Keyboard Navigation
- Description: Implement minimal and modern Menu UI with options `1P`, `2P`, `START`; keyboard-only navigation using Arrows or Tab/Shift+Tab; Enter to confirm/select.
- Acceptance:
	- On entering Menu, focus is on `1P`; `START` is enabled.
	- Arrows or Tab/Shift+Tab cycles focus deterministically between `1P` → `2P` → `START`.
	- Enter on `1P`/`2P` sets `selectedMode` in `GameState` and updates visual focus/selection.
	- Enter on `START` triggers start flow (handoff to MENU-3).
	- Visible focus indicator; no mouse/touch required.
- Effort: M
- Status: Completed
- Files/Modules: `/tankDefender-MAAC/src/infrastructure/scenes/MenuScene.ts`, `/tankDefender-MAAC/src/adapters/phaser/presenter/MenuUI.ts`

---

ID: MENU-3 — Start Game Flow (Level 1)
- Description: Wire `StartGame(selectedMode, levelId=1)` to transition to Game scene, load Level 1, spawn players per mode, and initialize HUD.
- Acceptance:
	- Starting from `1P` spawns P1 at its spawn with 3 lives.
	- Starting from `2P` spawns P1 and P2 at their spawns with 3 lives each.
	- HUD shows `Level 1` and `15` enemies remaining.
	- Transition is smooth; no critical console errors.
	- Initial 10 seconds run ≥30 FPS on desktop Chrome/Firefox/Safari.
- Effort: M
- Status: Completed
- Files/Modules: `/tankDefender-MAAC/src/application/use-cases/StartGame.js`, `/tankDefender-MAAC/src/infrastructure/scenes/GameScene.js`, `/tankDefender-MAAC/src/adapters/repositories/LevelJSONRepository.js`, `/tankDefender-MAAC/src/adapters/hud/HUDAdapter.js`

---

ID: MENU-4 — Result → Restart preserves mode
- Description: From Result screen, `Restart` should reload Level 1 using current `GameState.selectedMode`.
- Acceptance:
	- After finishing a run in `2P`, pressing Restart loads Level 1 in `2P`.
	- Likewise for `1P`.
	- No flicker or reset to default mode on Restart.
- Effort: S
- Status: Completed
- Files/Modules: `/tankDefender-MAAC/src/infrastructure/scenes/ResultScene.js`, `/tankDefender-MAAC/src/application/use-cases/RestartGame.js`

---

ID: MENU-5 — Tests (Unit/Integration)
- Description: Add tests for state, navigation, and start flow.
- Acceptance:
	- Unit: `GameState` default and updates; `SelectMode` behavior; `StartGame` DTO correctness.
	- Integration: Simulate key presses to navigate and start; assert mode persistence after Restart.
	- E2E smoke: Menu → Start → Game (L1) → Result → Restart keeps mode.
- Effort: M
- Status: Completed
- Files/Modules: `tests/application/menu/gameState.test.js`, `tests/application/startGame/startGame.test.js`, `tests/application/restartGame/restartGame.test.js`, `tests/integration/menu/menuNavigation.test.js`, `tests/integration/menu/menuE2E.test.js`

---

ID: MENU-6 — Performance & QA pass
- Description: Verify no critical console errors and framerate target at start of Level 1.
- Acceptance:
	- During first 10s after start, avg FPS ≥30 in Chrome/Firefox/Safari desktop.
	- No critical console errors across scene transitions.
- Effort: S
- Status: Completed
- Files/Modules: `/tankDefender-MAAC/tests/qa/performanceCheck.js`, `/tankDefender-MAAC/tests/qa/MENU-6-checklist.md`, `/tankDefender-MAAC/tests/qa/menu6-qa.test.js`, `/tankDefender-MAAC/tests/qa/README.md`

---

Traceability
- User Stories: US-01, US-02
- PRD: Sections 2, 5.1, 6.1–6.4, 8
- Design: Sections 2–6
