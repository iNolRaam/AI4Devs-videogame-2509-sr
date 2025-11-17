/**
 * TankSpriteAdapter — IRenderer Implementation
 * 
 * Wraps Phaser sprite rendering and implements IRenderer port interface.
 * 
 * @module adapters/rendering/TankSpriteAdapter
 * @implements {IRenderer}
 */

/**
 * @typedef {import('../../application/ports/IRenderer.js').IRenderer} IRenderer
 */

/**
 * Adapter for Phaser sprite rendering
 * @implements {IRenderer}
 */
class TankSpriteAdapter {
  /**
   * Create sprite renderer adapter
   * @param {Phaser.Scene} scene - Phaser scene instance (optional, for future sprite creation)
   */
  constructor(scene = null) {
    this.scene = scene;
    
    /**
     * Registry mapping entity IDs to Phaser sprites
     * @type {Map<string, Phaser.GameObjects.Sprite>}
     */
    this.sprites = new Map();
  }

  /**
   * Register a sprite for an entity
   * @param {string} entityId - Entity identifier (e.g., 'P1', 'P2')
   * @param {Phaser.GameObjects.Sprite} sprite - Phaser sprite instance
   */
  registerSprite(entityId, sprite) {
    if (!entityId || !sprite) {
      throw new Error('TankSpriteAdapter: entityId and sprite are required');
    }
    this.sprites.set(entityId, sprite);
  }

  /**
   * Get sprite for an entity ID
   * @private
   * @param {string} entityId - Entity identifier
   * @returns {Phaser.GameObjects.Sprite}
   */
  _getSprite(entityId) {
    const sprite = this.sprites.get(entityId);
    if (!sprite) {
      throw new Error(`TankSpriteAdapter: sprite for "${entityId}" not registered`);
    }
    return sprite;
  }

  /**
   * Set rotation angle of an entity's sprite
   * @param {string} entityId - Entity identifier
   * @param {number} angle - Rotation angle in degrees
   */
  setRotation(entityId, angle) {
    const sprite = this._getSprite(entityId);
    // Convert degrees to radians for Phaser
    sprite.angle = angle;
  }

  /**
   * Set position of an entity's sprite
   * @param {string} entityId - Entity identifier
   * @param {{ x: number, y: number }} position - World coordinates
   */
  setPosition(entityId, position) {
    const sprite = this._getSprite(entityId);
    sprite.setPosition(position.x, position.y);
  }

  /**
   * Get current position of an entity's sprite
   * @param {string} entityId - Entity identifier
   * @returns {{ x: number, y: number }} Current position
   */
  getPosition(entityId) {
    const sprite = this._getSprite(entityId);
    return {
      x: sprite.x,
      y: sprite.y
    };
  }

  /**
   * Set visibility of an entity's sprite
   * @param {string} entityId - Entity identifier
   * @param {boolean} visible - Visibility state
   */
  setVisible(entityId, visible) {
    const sprite = this._getSprite(entityId);
    sprite.setVisible(visible);
  }

  /**
   * Set sprite tint/color
   * @param {string} entityId - Entity identifier
   * @param {number} color - Hexadecimal color code
   */
  setTint(entityId, color) {
    const sprite = this._getSprite(entityId);
    sprite.setTint(color);
  }

  /**
   * Clear tint (restore original color)
   * @param {string} entityId - Entity identifier
   */
  clearTint(entityId) {
    const sprite = this._getSprite(entityId);
    sprite.clearTint();
  }

  /**
   * Set sprite alpha (transparency)
   * @param {string} entityId - Entity identifier
   * @param {number} alpha - Alpha value (0.0 to 1.0)
   */
  setAlpha(entityId, alpha) {
    const sprite = this._getSprite(entityId);
    sprite.setAlpha(alpha);
  }

  /**
   * Set sprite scale
   * @param {string} entityId - Entity identifier
   * @param {number} scale - Scale factor (1.0 = original size)
   */
  setScale(entityId, scale) {
    const sprite = this._getSprite(entityId);
    sprite.setScale(scale);
  }

  /**
   * Destroy sprite and remove from registry
   * @param {string} entityId - Entity identifier
   */
  destroySprite(entityId) {
    const sprite = this._getSprite(entityId);
    sprite.destroy();
    this.sprites.delete(entityId);
  }
}

export default TankSpriteAdapter;
