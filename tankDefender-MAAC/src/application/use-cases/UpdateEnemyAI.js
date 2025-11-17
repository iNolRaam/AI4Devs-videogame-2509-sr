/**
 * UpdateEnemyAI Use Case
 *
 * Orchestrates AI decision-making, movement updates, and shooting for enemies
 * through ports. Handles the complete enemy behavior update cycle.
 *
 * @module application/use-cases/UpdateEnemyAI
 */

import { calculateVelocity } from '../../domain/services/MovementService.js';

/**
 * UpdateEnemyAI Use Case Class
 *
 * @implements {function}
 */
class UpdateEnemyAI {
  /**
   * Create UpdateEnemyAI use case
   * @param {IAI} enemyAI - Enemy AI port implementation
   * @param {Object} movementService - Movement service with calculateVelocity method
   * @param {IEnemyRenderer} enemyRenderer - Enemy renderer port implementation
   * @param {IProjectileSystem} projectileSystem - Projectile system port implementation
   */
  constructor(enemyAI, movementService, enemyRenderer, projectileSystem) {
    if (!enemyAI || typeof enemyAI.update !== 'function') {
      throw new Error('UpdateEnemyAI: enemyAI must implement IAI interface');
    }

    if (!movementService || typeof movementService.calculateVelocity !== 'function') {
      throw new Error('UpdateEnemyAI: movementService must have calculateVelocity method');
    }

    if (!enemyRenderer || typeof enemyRenderer.updateEnemy !== 'function') {
      throw new Error('UpdateEnemyAI: enemyRenderer must implement IEnemyRenderer interface');
    }

    if (!projectileSystem || typeof projectileSystem.fireProjectile !== 'function') {
      throw new Error('UpdateEnemyAI: projectileSystem must implement IProjectileSystem interface');
    }

    this.enemyAI = enemyAI;
    this.movementService = movementService;
    this.enemyRenderer = enemyRenderer;
    this.projectileSystem = projectileSystem;
  }

  /**
   * Execute enemy AI update
   * @param {Enemy} enemy - Enemy entity to update
   * @param {number} currentTime - Current game time in milliseconds
   * @param {Object} gameState - Current game state (base position, players, etc.)
   */
  execute(enemy, currentTime, gameState) {
    if (!enemy || !enemy.id) {
      throw new Error('UpdateEnemyAI: enemy must be a valid Enemy entity');
    }

    if (typeof currentTime !== 'number' || currentTime < 0) {
      throw new Error('UpdateEnemyAI: currentTime must be a non-negative number');
    }

    if (!gameState) {
      throw new Error('UpdateEnemyAI: gameState is required');
    }

    // Get AI decisions (direction and shooting)
    const { direction, shouldShoot } = this.enemyAI.update(enemy, currentTime, gameState);

    // Handle shooting if AI decided to shoot (before movement)
    if (shouldShoot) {
      this.projectileSystem.fireProjectile(
        enemy.id,
        { ...enemy.position }, // Copy position to avoid reference issues
        direction,
        'enemy'
      );
    }

    // Calculate velocity based on direction and enemy speed
    const velocity = this.movementService.calculateVelocity(direction, enemy.speed);

    // Update enemy position based on velocity (simple movement for now)
    enemy.position.x += velocity.x;
    enemy.position.y += velocity.y;
    enemy.direction = direction;

    // Update rendering
    this.enemyRenderer.updateEnemy(enemy, direction, velocity);
  }
}

export default UpdateEnemyAI;