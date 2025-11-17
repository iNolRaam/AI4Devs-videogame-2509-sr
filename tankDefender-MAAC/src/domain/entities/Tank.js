/**
 * Tank Entity — Domain Layer
 * 
 * Represents a player tank with position, direction, velocity, and lifecycle state.
 * Pure domain logic with no external dependencies.
 * 
 * @module domain/entities/Tank
 */

/**
 * @typedef {'up' | 'down' | 'left' | 'right' | 'idle'} Direction
 * @typedef {{ x: number; y: number }} Position
 * @typedef {{ x: number; y: number }} Velocity
 */

class Tank {
  /**
   * Create a new Tank entity
   * @param {'P1' | 'P2'} id - Player identifier
   * @param {Position} spawnPosition - Initial spawn coordinates
   * @param {number} [speed=120] - Movement speed in pixels per second
   */
  constructor(id, spawnPosition, speed = 120) {
    if (!id || !['P1', 'P2'].includes(id)) {
      throw new Error('Tank: id must be "P1" or "P2"');
    }
    if (!spawnPosition || typeof spawnPosition.x !== 'number' || typeof spawnPosition.y !== 'number') {
      throw new Error('Tank: spawnPosition must have numeric x and y properties');
    }
    if (typeof speed !== 'number' || speed <= 0) {
      throw new Error('Tank: speed must be a positive number');
    }

    this.id = id;
    this.position = { x: spawnPosition.x, y: spawnPosition.y };
    this.direction = 'up'; // Default facing direction
    this.speed = speed;
    this.isAlive = true;
    this.rotation = 0; // Angle in degrees (0=up, 90=right, 180=down, 270=left)
  }

  /**
   * Update the tank's facing direction
   * @param {Direction} direction - New direction
   * @throws {Error} If direction is invalid
   */
  setDirection(direction) {
    const validDirections = ['up', 'down', 'left', 'right', 'idle'];
    if (!validDirections.includes(direction)) {
      throw new Error(`Tank: invalid direction "${direction}". Must be one of: ${validDirections.join(', ')}`);
    }
    this.direction = direction;
  }

  /**
   * Calculate velocity vector based on current direction and speed
   * @returns {Velocity} Velocity vector with x and y components
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
   * Set the tank's rotation angle
   * @param {number} angle - Rotation angle in degrees
   */
  rotate(angle) {
    if (typeof angle !== 'number') {
      throw new Error('Tank: angle must be a number');
    }
    this.rotation = ((angle % 360) + 360) % 360;
  }

  /**
   * Update the tank's position
   * @param {Position} newPosition - New position coordinates
   */
  setPosition(newPosition) {
    if (!newPosition || typeof newPosition.x !== 'number' || typeof newPosition.y !== 'number') {
      throw new Error('Tank: newPosition must have numeric x and y properties');
    }
    this.position.x = newPosition.x;
    this.position.y = newPosition.y;
  }

  /**
   * Get current position
   * @returns {Position} Current position coordinates
   */
  getPosition() {
    return { x: this.position.x, y: this.position.y };
  }

  /**
   * Mark tank as destroyed
   */
  destroy() {
    this.isAlive = false;
  }

  /**
   * Respawn tank at given position
   * @param {Position} spawnPosition - Respawn coordinates
   */
  respawn(spawnPosition) {
    this.setPosition(spawnPosition);
    this.direction = 'up';
    this.rotation = 0;
    this.isAlive = true;
  }

  /**
   * Get current state as plain object (for serialization/debugging)
   * @returns {Object} Tank state
   */
  toJSON() {
    return {
      id: this.id,
      position: { ...this.position },
      direction: this.direction,
      speed: this.speed,
      rotation: this.rotation,
      isAlive: this.isAlive
    };
  }
}

export default Tank;
