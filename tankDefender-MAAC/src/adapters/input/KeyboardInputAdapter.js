/**
 * KeyboardInputAdapter — IInput Implementation
 * 
 * Wraps Phaser keyboard input system and implements IInput port interface.
 * 
 * @module adapters/input/KeyboardInputAdapter
 * @implements {IInput}
 */

/**
 * @typedef {import('../../application/ports/IInput.js').IInput} IInput
 */

/**
 * Adapter for Phaser keyboard input
 * @implements {IInput}
 */
class KeyboardInputAdapter {
  /**
   * Create keyboard input adapter
   * @param {Phaser.Input.Keyboard.KeyboardPlugin} keyboard - Phaser keyboard plugin instance
   */
  constructor(keyboard) {
    if (!keyboard) {
      throw new Error('KeyboardInputAdapter: keyboard instance is required');
    }
    this.keyboard = keyboard;
    this.keys = {};
    // Create cursor keys for arrow key handling
    this.cursorKeys = keyboard.createCursorKeys();
  }

  /**
   * Register keys for tracking
   * @param {string} playerId - Player identifier (not used, for API consistency)
   * @param {string[]} keyList - Array of key names to track (e.g., ['W', 'A', 'S', 'D'])
   */
  registerKeys(playerId, keyList) {
    // Arrow keys are handled by cursorKeys in isKeyDown(), so just register non-arrow keys
    for (const keyName of keyList) {
      if (!keyName.startsWith('Arrow') && !this.keys[keyName]) {
        const key = this.keyboard.addKey(keyName);
        this.keys[keyName] = key;
      }
    }
  }

  /**
   * Check if a specific key is currently pressed
   * Handles both registered and unregistered keys
   * 
   * @param {string} key - Key identifier (e.g., 'W', 'ArrowUp')
   * @returns {boolean} True if key is currently pressed
   */
  isKeyDown(key) {
    // Special handling for arrow keys - use cursor keys directly
    if (key === 'ArrowUp') return this.cursorKeys.up.isDown;
    if (key === 'ArrowDown') return this.cursorKeys.down.isDown;
    if (key === 'ArrowLeft') return this.cursorKeys.left.isDown;
    if (key === 'ArrowRight') return this.cursorKeys.right.isDown;
    
    // Check registered keys first
    if (this.keys[key]) {
      return this.keys[key].isDown;
    }

    // Fallback: check via keyboard plugin directly
    const keyObj = this.keyboard.addKey(key, false);
    return keyObj ? keyObj.isDown : false;
  }

  /**
   * Get list of all currently active (pressed) keys
   * 
   * @returns {string[]} Array of key identifiers currently pressed
   */
  getActiveKeys() {
    const activeKeys = [];
    
    // Check registered keys
    for (const [keyName, keyObj] of Object.entries(this.keys)) {
      if (keyObj.isDown) {
        activeKeys.push(keyName);
      }
    }

    return activeKeys;
  }

  /**
   * Check if key was just pressed (this frame)
   * Useful for single-press actions like shooting
   * 
   * @param {string} key - Key identifier
   * @returns {boolean} True if key was just pressed
   */
  isKeyJustDown(key) {
    if (this.keys[key]) {
      return Phaser.Input.Keyboard.JustDown(this.keys[key]);
    }
    return false;
  }

  /**
   * Reset all key states (useful for scene transitions)
   */
  reset() {
    this.keyboard.resetKeys();
  }
}

export default KeyboardInputAdapter;
