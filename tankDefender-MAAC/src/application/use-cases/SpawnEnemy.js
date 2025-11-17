/**
 * SpawnEnemy Use Case
 *
 * Orchestrates enemy spawning through spawn manager, renderer, and physics ports.
 * Handles the complete spawning flow: checking conditions, creating enemy,
 * setting up rendering, and enabling physics.
 *
 * @module application/use-cases/SpawnEnemy
 */

import { ISpawnManager } from '../ports/ISpawnManager.js';
import { IEnemyRenderer } from '../ports/IEnemyRenderer.js';
import { IPhysics } from '../ports/IPhysics.js';

/**
 * SpawnEnemy Use Case Class
 *
 * @implements {function}
 */
class SpawnEnemy {
  /**
   * Create SpawnEnemy use case
   * @param {ISpawnManager} spawnManager - Spawn manager port implementation
   * @param {IEnemyRenderer} enemyRenderer - Enemy renderer port implementation
   * @param {IPhysics} physicsPort - Physics port implementation
   */
  constructor(spawnManager, enemyRenderer, physicsPort) {
    if (!spawnManager || typeof spawnManager.spawnEnemy !== 'function') {
      throw new Error('SpawnEnemy: spawnManager must implement ISpawnManager interface');
    }

    if (!enemyRenderer || typeof enemyRenderer.createEnemy !== 'function') {
      throw new Error('SpawnEnemy: enemyRenderer must implement IEnemyRenderer interface');
    }

    if (!physicsPort || typeof physicsPort.enableBody !== 'function') {
      throw new Error('SpawnEnemy: physicsPort must implement IPhysics interface');
    }

    this.spawnManager = spawnManager;
    this.enemyRenderer = enemyRenderer;
    this.physicsPort = physicsPort;
  }

  /**
   * Execute enemy spawning
   * @param {number} currentTime - Current game time in milliseconds
   * @returns {Enemy|null} The spawned enemy or null if spawn conditions not met
   */
  execute(currentTime) {
    if (typeof currentTime !== 'number' || currentTime < 0) {
      throw new Error('SpawnEnemy: currentTime must be a non-negative number');
    }

    // Attempt to spawn enemy through spawn manager
    const enemy = this.spawnManager.spawnEnemy(currentTime);

    if (!enemy) {
      // Spawn conditions not met (no reserve, active limit reached, or delay not elapsed)
      return null;
    }

    // Enemy successfully spawned - set up rendering and physics
    this.enemyRenderer.createEnemy(enemy);
    this.physicsPort.enableBody(enemy.id, enemy.position);

    return enemy;
  }
}

export default SpawnEnemy;