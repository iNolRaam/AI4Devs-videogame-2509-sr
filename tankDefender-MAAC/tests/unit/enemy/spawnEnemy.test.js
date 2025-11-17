import { describe, it, expect, vi, beforeEach } from 'vitest';
import SpawnEnemy from '../../../src/application/use-cases/SpawnEnemy.js';
import Enemy from '../../../src/domain/entities/Enemy.js';

describe('SpawnEnemy Use Case', () => {
  let spawnEnemy;
  let mockSpawnManager;
  let mockEnemyRenderer;
  let mockPhysicsPort;
  let mockEnemy;

  beforeEach(() => {
    mockSpawnManager = {
      spawnEnemy: vi.fn()
    };

    mockEnemyRenderer = {
      createEnemy: vi.fn()
    };

    mockPhysicsPort = {
      enableBody: vi.fn()
    };

    spawnEnemy = new SpawnEnemy(mockSpawnManager, mockEnemyRenderer, mockPhysicsPort);

    mockEnemy = new Enemy('enemy1', { x: 100, y: 50 }, 'regular');
  });

  describe('constructor', () => {
    it('should initialize with valid ports', () => {
      expect(spawnEnemy.spawnManager).toBe(mockSpawnManager);
      expect(spawnEnemy.enemyRenderer).toBe(mockEnemyRenderer);
      expect(spawnEnemy.physicsPort).toBe(mockPhysicsPort);
    });

    it('should throw error if spawnManager is invalid', () => {
      expect(() => new SpawnEnemy(null, mockEnemyRenderer, mockPhysicsPort))
        .toThrow('SpawnEnemy: spawnManager must implement ISpawnManager interface');
    });

    it('should throw error if enemyRenderer is invalid', () => {
      expect(() => new SpawnEnemy(mockSpawnManager, null, mockPhysicsPort))
        .toThrow('SpawnEnemy: enemyRenderer must implement IEnemyRenderer interface');
    });

    it('should throw error if physicsPort is invalid', () => {
      expect(() => new SpawnEnemy(mockSpawnManager, mockEnemyRenderer, null))
        .toThrow('SpawnEnemy: physicsPort must implement IPhysics interface');
    });
  });

  describe('execute', () => {
    it('should throw error for invalid currentTime', () => {
      expect(() => spawnEnemy.execute('invalid')).toThrow('SpawnEnemy: currentTime must be a non-negative number');
      expect(() => spawnEnemy.execute(-1)).toThrow('SpawnEnemy: currentTime must be a non-negative number');
    });

    it('should return null when spawnManager.spawnEnemy returns null', () => {
      mockSpawnManager.spawnEnemy.mockReturnValue(null);

      const result = spawnEnemy.execute(1000);

      expect(mockSpawnManager.spawnEnemy).toHaveBeenCalledWith(1000);
      expect(result).toBeNull();
      expect(mockEnemyRenderer.createEnemy).not.toHaveBeenCalled();
      expect(mockPhysicsPort.enableBody).not.toHaveBeenCalled();
    });

    it('should spawn enemy and set up rendering/physics when spawn succeeds', () => {
      mockSpawnManager.spawnEnemy.mockReturnValue(mockEnemy);

      const result = spawnEnemy.execute(2000);

      expect(mockSpawnManager.spawnEnemy).toHaveBeenCalledWith(2000);
      expect(mockEnemyRenderer.createEnemy).toHaveBeenCalledWith(mockEnemy);
      expect(mockPhysicsPort.enableBody).toHaveBeenCalledWith(mockEnemy.id, mockEnemy.position);
      expect(result).toBe(mockEnemy);
    });

    it('should handle different enemy types', () => {
      const fastEnemy = new Enemy('enemy2', { x: 200, y: 100 }, 'fast');
      mockSpawnManager.spawnEnemy.mockReturnValue(fastEnemy);

      const result = spawnEnemy.execute(3000);

      expect(mockEnemyRenderer.createEnemy).toHaveBeenCalledWith(fastEnemy);
      expect(mockPhysicsPort.enableBody).toHaveBeenCalledWith(fastEnemy.id, fastEnemy.position);
      expect(result).toBe(fastEnemy);
    });

    it('should call ports with correct enemy data', () => {
      const customEnemy = new Enemy('custom', { x: 150, y: 75 }, 'regular');
      mockSpawnManager.spawnEnemy.mockReturnValue(customEnemy);

      spawnEnemy.execute(4000);

      expect(mockEnemyRenderer.createEnemy).toHaveBeenCalledWith(customEnemy);
      expect(mockPhysicsPort.enableBody).toHaveBeenCalledWith('custom', { x: 150, y: 75 });
    });
  });
});