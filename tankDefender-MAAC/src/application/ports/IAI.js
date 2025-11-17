/**
 * IAI - Port interface for enemy AI behavior
 *
 * Defines the contract for AI services that handle enemy decision-making,
 * targeting priorities, shooting logic, and movement direction changes.
 */
export const IAI = {
  /**
   * Updates enemy AI behavior and returns movement/shooting decisions
   * @param {Enemy} enemy - The enemy entity to update
   * @param {number} currentTime - Current game time in milliseconds
   * @param {Object} gameState - Current game state with base and players
   * @param {Object} gameState.base - Base position {x, y}
   * @param {Array<Object>} gameState.players - Array of player positions [{x, y}, ...]
   * @returns {Object} Decision object {direction: string, shouldShoot: boolean}
   */
  update(enemy, currentTime, gameState) {}
};