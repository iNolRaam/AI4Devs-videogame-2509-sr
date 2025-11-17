/**
 * DestroyEnemy Use Case
 *
 * Handles enemy destruction and cleanup through spawn manager, renderer,
 * physics, and HUD ports. Ensures complete removal of enemy from game.
 *
 * @module application/use-cases/DestroyEnemy
 */

import { ISpawnManager } from '../ports/ISpawnManager.js';
import { IEnemyRenderer } from '../ports/IEnemyRenderer.js';
import { IPhysics } from '../ports/IPhysics.js';
import { IHUD } from '../ports/IHUD.js';

/**
 * DestroyEnemy Use Case Class
 *
 * @implements {function}
 */
class DestroyEnemy {
  /**
   * Create DestroyEnemy use case
   * @param {ISpawnManager} spawnManager - Spawn manager port implementation
   * @param {IEnemyRenderer} enemyRenderer - Enemy renderer port implementation
   * @param {IPhysics} physicsPort - Physics port implementation
   * @param {IHUD} hudPort - HUD port implementation
   */
  constructor(spawnManager, enemyRenderer, physicsPort, hudPort) {
    if (!spawnManager || typeof spawnManager.removeEnemy !== 'function') {
      throw new Error('DestroyEnemy: spawnManager must implement ISpawnManager interface');
    }

    if (!enemyRenderer || typeof enemyRenderer.removeEnemy !== 'function') {
      throw new Error('DestroyEnemy: enemyRenderer must implement IEnemyRenderer interface');
    }

    if (!physicsPort || typeof physicsPort.disableBody !== 'function') {
      throw new Error('DestroyEnemy: physicsPort must implement IPhysics interface');
    }

    if (!hudPort || typeof hudPort.updateEnemiesRemaining !== 'function') {
      throw new Error('DestroyEnemy: hudPort must implement IHUD interface');
    }

    this.spawnManager = spawnManager;
    this.enemyRenderer = enemyRenderer;
    this.physicsPort = physicsPort;
    this.hudPort = hudPort;
  }

  /**
   * Execute enemy destruction
   * @param {string} enemyId - ID of the enemy to destroy
   */
  execute(enemyId) {
    if (!enemyId || typeof enemyId !== 'string') {
      throw new Error('DestroyEnemy: enemyId must be a non-empty string');
    }

    // Remove from spawn manager (updates active list)
    this.spawnManager.removeEnemy(enemyId);

    // Remove visual representation
    this.enemyRenderer.removeEnemy(enemyId);

    // Cleanup physics body
    this.physicsPort.disableBody(enemyId);

    // Update HUD with new remaining count
    const remainingCount = this.spawnManager.getRemainingCount();
    this.hudPort.updateEnemiesRemaining(remainingCount);
  }
}

export default DestroyEnemy;