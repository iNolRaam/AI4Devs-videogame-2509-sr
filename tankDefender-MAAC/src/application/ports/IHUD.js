/**
 * IHUD - Port interface for HUD (Heads-Up Display) operations
 *
 * Defines the contract for HUD services that manage on-screen display
 * of game information like lives, enemies remaining, level, etc.
 */
export const IHUD = {
  /**
   * Updates the display of remaining enemies count
   * @param {number} count - Number of enemies remaining to defeat
   */
  updateEnemiesRemaining(count) {}
};