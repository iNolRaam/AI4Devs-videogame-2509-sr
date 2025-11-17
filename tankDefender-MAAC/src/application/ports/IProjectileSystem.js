/**
 * IProjectileSystem - Port interface for projectile management
 *
 * Defines the contract for projectile systems that handle firing,
 * updating, and collision detection for projectiles.
 */
export const IProjectileSystem = {
  /**
   * Fires a projectile from the specified position and direction
   * @param {string} shooterId - ID of the entity firing the projectile
   * @param {{ x: number, y: number }} position - Starting position of the projectile
   * @param {string} direction - Direction to fire ('up', 'down', 'left', 'right')
   * @param {string} shooterType - Type of shooter ('player' or 'enemy')
   */
  fireProjectile(shooterId, position, direction, shooterType) {}
};