/**
 * HandlePlayerInput Use Case
 * 
 * Converts keyboard input to movement direction using last-key-pressed logic
 * to prevent diagonal movement.
 * 
 * @module application/use-cases/HandlePlayerInput
 */

import { areOppositeDirections } from '../../domain/services/MovementService.js';

/**
 * Input state tracker for diagonal prevention
 * Tracks which keys are currently pressed and which was pressed last
 */
class InputState {
  constructor() {
    this.keys = {};
    this.lastPressed = null;
  }

  /**
   * Update input state from current keyboard state
   * @param {IInput} inputPort - Input port implementation
   * @param {string[]} keyList - List of keys to track
   */
  update(inputPort, keyList) {
    for (const key of keyList) {
      const isDown = inputPort.isKeyDown(key);
      
      // Detect key press (was up, now down)
      if (isDown && !this.keys[key]) {
        this.lastPressed = key;
      }
      
      this.keys[key] = isDown;
    }

    // Clear lastPressed if that key was released
    if (this.lastPressed && !this.keys[this.lastPressed]) {
      this.lastPressed = null;
    }
  }

  /**
   * Check if a key is currently pressed
   * @param {string} key - Key to check
   * @returns {boolean}
   */
  isKeyDown(key) {
    return this.keys[key] || false;
  }

  /**
   * Get the last pressed key (if still held)
   * @returns {string|null}
   */
  getLastPressed() {
    return this.lastPressed;
  }
}

/**
 * Key mapping for each player
 */
const KEY_MAPPINGS = {
  P1: {
    up: 'W',
    down: 'S',
    left: 'A',
    right: 'D'
  },
  P2: {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight'
  }
};

/**
 * Input state instances for each player
 * @type {Map<string, InputState>}
 */
const playerInputStates = new Map();

/**
 * HandlePlayerInput Use Case Class
 * 
 * @implements {function}
 */
class HandlePlayerInput {
  /**
   * Create HandlePlayerInput use case
   * @param {IInput} inputPort - Input port implementation
   */
  constructor(inputPort) {
    if (!inputPort || typeof inputPort.isKeyDown !== 'function') {
      throw new Error('HandlePlayerInput: inputPort must implement IInput interface');
    }
    this.inputPort = inputPort;
  }

  /**
   * Execute input handling for a player
   * @param {'P1' | 'P2'} playerId - Player identifier
   * @returns {Direction} Movement direction or 'idle'
   */
  execute(playerId) {
    if (!playerId || !['P1', 'P2'].includes(playerId)) {
      throw new Error('HandlePlayerInput: playerId must be "P1" or "P2"');
    }

    const keyMap = KEY_MAPPINGS[playerId];
    if (!keyMap) {
      throw new Error(`HandlePlayerInput: no key mapping found for ${playerId}`);
    }

    // Get or create input state for this player
    if (!playerInputStates.has(playerId)) {
      playerInputStates.set(playerId, new InputState());
    }
    const inputState = playerInputStates.get(playerId);

    // Update input state
    const keyList = Object.values(keyMap);
    inputState.update(this.inputPort, keyList);

    // Priority 1: Last pressed key (if still held)
    const lastKey = inputState.getLastPressed();
    if (lastKey) {
      // Check if opposite keys are pressed - if so, cancel
      const upPressed = inputState.isKeyDown(keyMap.up);
      const downPressed = inputState.isKeyDown(keyMap.down);
      const leftPressed = inputState.isKeyDown(keyMap.left);
      const rightPressed = inputState.isKeyDown(keyMap.right);

      if ((upPressed && downPressed) || (leftPressed && rightPressed)) {
        return 'idle';
      }

      if (lastKey === keyMap.up) return 'up';
      if (lastKey === keyMap.down) return 'down';
      if (lastKey === keyMap.left) return 'left';
      if (lastKey === keyMap.right) return 'right';
    }

    // Priority 2: Any held key (fallback if last-pressed released)
    if (inputState.isKeyDown(keyMap.up)) return 'up';
    if (inputState.isKeyDown(keyMap.down)) return 'down';
    if (inputState.isKeyDown(keyMap.left)) return 'left';
    if (inputState.isKeyDown(keyMap.right)) return 'right';

    // No movement keys pressed
    return 'idle';
  }
}

/**
 * Reset input state for a player (useful for scene transitions)
 * @param {'P1' | 'P2'} playerId - Player to reset
 */
export function resetPlayerInput(playerId) {
  playerInputStates.delete(playerId);
}

/**
 * Reset all player input states
 */
export function resetAllPlayerInputs() {
  playerInputStates.clear();
}

export default HandlePlayerInput;
