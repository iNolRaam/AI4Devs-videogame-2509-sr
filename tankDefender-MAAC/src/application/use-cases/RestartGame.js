// RestartGame Use Case (MENU-4)
// Reuses existing selectedMode from GameState and calls StartGame for level 1

const path = require('node:path');
const StartGame = require(path.join(__dirname, './StartGame.js'));
const GameState = require(path.join(__dirname, '../../infrastructure/config/GameState.js'));

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
