const assert = require('node:assert');
const path = require('node:path');
const gameState = require(path.join(__dirname, '../../../src/infrastructure/config/GameState.js'));

// MENU-1 — Initialize GameState.selectedMode

// Default should be 1P
assert.strictEqual(gameState.getSelectedMode(), '1P', 'Default selectedMode should be 1P');

// Update to 2P
gameState.setSelectedMode('2P');
assert.strictEqual(gameState.getSelectedMode(), '2P', 'selectedMode should update to 2P');

// Invalid values should throw
let threw = false;
try {
  gameState.setSelectedMode('3P');
} catch (e) {
  threw = true;
  assert.match(String(e.message || e), /Invalid mode/i, 'Should throw an invalid mode error');
}
assert.strictEqual(threw, true, 'Setting invalid mode should throw');

// Reset returns to 1P
gameState.reset();
assert.strictEqual(gameState.getSelectedMode(), '1P', 'Reset should return selectedMode to 1P');

console.log('OK: MENU-1 GameState tests passed');
