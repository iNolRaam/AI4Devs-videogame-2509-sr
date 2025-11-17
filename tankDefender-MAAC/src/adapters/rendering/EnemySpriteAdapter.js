/**
 * EnemySpriteAdapter — IEnemyRenderer Implementation
 *
 * Wraps Phaser sprite rendering for enemies and implements IEnemyRenderer port interface.
 * Handles enemy sprite creation, updates, and removal with placeholder visuals.
 *
 * @module adapters/rendering/EnemySpriteAdapter
 * @implements {IEnemyRenderer}
 */

import { directionToAngle } from '../../domain/services/MovementService.js';

/**
 * @typedef {import('../../application/ports/IEnemyRenderer.js').IEnemyRenderer} IEnemyRenderer
 */

/**
 * Adapter for Phaser enemy sprite rendering
 * @implements {IEnemyRenderer}
 */
class EnemySpriteAdapter {
  /**
   * Create enemy sprite renderer adapter
   * @param {Phaser.Scene} scene - Phaser scene instance
   */
  constructor(scene) {
    if (!scene) {
      throw new Error('EnemySpriteAdapter: scene is required');
    }
    this.scene = scene;

    /**
     * Registry mapping enemy IDs to Phaser sprites
     * @type {Map<string, Phaser.GameObjects.Rectangle>}
     */
    this.sprites = new Map();
  }

  /**
   * Create a visual representation for a new enemy
   * @param {Enemy} enemy - The enemy entity to render
   */
  createEnemy(enemy) {
    if (!enemy || !enemy.id) {
      throw new Error('EnemySpriteAdapter: valid enemy entity required');
    }

    // Create placeholder sprite (red rectangle for enemies, distinct from players)
    const sprite = this.scene.add.rectangle(
      enemy.position.x,
      enemy.position.y,
      32, // width
      32, // height
      0xff0000 // red color
    );

    // Enable physics on the sprite
    this.scene.physics.add.existing(sprite);
    sprite.body.setCollideWorldBounds(true);

    // Store reference
    this.sprites.set(enemy.id, sprite);
  }

  /**
   * Update the visual representation of an enemy
   * @param {Enemy} enemy - The enemy entity to update
   * @param {string} direction - Current movement direction
   * @param {Object} velocity - Movement velocity {x, y}
   */
  updateEnemy(enemy, direction, velocity) {
    if (!enemy || !enemy.id) {
      throw new Error('EnemySpriteAdapter: valid enemy entity required');
    }

    const sprite = this.sprites.get(enemy.id);
    if (!sprite) {
      throw new Error(`EnemySpriteAdapter: sprite for enemy "${enemy.id}" not found`);
    }

    // Update sprite position to match enemy position
    sprite.setPosition(enemy.position.x, enemy.position.y);

    // Update rotation based on direction
    const angle = directionToAngle(direction);
    sprite.angle = angle;

    // Update physics velocity
    if (sprite.body) {
      sprite.body.setVelocity(velocity.x, velocity.y);
    }
  }

  /**
   * Remove the visual representation of an enemy
   * @param {string} enemyId - ID of the enemy to remove
   */
  removeEnemy(enemyId) {
    if (!enemyId) {
      throw new Error('EnemySpriteAdapter: enemyId is required');
    }

    const sprite = this.sprites.get(enemyId);
    if (sprite) {
      // Destroy the sprite
      sprite.destroy();
      // Remove from registry
      this.sprites.delete(enemyId);
    }
  }

  /**
   * Get the sprite for an enemy
   * @param {string} enemyId - ID of the enemy
   * @returns {Phaser.GameObjects.Rectangle} The enemy sprite
   */
  getSprite(enemyId) {
    if (!enemyId) {
      throw new Error('EnemySpriteAdapter: enemyId is required');
    }

    const sprite = this.sprites.get(enemyId);
    if (!sprite) {
      throw new Error(`EnemySpriteAdapter: sprite for enemy "${enemyId}" not found`);
    }

    return sprite;
  }
}

export default EnemySpriteAdapter;