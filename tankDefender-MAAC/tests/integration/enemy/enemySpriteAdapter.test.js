import { describe, it, expect, vi, beforeEach } from 'vitest';
import EnemySpriteAdapter from '../../../src/adapters/rendering/EnemySpriteAdapter.js';
import Enemy from '../../../src/domain/entities/Enemy.js';

describe('EnemySpriteAdapter Integration', () => {
  let adapter;
  let mockScene;
  let mockSprite;
  let mockPhysics;

  beforeEach(() => {
    // Mock Phaser sprite
    mockSprite = {
      setPosition: vi.fn(),
      setTint: vi.fn(),
      destroy: vi.fn(),
      angle: 0,
      x: 0,
      y: 0,
      body: {
        setVelocity: vi.fn(),
        setCollideWorldBounds: vi.fn()
      }
    };

    // Mock Phaser physics
    mockPhysics = {
      add: {
        existing: vi.fn()
      }
    };

    // Mock Phaser scene
    mockScene = {
      add: {
        rectangle: vi.fn().mockReturnValue(mockSprite)
      },
      physics: mockPhysics
    };

    adapter = new EnemySpriteAdapter(mockScene);
  });

  describe('constructor', () => {
    it('should initialize with Phaser scene', () => {
      expect(adapter.scene).toBe(mockScene);
      expect(adapter.sprites).toBeInstanceOf(Map);
    });

    it('should throw error if scene is not provided', () => {
      expect(() => new EnemySpriteAdapter()).toThrow('EnemySpriteAdapter: scene is required');
    });
  });

  describe('createEnemy', () => {
    it('should create sprite at enemy position', () => {
      const enemy = new Enemy('enemy1', { x: 100, y: 50 }, 'regular');

      adapter.createEnemy(enemy);

      expect(mockScene.add.rectangle).toHaveBeenCalledWith(100, 50, 32, 32, 0xff0000);
      expect(mockPhysics.add.existing).toHaveBeenCalledWith(mockSprite);
      expect(mockSprite.body.setCollideWorldBounds).toHaveBeenCalledWith(true);
      expect(adapter.sprites.get('enemy1')).toBe(mockSprite);
    });

    it('should handle different enemy positions and types', () => {
      const enemy = new Enemy('enemy2', { x: 200, y: 75 }, 'fast');

      adapter.createEnemy(enemy);

      expect(mockScene.add.rectangle).toHaveBeenCalledWith(200, 75, 32, 32, 0xff0000);
      expect(adapter.sprites.get('enemy2')).toBe(mockSprite);
    });

    it('should throw error for invalid enemy', () => {
      expect(() => adapter.createEnemy(null)).toThrow('EnemySpriteAdapter: valid enemy entity required');
      expect(() => adapter.createEnemy({})).toThrow('EnemySpriteAdapter: valid enemy entity required');
    });
  });

  describe('updateEnemy', () => {
    it('should update sprite position, rotation, and velocity', () => {
      const enemy = new Enemy('enemy1', { x: 100, y: 50 }, 'regular');
      enemy.position = { x: 150, y: 75 };

      adapter.sprites.set('enemy1', mockSprite);

      adapter.updateEnemy(enemy, 'right', { x: 84, y: 0 });

      expect(mockSprite.setPosition).toHaveBeenCalledWith(150, 75);
      expect(mockSprite.angle).toBe(90); // right direction
      expect(mockSprite.body.setVelocity).toHaveBeenCalledWith(84, 0);
    });

    it('should handle different directions', () => {
      const enemy = new Enemy('enemy1', { x: 100, y: 100 }, 'regular');
      adapter.sprites.set('enemy1', mockSprite);

      adapter.updateEnemy(enemy, 'up', { x: 0, y: -84 });
      expect(mockSprite.angle).toBe(0);

      adapter.updateEnemy(enemy, 'down', { x: 0, y: 84 });
      expect(mockSprite.angle).toBe(180);

      adapter.updateEnemy(enemy, 'left', { x: -84, y: 0 });
      expect(mockSprite.angle).toBe(270);
    });

    it('should throw error for enemy not in registry', () => {
      const enemy = new Enemy('unknown', { x: 100, y: 50 }, 'regular');

      expect(() => adapter.updateEnemy(enemy, 'up', { x: 0, y: -84 }))
        .toThrow('EnemySpriteAdapter: sprite for enemy "unknown" not found');
    });

    it('should throw error for invalid enemy', () => {
      expect(() => adapter.updateEnemy(null, 'up', { x: 0, y: 0 }))
        .toThrow('EnemySpriteAdapter: valid enemy entity required');
    });
  });

  describe('removeEnemy', () => {
    it('should destroy sprite and remove from registry', () => {
      adapter.sprites.set('enemy1', mockSprite);

      adapter.removeEnemy('enemy1');

      expect(mockSprite.destroy).toHaveBeenCalled();
      expect(adapter.sprites.has('enemy1')).toBe(false);
    });

    it('should handle enemy not in registry gracefully', () => {
      adapter.removeEnemy('nonexistent');

      expect(mockSprite.destroy).not.toHaveBeenCalled();
    });

    it('should throw error for invalid enemyId', () => {
      expect(() => adapter.removeEnemy(null)).toThrow('EnemySpriteAdapter: enemyId is required');
    });
  });
});