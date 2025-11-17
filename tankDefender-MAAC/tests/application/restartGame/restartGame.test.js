const assert = require('node:assert');
const path = require('node:path');

const GameState = require(path.join(__dirname, '../../../src/infrastructure/config/GameState.js'));
const RestartGame = require(path.join(__dirname, '../../../src/application/use-cases/RestartGame.js'));
const LevelJSONRepository = require(path.join(__dirname, '../../../src/adapters/repositories/LevelJSONRepository.js'));
const HUDAdapter = require(path.join(__dirname, '../../../src/adapters/hud/HUDAdapter.js'));

// MENU-4 RestartGame tests

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

console.log('OK: MENU-4 RestartGame tests passed');
