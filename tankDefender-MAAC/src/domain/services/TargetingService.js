/**
 * TargetingService - Pure functions for enemy targeting calculations
 * 
 * Provides direction calculation, alignment detection, and target selection
 * for enemy AI behavior in Tank Defender.
 */
export class TargetingService {
  /**
   * Calculates the cardinal direction from source to target position
   * @param {Object} source - Source position {x, y}
   * @param {Object} target - Target position {x, y}
   * @returns {string} Cardinal direction: 'up', 'down', 'left', 'right'
   */
  static getDirectionToTarget(source, target) {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    
    // Handle same position
    if (dx === 0 && dy === 0) {
      return 'up'; // Default direction
    }
    
    // Prefer horizontal movement if |dx| >= |dy|, otherwise vertical
    if (Math.abs(dx) >= Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'down' : 'up';
    }
  }

  /**
   * Checks if enemy is aligned with base or any player (same row/column within tolerance)
   * @param {Object} enemyPos - Enemy position {x, y}
   * @param {Object} basePos - Base position {x, y}
   * @param {Array<Object>} players - Array of player positions [{x, y}, ...]
   * @returns {boolean} True if aligned with base or any player
   */
  static isAlignedWithTarget(enemyPos, basePos, players) {
    const tolerance = 32;
    
    // Check alignment with base
    if (Math.abs(enemyPos.x - basePos.x) <= tolerance || 
        Math.abs(enemyPos.y - basePos.y) <= tolerance) {
      return true;
    }
    
    // Check alignment with each player
    for (const player of players) {
      if (Math.abs(enemyPos.x - player.x) <= tolerance || 
          Math.abs(enemyPos.y - player.y) <= tolerance) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Finds the nearest player to the enemy position
   * @param {Object} enemyPos - Enemy position {x, y}
   * @param {Array<Object>} players - Array of player positions [{x, y}, ...]
   * @returns {Object|null} Nearest player position or null if no players
   */
  static getNearestPlayer(enemyPos, players) {
    if (!players || players.length === 0) {
      return null;
    }
    
    let nearestPlayer = players[0];
    let minDistance = this._distance(enemyPos, nearestPlayer);
    
    for (let i = 1; i < players.length; i++) {
      const distance = this._distance(enemyPos, players[i]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPlayer = players[i];
      }
    }
    
    return nearestPlayer;
  }

  /**
   * Calculates Euclidean distance between two positions
   * @private
   * @param {Object} pos1 - First position {x, y}
   * @param {Object} pos2 - Second position {x, y}
   * @returns {number} Euclidean distance
   */
  static _distance(pos1, pos2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.hypot(dx, dy);
  }
}