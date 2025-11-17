/**
 * IRenderer Port Interface
 * 
 * Abstraction for sprite rendering and visual updates.
 * Adapters must implement this interface for rendering operations.
 * 
 * @module application/ports/IRenderer
 */

/**
 * @interface IRenderer
 * @description Port interface for rendering operations
 */

/**
 * Set rotation angle of an entity's sprite
 * 
 * @function
 * @name IRenderer#setRotation
 * @param {string} entityId - Entity identifier (e.g., 'P1', 'P2')
 * @param {number} angle - Rotation angle in degrees
 * @returns {void}
 * 
 * @example
 * renderer.setRotation('P1', 90); // Face right
 * renderer.setRotation('P2', 270); // Face left
 */

/**
 * Set position of an entity's sprite
 * 
 * @function
 * @name IRenderer#setPosition
 * @param {string} entityId - Entity identifier
 * @param {{ x: number, y: number }} position - World coordinates
 * @returns {void}
 * 
 * @example
 * renderer.setPosition('P1', { x: 100, y: 200 });
 */

/**
 * Get current position of an entity's sprite
 * 
 * @function
 * @name IRenderer#getPosition
 * @param {string} entityId - Entity identifier
 * @returns {{ x: number, y: number }} Current position
 */

/**
 * Set visibility of an entity's sprite
 * 
 * @function
 * @name IRenderer#setVisible
 * @param {string} entityId - Entity identifier
 * @param {boolean} visible - Visibility state
 * @returns {void}
 * 
 * @example
 * renderer.setVisible('P1', false); // Hide tank
 * renderer.setVisible('P1', true);  // Show tank
 */

/**
 * Set sprite tint/color
 * 
 * @function
 * @name IRenderer#setTint
 * @param {string} entityId - Entity identifier
 * @param {number} color - Hexadecimal color code
 * @returns {void}
 * 
 * @example
 * renderer.setTint('P1', 0xff0000); // Red tint
 */

/**
 * Type definition for IRenderer interface
 * @typedef {Object} IRenderer
 * @property {function(string, number): void} setRotation
 * @property {function(string, {x: number, y: number}): void} setPosition
 * @property {function(string): {x: number, y: number}} getPosition
 * @property {function(string, boolean): void} setVisible
 * @property {function(string, number): void} setTint
 */

export default {};
