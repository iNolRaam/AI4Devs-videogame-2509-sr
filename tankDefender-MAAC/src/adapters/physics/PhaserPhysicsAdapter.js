/**
 * PhaserPhysicsAdapter — IPhysics Implementation
 * 
 * Wraps Phaser Arcade Physics and implements IPhysics port interface.
 * 
 * @module adapters/physics/PhaserPhysicsAdapter
 * @implements {IPhysics}
 */

/**
 * @typedef {import('../../application/ports/IPhysics.js').IPhysics} IPhysics
 */

/**
 * Adapter for Phaser Arcade Physics
 * @implements {IPhysics}
 */
class PhaserPhysicsAdapter {
  /**
   * Create physics adapter
   * @param {Phaser.Physics.Arcade.ArcadePhysics} physics - Phaser physics system
   */
  constructor(physics) {
    if (!physics) {
      throw new Error('PhaserPhysicsAdapter: physics system is required');
    }
    this.physics = physics;
    
    /**
     * Registry mapping entity IDs to Phaser sprites
     * @type {Map<string, Phaser.GameObjects.Sprite>}
     */
    this.entities = new Map();
    
    /**
     * Registry mapping layer names to Phaser tilemap layers
     * @type {Map<string, Phaser.Tilemaps.TilemapLayer>}
     */
    this.layers = new Map();
  }

  /**
   * Register an entity sprite for physics operations
   * @param {string} entityId - Entity identifier (e.g., 'P1', 'P2')
   * @param {Phaser.GameObjects.Sprite} sprite - Phaser sprite instance
   */
  registerEntity(entityId, sprite) {
    if (!entityId || !sprite) {
      throw new Error('PhaserPhysicsAdapter: entityId and sprite are required');
    }
    this.entities.set(entityId, sprite);
  }

  /**
   * Register a tilemap layer for collision
   * @param {string} layerName - Layer identifier (e.g., 'brickLayer', 'steelLayer')
   * @param {Phaser.Tilemaps.TilemapLayer} layer - Tilemap layer instance
   */
  registerLayer(layerName, layer) {
    if (!layerName || !layer) {
      throw new Error('PhaserPhysicsAdapter: layerName and layer are required');
    }
    this.layers.set(layerName, layer);
  }

  /**
   * Get sprite for an entity ID
   * @private
   * @param {string} entityId - Entity identifier
   * @returns {Phaser.GameObjects.Sprite}
   */
  _getSprite(entityId) {
    const sprite = this.entities.get(entityId);
    if (!sprite) {
      throw new Error(`PhaserPhysicsAdapter: entity "${entityId}" not registered`);
    }
    return sprite;
  }

  /**
   * Set velocity of an entity's physics body
   * @param {string} entityId - Entity identifier
   * @param {{ x: number, y: number }} velocity - Velocity vector in pixels per second
   */
  setVelocity(entityId, velocity) {
    const sprite = this._getSprite(entityId);
    
    if (!sprite.body) {
      throw new Error(`PhaserPhysicsAdapter: entity "${entityId}" has no physics body`);
    }
    
    sprite.body.setVelocity(velocity.x, velocity.y);
  }

  /**
   * Enable collision between two entities or entity and layer/group
   * @param {string} entityA - First entity identifier
   * @param {string|Phaser.Physics.Arcade.StaticGroup|Phaser.GameObjects.Sprite} entityB - Second entity identifier, layer name, or Phaser object
   */
  enableCollision(entityA, entityB) {
    const spriteA = this._getSprite(entityA);
    
    // Check if entityB is a direct Phaser object (StaticGroup, Sprite, etc.)
    if (typeof entityB === 'object' && entityB !== null) {
      this.physics.add.collider(spriteA, entityB);
      return;
    }
    
    // Check if entityB is a layer name
    const layer = this.layers.get(entityB);
    if (layer) {
      this.physics.add.collider(spriteA, layer);
      return;
    }
    
    // Otherwise treat as entity ID
    const spriteB = this._getSprite(entityB);
    this.physics.add.collider(spriteA, spriteB);
  }

  /**
   * Register a collision callback
   * @param {string} entityA - First entity identifier
   * @param {string|Phaser.GameObjects.Sprite|Phaser.Physics.Arcade.StaticGroup} entityB - Second entity identifier, layer name, or Phaser object
   * @param {Function} callback - Function called on collision
   */
  onCollide(entityA, entityB, callback) {
    const spriteA = this._getSprite(entityA);
    
    // Check if entityB is a layer
    const layer = this.layers.get(entityB);
    if (layer) {
      this.physics.add.overlap(spriteA, layer, callback);
      return;
    }
    
    // Check if entityB is a registered entity
    if (typeof entityB === 'string') {
      const spriteB = this._getSprite(entityB);
      this.physics.add.overlap(spriteA, spriteB, callback);
      return;
    }
    
    // Otherwise treat as Phaser object
    this.physics.add.overlap(spriteA, entityB, callback);
  }

  /**
   * Get current velocity of an entity
   * @param {string} entityId - Entity identifier
   * @returns {{ x: number, y: number }} Current velocity vector
   */
  getVelocity(entityId) {
    const sprite = this._getSprite(entityId);
    
    if (!sprite.body) {
      return { x: 0, y: 0 };
    }
    
    return {
      x: sprite.body.velocity.x,
      y: sprite.body.velocity.y
    };
  }

  /**
   * Stop entity movement (set velocity to zero)
   * @param {string} entityId - Entity identifier
   */
  stop(entityId) {
    this.setVelocity(entityId, { x: 0, y: 0 });
  }

  /**
   * Enable physics body for a sprite
   * @param {string} entityId - Entity identifier
   */
  enableBody(entityId) {
    const sprite = this._getSprite(entityId);
    this.physics.world.enable(sprite);
  }

  /**
   * Set collision boundaries for the world
   * @param {number} x - X coordinate of world bounds
   * @param {number} y - Y coordinate of world bounds  
   * @param {number} width - Width of world bounds
   * @param {number} height - Height of world bounds
   */
  setWorldBounds(x, y, width, height) {
    this.physics.world.setBounds(x, y, width, height);
  }
}

export default PhaserPhysicsAdapter;
