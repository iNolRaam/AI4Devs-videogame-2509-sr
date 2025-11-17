// RestartGame Use Case (MENU-4)
// Reuses existing selectedMode from GameState and calls StartGame for level 1

import StartGame from './StartGame.js';
import GameState from '../../infrastructure/config/GameState.js';

function RestartGame({ levelRepository, hudAdapter }) {
  const selectedMode = GameState.getSelectedMode();
  return StartGame({
    selectedMode,
    levelId: 1,
    levelRepository,
    hudAdapter
  });
}

module.exports = RestartGame;
if (typeof globalThis !== 'undefined') {
  globalThis.RestartGame = RestartGame;
}
