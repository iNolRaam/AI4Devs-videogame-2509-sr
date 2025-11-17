/**
 * IInput Port Interface
 * 
 * Abstraction for keyboard/gamepad input handling.
 * Adapters must implement this interface to provide input state.
 * 
 * @module application/ports/IInput
 */

/**
 * @interface IInput
 * @description Port interface for input handling
 */

/**
 * Check if a specific key is currently pressed
 * 
 * @function
 * @name IInput#isKeyDown
 * @param {string} key - Key identifier (e.g., 'W', 'ArrowUp', 'Space')
 * @returns {boolean} True if key is currently pressed
 * 
 * @example
 * // Implementation example:
 * class KeyboardInputAdapter {
 *   isKeyDown(key) {
 *     return this.keyboard.keys[key]?.isDown || false;
 *   }
 * }
 */

/**
 * Get list of all currently active (pressed) keys
 * 
 * @function
 * @name IInput#getActiveKeys
 * @returns {string[]} Array of key identifiers currently pressed
 * 
 * @example
 * // Returns: ['W', 'A', 'Space']
 */

/**
 * Type definition for IInput interface
 * @typedef {Object} IInput
 * @property {function(string): boolean} isKeyDown - Check if key is pressed
 * @property {function(): string[]} getActiveKeys - Get all active keys
 */

export default {};
