/**
 * IEnemyRenderer - Port interface for enemy rendering
 *
 * Defines the contract for rendering services that handle enemy sprite
 * creation, updates, and removal in the game scene.
 */
export const IEnemyRenderer = {
  /**
   * Creates a visual representation for a new enemy
   * @param {Enemy} enemy - The enemy entity to render
   */
  createEnemy(enemy) {},

  /**
   * Updates the visual representation of an enemy
   * @param {Enemy} enemy - The enemy entity to update
   * @param {string} direction - Current movement direction
   * @param {Object} velocity - Movement velocity {x, y}
   */
  updateEnemy(enemy, direction, velocity) {},

  /**
   * Removes the visual representation of an enemy
   * @param {string} enemyId - ID of the enemy to remove
   */
  removeEnemy(enemyId) {}
};