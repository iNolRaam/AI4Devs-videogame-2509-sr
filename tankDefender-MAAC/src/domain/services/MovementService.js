/**
 * MovementService — Domain Layer
 * 
 * Pure functions for movement calculations and direction-to-angle conversions.
 * No external dependencies or side effects.
 * 
 * @module domain/services/MovementService
 */

/**
 * @typedef {'up' | 'down' | 'left' | 'right' | 'idle'} Direction
 * @typedef {{ x: number; y: number }} Velocity
 */

/**
 * Calculate velocity vector from direction and speed
 * 
 * @param {Direction} direction - Movement direction
 * @param {number} speed - Movement speed in pixels per second
 * @returns {Velocity} Velocity vector with x and y components
 * @throws {Error} If direction is invalid or speed is not a positive number
 * 
 * @example
 * calculateVelocity('up', 120) // { x: 0, y: -120 }
 * calculateVelocity('right', 100) // { x: 100, y: 0 }
 * calculateVelocity('idle', 120) // { x: 0, y: 0 }
 */
export function calculateVelocity(direction, speed) {
  const validDirections = ['up', 'down', 'left', 'right', 'idle'];
  
  if (!validDirections.includes(direction)) {
    throw new Error(`MovementService: invalid direction "${direction}". Must be one of: ${validDirections.join(', ')}`);
  }
  
  if (typeof speed !== 'number' || speed < 0) {
    throw new Error('MovementService: speed must be a non-negative number');
  }

  const velocityMap = {
    'up': { x: 0, y: speed === 0 ? 0 : -Math.abs(speed) },
    'down': { x: 0, y: speed === 0 ? 0 : Math.abs(speed) },
    'left': { x: speed === 0 ? 0 : -Math.abs(speed), y: 0 },
    'right': { x: speed === 0 ? 0 : Math.abs(speed), y: 0 },
    'idle': { x: 0, y: 0 }
  };

  return velocityMap[direction];
}

/**
 * Convert direction to rotation angle in degrees
 * 
 * @param {Direction} direction - Movement direction
 * @returns {number} Rotation angle in degrees (0=up, 90=right, 180=down, 270=left)
 * @throws {Error} If direction is invalid or is 'idle'
 * 
 * @example
 * directionToAngle('up') // 0
 * directionToAngle('right') // 90
 * directionToAngle('down') // 180
 * directionToAngle('left') // 270
 */
export function directionToAngle(direction) {
  const angleMap = {
    'up': 0,
    'right': 90,
    'down': 180,
    'left': 270
  };

  if (direction === 'idle') {
    return null;
  }

  if (!angleMap.hasOwnProperty(direction)) {
    throw new Error(`MovementService: invalid direction "${direction}". Must be one of: up, down, left, right`);
  }

  return angleMap[direction];
}

/**
 * Convert rotation angle to direction
 * Useful for reverse mapping or sprite analysis
 * 
 * @param {number} angle - Rotation angle in degrees
 * @returns {Direction} Direction corresponding to angle (excludes 'idle')
 * 
 * @example
 * angleToDirection(0) // 'up'
 * angleToDirection(90) // 'right'
 * angleToDirection(360) // 'up' (normalized)
 * angleToDirection(-90) // 'left' (normalized)
 */
export function angleToDirection(angle) {
  if (typeof angle !== 'number') {
    throw new Error('MovementService: angle must be a number');
  }

  // Normalize angle to 0-359 range
  let normalized = angle % 360;
  if (normalized < 0) normalized += 360;

  // Map angle ranges to directions (with tolerance for floating point)
  if (normalized >= 315 || normalized < 45) return 'up';
  if (normalized >= 45 && normalized < 135) return 'right';
  if (normalized >= 135 && normalized < 225) return 'down';
  if (normalized >= 225 && normalized < 315) return 'left';

  return 'up'; // Fallback (shouldn't reach here)
}

/**
 * Check if two directions are opposite
 * Useful for collision resolution or movement constraints
 * 
 * @param {Direction} dir1 - First direction
 * @param {Direction} dir2 - Second direction
 * @returns {boolean} True if directions are opposite
 * 
 * @example
 * areOppositeDirections('up', 'down') // true
 * areOppositeDirections('left', 'right') // true
 * areOppositeDirections('up', 'left') // false
 */
export function areOppositeDirections(dir1, dir2) {
  const validDirections = ['up', 'down', 'left', 'right', 'idle'];
  
  if (!validDirections.includes(dir1)) {
    throw new Error(`MovementService: invalid direction "${dir1}". Must be one of: ${validDirections.join(', ')}`);
  }
  
  if (!validDirections.includes(dir2)) {
    throw new Error(`MovementService: invalid direction "${dir2}". Must be one of: ${validDirections.join(', ')}`);
  }

  const opposites = {
    'up': 'down',
    'down': 'up',
    'left': 'right',
    'right': 'left',
    'idle': null
  };

  return opposites[dir1] === dir2;
}

export default {
  calculateVelocity,
  directionToAngle,
  angleToDirection,
  areOppositeDirections
};
