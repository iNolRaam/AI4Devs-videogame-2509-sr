import assert from 'node:assert';
import gameState from '../../../src/infrastructure/config/GameState.js';

describe('MENU-1: GameState', () => {
  it('should initialize with default 1P mode', () => {
    // Default should be 1P
    assert.strictEqual(gameState.getSelectedMode(), '1P', 'Default selectedMode should be 1P');
  });

  it('should update selectedMode', () => {
    // Update to 2P
    gameState.setSelectedMode('2P');
    assert.strictEqual(gameState.getSelectedMode(), '2P', 'selectedMode should update to 2P');
  });

  it('should throw on invalid mode', () => {
    // Invalid values should throw
    let threw = false;
    try {
      gameState.setSelectedMode('3P');
    } catch (e) {
      threw = true;
      assert.match(String(e.message || e), /Invalid mode/i, 'Should throw an invalid mode error');
    }
    assert.strictEqual(threw, true, 'Setting invalid mode should throw');
  });

  it('should reset to 1P', () => {
    // Reset returns to 1P
    gameState.reset();
    assert.strictEqual(gameState.getSelectedMode(), '1P', 'Reset should return selectedMode to 1P');
  });
});
