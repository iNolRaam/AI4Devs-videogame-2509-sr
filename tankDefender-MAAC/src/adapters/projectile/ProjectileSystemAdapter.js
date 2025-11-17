/**
 * ProjectileSystemAdapter - Phaser adapter for projectile management
 *
 * Handles firing, updating, and collision detection for projectiles
 * using Phaser physics and sprites.
 *
 * @module adapters/projectile/ProjectileSystemAdapter
 */

import { IProjectileSystem } from '../../application/ports/IProjectileSystem.js';

/**
 * Phaser adapter implementing projectile system port
 * @implements {IProjectileSystem}
 */
class ProjectileSystemAdapter {
  /**
   * @param {Phaser.Scene} scene - Phaser scene instance
   * @param {PhaserPhysicsAdapter} physicsAdapter - Physics adapter for collision setup
   */
  constructor(scene, physicsAdapter) {
    this.scene = scene;
    this.physicsAdapter = physicsAdapter;
    this.projectiles = new Map(); // projectileId -> { sprite, shooterId, shooterType }
    this.nextProjectileId = 1;
  }

  /**
   * Fires a projectile from the specified position and direction
   * @param {string} shooterId - ID of the entity firing the projectile
   * @param {{ x: number, y: number }} position - Starting position of the projectile
   * @param {string} direction - Direction to fire ('up', 'down', 'left', 'right')
   * @param {string} shooterType - Type of shooter ('player' or 'enemy')
   */
  fireProjectile(shooterId, position, direction, shooterType) {
    const projectileId = `projectile_${this.nextProjectileId++}`;

    // Create projectile sprite (small colored rectangle)
    const color = shooterType === 'player' ? 0x00ff00 : 0xff0000; // Green for player, red for enemy
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, 8, 8);
    graphics.generateTexture(`projectile_${projectileId}`, 8, 8);
    graphics.destroy();

    const sprite = this.scene.physics.add.sprite(position.x, position.y, `projectile_${projectileId}`);
    sprite.setCollideWorldBounds(true);

    // Set velocity based on direction
    const speed = 300;
    switch (direction) {
      case 'up':
        sprite.setVelocity(0, -speed);
        break;
      case 'down':
        sprite.setVelocity(0, speed);
        break;
      case 'left':
        sprite.setVelocity(-speed, 0);
        break;
      case 'right':
        sprite.setVelocity(speed, 0);
        break;
    }

    // Store projectile data
    this.projectiles.set(projectileId, {
      sprite,
      shooterId,
      shooterType,
      direction
    });

    // Set up collision with walls
    if (this.physicsAdapter.walls) {
      this.scene.physics.add.collider(sprite, this.physicsAdapter.walls, () => {
        this._destroyProjectile(projectileId);
      });
    }

    return projectileId;
  }

  /**
   * Updates all active projectiles
   * @param {number} delta - Time since last frame (ms)
   */
  update(delta) {
    // Remove projectiles that are out of bounds or collided
    for (const [projectileId, projectile] of this.projectiles) {
      const sprite = projectile.sprite;

      // Check if projectile is out of bounds
      if (sprite.x < 0 || sprite.x > 800 || sprite.y < 0 || sprite.y > 600) {
        this._destroyProjectile(projectileId);
      }
    }
  }

  /**
   * Destroys a projectile and cleans up resources
   * @private
   * @param {string} projectileId - ID of projectile to destroy
   */
  _destroyProjectile(projectileId) {
    const projectile = this.projectiles.get(projectileId);
    if (projectile) {
      projectile.sprite.destroy();
      this.projectiles.delete(projectileId);
    }
  }

  /**
   * Gets all active projectiles
   * @returns {Array} Array of projectile data
   */
  getActiveProjectiles() {
    return Array.from(this.projectiles.values());
  }

  /**
   * Sets up collision between projectiles and targets
   * @param {string} targetId - ID of target entity
   * @param {Phaser.Sprite} targetSprite - Target sprite
   * @param {Function} onHit - Callback when projectile hits target
   */
  setupProjectileCollision(targetId, targetSprite, onHit) {
    for (const [projectileId, projectile] of this.projectiles) {
      // Only collide with projectiles from opposite shooter type
      const isEnemyProjectile = projectile.shooterType === 'enemy';
      const isPlayerTarget = targetId.startsWith('P');

      if ((isEnemyProjectile && isPlayerTarget) || (!isEnemyProjectile && !isPlayerTarget)) {
        this.scene.physics.add.overlap(projectile.sprite, targetSprite, () => {
          onHit(projectileId, targetId);
          this._destroyProjectile(projectileId);
        });
      }
    }
  }
}

export default ProjectileSystemAdapter;