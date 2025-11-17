const assert = require('node:assert');
const path = require('node:path');

const StartGame = require(path.join(__dirname, '../../../src/application/use-cases/StartGame.js'));
const LevelJSONRepository = require(path.join(__dirname, '../../../src/adapters/repositories/LevelJSONRepository.js'));
const HUDAdapter = require(path.join(__dirname, '../../../src/adapters/hud/HUDAdapter.js'));

// MENU-3 StartGame use case tests

const levelRepo = new LevelJSONRepository();
const hudAdapter = new HUDAdapter();

// 1P mode initialization
let init = StartGame({ selectedMode: '1P', levelId: 1, levelRepository: levelRepo, hudAdapter });
assert.strictEqual(init.mode, '1P');
assert.strictEqual(init.levelId, 1);
assert.strictEqual(init.enemyCount, 15);
assert.strictEqual(init.players.length, 1, '1P should create one player');
assert.ok(init.hud.enemyRemaining === 15, 'HUD enemyRemaining should be 15');

// 2P mode initialization
init = StartGame({ selectedMode: '2P', levelId: 1, levelRepository: levelRepo, hudAdapter });
assert.strictEqual(init.players.length, 2, '2P should create two players');
assert.deepStrictEqual(init.players.map(p => p.id), ['P1', 'P2']);

// Invalid mode
let threw = false;
try {
  StartGame({ selectedMode: '3P', levelId: 1, levelRepository: levelRepo, hudAdapter });
} catch (e) { threw = true; }
assert.ok(threw, 'Invalid mode should throw');

console.log('OK: MENU-3 StartGame tests passed');
