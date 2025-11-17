// ResultScene stub (MENU-4)
// Provides restart() that delegates to RestartGame use case
import RestartGame from '../../application/use-cases/RestartGame.js';
import LevelJSONRepository from '../../adapters/repositories/LevelJSONRepository.js';
import HUDAdapter from '../../adapters/hud/HUDAdapter.js';

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
