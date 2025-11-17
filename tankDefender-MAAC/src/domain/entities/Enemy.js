/**
 * Enemy Entity — Domain Layer
 *
 * Represents an enemy tank with AI behavior properties.
 * Mirrors Tank entity structure with enemy-specific additions.
 * Pure domain logic with no external dependencies.
 *
 * @module domain/entities/Enemy
 */

/**
 * @typedef {'regular' | 'fast'} EnemyType
 * @typedef {'base' | 'player'} TargetPriority
 */

class Enemy {
  /**
   * Create a new Enemy entity
   * @param {string} id - Unique enemy identifier (e.g., 'E123')
   * @param {{ x: number; y: number }} spawnPosition - Initial spawn coordinates
   * @param {EnemyType} [type='regular'] - Enemy type affecting speed
   */
  constructor(id, spawnPosition, type = 'regular') {
    if (!id || typeof id !== 'string') {
      throw new Error('Enemy: id must be a non-empty string');
    }
    if (!spawnPosition || typeof spawnPosition.x !== 'number' || typeof spawnPosition.y !== 'number') {
      throw new Error('Enemy: spawnPosition must have numeric x and y properties');
    }
    if (!['regular', 'fast'].includes(type)) {
      throw new Error('Enemy: type must be "regular" or "fast"');
    }

    const baseSpeed = 120;
    this.speed = type === 'fast' ? baseSpeed : Math.round(baseSpeed * 0.7); // regular: 84, fast: 120

    this.id = id;
    this.position = { x: spawnPosition.x, y: spawnPosition.y };
    this.direction = 'up'; // Default facing direction
    this.isAlive = true;
    this.rotation = 0; // Angle in degrees (0=up, 90=right, 180=down, 270=left)
    this.type = type;
    this.isPlayer = false;
    this.targetPriority = 'base'; // 'base' or 'player'
    this.lastShotTime = 0;
    this.lastDirectionChangeTime = 0;
    this.directionChangeInterval = this._randomInterval(2000, 4000); // ms
  }

  /**
   * Generate a random interval between min and max (inclusive)
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number between min and max
   * @private
   */
  _randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Update the enemy's facing direction
   * @param {'up' | 'down' | 'left' | 'right' | 'idle'} direction - New direction
   * @throws {Error} If direction is invalid
   */
  setDirection(direction) {
    const validDirections = ['up', 'down', 'left', 'right', 'idle'];
    if (!validDirections.includes(direction)) {
      throw new Error(`Enemy: invalid direction "${direction}". Must be one of: ${validDirections.join(', ')}`);
    }
    this.direction = direction;
  }

  /**
   * Calculate velocity vector based on current direction and speed
   * @returns {{ x: number; y: number }} Velocity vector with x and y components
   */
  getVelocity() {
    const velocityMap = {
      'up': { x: 0, y: -this.speed },
      'down': { x: 0, y: this.speed },
      'left': { x: -this.speed, y: 0 },
      'right': { x: this.speed, y: 0 },
      'idle': { x: 0, y: 0 }
    };
    return velocityMap[this.direction];
  }

  /**
   * Set the enemy's rotation angle
   * @param {number} angle - Rotation angle in degrees
   */
  rotate(angle) {
    if (typeof angle !== 'number') {
      throw new Error('Enemy: angle must be a number');
    }
    this.rotation = ((angle % 360) + 360) % 360;
  }

  /**
   * Update the enemy's position
   * @param {{ x: number; y: number }} newPosition - New position coordinates
   */
  setPosition(newPosition) {
    if (!newPosition || typeof newPosition.x !== 'number' || typeof newPosition.y !== 'number') {
      throw new Error('Enemy: newPosition must have numeric x and y properties');
    }
    this.position.x = newPosition.x;
    this.position.y = newPosition.y;
  }

  /**
   * Get current position
   * @returns {{ x: number; y: number }} Current position coordinates
   */
  getPosition() {
    return { x: this.position.x, y: this.position.y };
  }

  /**
   * Mark enemy as destroyed
   */
  destroy() {
    this.isAlive = false;
  }

  /**
   * Respawn enemy at given position
   * @param {{ x: number; y: number }} spawnPosition - Respawn coordinates
   */
  respawn(spawnPosition) {
    this.setPosition(spawnPosition);
    this.direction = 'up';
    this.rotation = 0;
    this.isAlive = true;
    this.lastShotTime = 0;
    this.lastDirectionChangeTime = 0;
    this.directionChangeInterval = this._randomInterval(2000, 4000);
  }

  /**
   * Get current state as plain object (for serialization/debugging)
   * @returns {Object} Enemy state
   */
  toJSON() {
    return {
      id: this.id,
      position: { ...this.position },
      direction: this.direction,
      speed: this.speed,
      rotation: this.rotation,
      isAlive: this.isAlive,
      type: this.type,
      isPlayer: this.isPlayer,
      targetPriority: this.targetPriority,
      lastShotTime: this.lastShotTime,
      lastDirectionChangeTime: this.lastDirectionChangeTime,
      directionChangeInterval: this.directionChangeInterval
    };
  }
}

export default Enemy;