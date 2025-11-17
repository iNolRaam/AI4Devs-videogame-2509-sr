import assert from 'node:assert';

import GameState from '../../../src/infrastructure/config/GameState.js';
import RestartGame from '../../../src/application/use-cases/RestartGame.js';
import LevelJSONRepository from '../../../src/adapters/repositories/LevelJSONRepository.js';
import HUDAdapter from '../../../src/adapters/hud/HUDAdapter.js';

describe('MENU-4: RestartGame', () => {
  it('should preserve selectedMode and spawn correct number of players', () => {
    const levelRepo = new LevelJSONRepository();
    const hudAdapter = new HUDAdapter();

    // Set mode to 2P then restart and ensure persistence
    GameState.setSelectedMode('2P');
    const init = RestartGame({ levelRepository: levelRepo, hudAdapter });
    assert.strictEqual(init.mode, '2P', 'Restart should preserve selectedMode 2P');
    assert.strictEqual(init.players.length, 2, 'Restart in 2P should spawn two players');

    // Change mode to 1P and restart again
    GameState.setSelectedMode('1P');
    const init2 = RestartGame({ levelRepository: levelRepo, hudAdapter });
    assert.strictEqual(init2.mode, '1P', 'Restart should preserve selectedMode 1P');
    assert.strictEqual(init2.players.length, 1, 'Restart in 1P should spawn one player');
  });
});
