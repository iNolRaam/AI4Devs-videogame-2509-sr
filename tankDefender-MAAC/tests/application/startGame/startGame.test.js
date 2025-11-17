import assert from 'node:assert';

import StartGame from '../../../src/application/use-cases/StartGame.js';
import LevelJSONRepository from '../../../src/adapters/repositories/LevelJSONRepository.js';
import HUDAdapter from '../../../src/adapters/hud/HUDAdapter.js';

describe('MENU-3: StartGame', () => {
  it('should initialize 1P mode correctly', () => {
    const levelRepo = new LevelJSONRepository();
    const hudAdapter = new HUDAdapter();

    // 1P mode initialization
    let init = StartGame({ selectedMode: '1P', levelId: 1, levelRepository: levelRepo, hudAdapter });
    assert.strictEqual(init.mode, '1P');
    assert.strictEqual(init.levelId, 1);
    assert.strictEqual(init.enemyCount, 15);
    assert.strictEqual(init.players.length, 1, '1P should create one player');
    assert.ok(init.hud.enemyRemaining === 15, 'HUD enemyRemaining should be 15');
  });

  it('should initialize 2P mode correctly', () => {
    const levelRepo = new LevelJSONRepository();
    const hudAdapter = new HUDAdapter();

    // 2P mode initialization
    const init = StartGame({ selectedMode: '2P', levelId: 1, levelRepository: levelRepo, hudAdapter });
    assert.strictEqual(init.players.length, 2, '2P should create two players');
    assert.deepStrictEqual(init.players.map(p => p.id), ['P1', 'P2']);
  });

  it('should throw on invalid mode', () => {
    const levelRepo = new LevelJSONRepository();
    const hudAdapter = new HUDAdapter();

    // Invalid mode
    let threw = false;
    try {
      StartGame({ selectedMode: '3P', levelId: 1, levelRepository: levelRepo, hudAdapter });
    } catch (e) { threw = true; }
    assert.ok(threw, 'Invalid mode should throw');
  });
});
