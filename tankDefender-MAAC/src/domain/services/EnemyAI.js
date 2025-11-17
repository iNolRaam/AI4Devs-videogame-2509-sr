/**
 * EnemyAI - Service for enemy AI behavior and decision-making
 *
 * Manages enemy targeting priorities, shooting timing, and direction changes
 * based on game state and targeting calculations.
 */
export class EnemyAI {
  /**
   * @param {TargetingService} targetingService - Service for targeting calculations
   */
  constructor(targetingService) {
    this.targetingService = targetingService;
    this.shootingInterval = 3000; // 3 seconds
  }

  /**
   * Updates enemy AI behavior and returns movement/shooting decisions
   * @param {Enemy} enemy - The enemy entity to update
   * @param {number} currentTime - Current game time in milliseconds
   * @param {Object} gameState - Current game state with base and players
   * @param {Object} gameState.base - Base position {x, y}
   * @param {Array<Object>} gameState.players - Array of player positions [{x, y}, ...]
   * @returns {Object} Decision object {direction: string, shouldShoot: boolean}
   */
  update(enemy, currentTime, gameState) {
    let direction = enemy.direction; // Default to current direction
    let shouldShoot = false;

    // Handle shooting logic
    if (this._shouldShoot(enemy, currentTime, gameState)) {
      shouldShoot = true;
      enemy.lastShotTime = currentTime;
    }

    // Handle direction change logic
    if (this._shouldChangeDirection(enemy, currentTime)) {
      direction = this._calculateNewDirection(enemy, gameState);
      enemy.direction = direction;
      enemy.lastDirectionChangeTime = currentTime;
      enemy.directionChangeInterval = this._randomInterval(2000, 4000); // 2-4 seconds
    }

    return { direction, shouldShoot };
  }

  /**
   * Determines if enemy should shoot based on alignment and timing
   * @private
   * @param {Enemy} enemy - The enemy entity
   * @param {number} currentTime - Current time
   * @param {Object} gameState - Game state
   * @returns {boolean} True if should shoot
   */
  _shouldShoot(enemy, currentTime, gameState) {
    const timeSinceLastShot = currentTime - enemy.lastShotTime;
    const isAligned = this.targetingService.isAlignedWithTarget(
      enemy.position,
      gameState.base,
      gameState.players
    );

    return timeSinceLastShot >= this.shootingInterval && isAligned;
  }

  /**
   * Determines if enemy should change direction based on timing
   * @private
   * @param {Enemy} enemy - The enemy entity
   * @param {number} currentTime - Current time
   * @returns {boolean} True if should change direction
   */
  _shouldChangeDirection(enemy, currentTime) {
    const timeSinceLastChange = currentTime - enemy.lastDirectionChangeTime;
    return timeSinceLastChange >= enemy.directionChangeInterval;
  }

  /**
   * Calculates new direction based on targeting priority
   * @private
   * @param {Enemy} enemy - The enemy entity
   * @param {Object} gameState - Game state
   * @returns {string} New direction ('up', 'down', 'left', 'right')
   */
  _calculateNewDirection(enemy, gameState) {
    // 70% chance to target base, 30% chance to target nearest player
    const targetBase = Math.random() < 0.7;
    let targetPosition;

    if (targetBase) {
      targetPosition = gameState.base;
    } else {
      targetPosition = this.targetingService.getNearestPlayer(
        enemy.position,
        gameState.players
      );
      // If no players, fall back to base
      if (!targetPosition) {
        targetPosition = gameState.base;
      }
    }

    return this.targetingService.getDirectionToTarget(enemy.position, targetPosition);
  }

  /**
   * Generates a random interval between min and max (inclusive)
   * @private
   * @param {number} min - Minimum value in milliseconds
   * @param {number} max - Maximum value in milliseconds
   * @returns {number} Random interval
   */
  _randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}