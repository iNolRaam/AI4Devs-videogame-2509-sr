/**
 * ISpawnManager - Port interface for enemy spawn management
 *
 * Defines the contract for spawn management services that handle
 * enemy spawning lifecycle, reserve tracking, and spawn limits.
 */
export const ISpawnManager = {
  /**
   * Checks if an enemy can be spawned at the current time
   * @param {number} currentTime - Current game time in milliseconds
   * @returns {boolean} True if spawning conditions are met
   */
  canSpawn(currentTime) {},

  /**
   * Spawns a new enemy if conditions allow
   * @param {number} currentTime - Current game time in milliseconds
   * @returns {Enemy|null} The spawned enemy or null if spawn failed
   */
  spawnEnemy(currentTime) {},

  /**
   * Removes an enemy from the active list
   * @param {string} enemyId - ID of the enemy to remove
   */
  removeEnemy(enemyId) {},

  /**
   * Gets the total remaining enemy count (reserve + active)
   * @returns {number} Total remaining enemies
   */
  getRemainingCount() {},

  /**
   * Gets the list of currently active enemies
   * @returns {Enemy[]} Array of active enemy entities
   */
  getActiveEnemies() {}
};