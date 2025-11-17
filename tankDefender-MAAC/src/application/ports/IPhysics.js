/**
 * IPhysics Port Interface
 * 
 * Abstraction for physics engine interactions.
 * Adapters must implement this interface for collision detection and body management.
 * 
 * @module application/ports/IPhysics
 */

/**
 * @interface IPhysics
 * @description Port interface for physics operations
 */

/**
 * Set velocity of an entity's physics body
 * 
 * @function
 * @name IPhysics#setVelocity
 * @param {string} entityId - Entity identifier (e.g., 'P1', 'P2')
 * @param {{ x: number, y: number }} velocity - Velocity vector in pixels per second
 * @returns {void}
 * 
 * @example
 * physics.setVelocity('P1', { x: 100, y: 0 }); // Move right at 100 px/s
 */

/**
 * Enable collision between two entities
 * 
 * @function
 * @name IPhysics#enableCollision
 * @param {string} entityA - First entity identifier
 * @param {string} entityB - Second entity identifier or layer name
 * @returns {void}
 * 
 * @example
 * physics.enableCollision('P1', 'brickLayer');
 * physics.enableCollision('P1', 'P2');
 */

/**
 * Register a collision callback
 * 
 * @function
 * @name IPhysics#onCollide
 * @param {string} entityA - First entity identifier
 * @param {string} entityB - Second entity identifier or layer name
 * @param {Function} callback - Function called on collision
 * @returns {void}
 * 
 * @example
 * physics.onCollide('P1', 'enemyGroup', (player, enemy) => {
 *   console.log('Player hit enemy!');
 * });
 */

/**
 * Get current velocity of an entity
 * 
 * @function
 * @name IPhysics#getVelocity
 * @param {string} entityId - Entity identifier
 * @returns {{ x: number, y: number }} Current velocity vector
 */

/**
 * Stop entity movement (set velocity to zero)
 * 
 * @function
 * @name IPhysics#stop
 * @param {string} entityId - Entity identifier
 * @returns {void}
 */

/**
 * Type definition for IPhysics interface
 * @typedef {Object} IPhysics
 * @property {function(string, {x: number, y: number}): void} setVelocity
 * @property {function(string, string): void} enableCollision
 * @property {function(string, string, Function): void} onCollide
 * @property {function(string): {x: number, y: number}} getVelocity
 * @property {function(string): void} stop
 */

export default {};
