// ResultScene stub (MENU-4)
// Provides restart() that delegates to RestartGame use case
const path = require('node:path');
const RestartGame = require(path.join(__dirname, '../../application/use-cases/RestartGame.js'));
const LevelJSONRepository = require(path.join(__dirname, '../../adapters/repositories/LevelJSONRepository.js'));
const HUDAdapter = require(path.join(__dirname, '../../adapters/hud/HUDAdapter.js'));

class ResultScene {
  constructor() {
    this.levelRepo = new LevelJSONRepository();
    this.hudAdapter = new HUDAdapter();
  }

  restart() {
    return RestartGame({ levelRepository: this.levelRepo, hudAdapter: this.hudAdapter });
  }
}

module.exports = ResultScene;
if (typeof globalThis !== 'undefined') {
  globalThis.ResultScene = ResultScene;
}
