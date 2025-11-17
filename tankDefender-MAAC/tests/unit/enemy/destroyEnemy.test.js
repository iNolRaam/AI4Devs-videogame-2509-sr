import { describe, it, expect, vi, beforeEach } from 'vitest';
import DestroyEnemy from '../../../src/application/use-cases/DestroyEnemy.js';

describe('DestroyEnemy Use Case', () => {
  let destroyEnemy;
  let mockSpawnManager;
  let mockEnemyRenderer;
  let mockPhysicsPort;
  let mockHudPort;

  beforeEach(() => {
    mockSpawnManager = {
      removeEnemy: vi.fn(),
      getRemainingCount: vi.fn()
    };

    mockEnemyRenderer = {
      removeEnemy: vi.fn()
    };

    mockPhysicsPort = {
      disableBody: vi.fn()
    };

    mockHudPort = {
      updateEnemiesRemaining: vi.fn()
    };

    destroyEnemy = new DestroyEnemy(
      mockSpawnManager,
      mockEnemyRenderer,
      mockPhysicsPort,
      mockHudPort
    );
  });

  describe('constructor', () => {
    it('should initialize with valid ports', () => {
      expect(destroyEnemy.spawnManager).toBe(mockSpawnManager);
      expect(destroyEnemy.enemyRenderer).toBe(mockEnemyRenderer);
      expect(destroyEnemy.physicsPort).toBe(mockPhysicsPort);
      expect(destroyEnemy.hudPort).toBe(mockHudPort);
    });

    it('should throw error if spawnManager is invalid', () => {
      expect(() => new DestroyEnemy(null, mockEnemyRenderer, mockPhysicsPort, mockHudPort))
        .toThrow('DestroyEnemy: spawnManager must implement ISpawnManager interface');
    });

    it('should throw error if enemyRenderer is invalid', () => {
      expect(() => new DestroyEnemy(mockSpawnManager, null, mockPhysicsPort, mockHudPort))
        .toThrow('DestroyEnemy: enemyRenderer must implement IEnemyRenderer interface');
    });

    it('should throw error if physicsPort is invalid', () => {
      expect(() => new DestroyEnemy(mockSpawnManager, mockEnemyRenderer, null, mockHudPort))
        .toThrow('DestroyEnemy: physicsPort must implement IPhysics interface');
    });

    it('should throw error if hudPort is invalid', () => {
      expect(() => new DestroyEnemy(mockSpawnManager, mockEnemyRenderer, mockPhysicsPort, null))
        .toThrow('DestroyEnemy: hudPort must implement IHUD interface');
    });
  });

  describe('execute', () => {
    it('should throw error for invalid enemyId', () => {
      expect(() => destroyEnemy.execute(null)).toThrow('DestroyEnemy: enemyId must be a non-empty string');
      expect(() => destroyEnemy.execute('')).toThrow('DestroyEnemy: enemyId must be a non-empty string');
      expect(() => destroyEnemy.execute(123)).toThrow('DestroyEnemy: enemyId must be a non-empty string');
    });

    it('should execute complete cleanup flow', () => {
      mockSpawnManager.getRemainingCount.mockReturnValue(5);

      destroyEnemy.execute('enemy1');

      expect(mockSpawnManager.removeEnemy).toHaveBeenCalledWith('enemy1');
      expect(mockEnemyRenderer.removeEnemy).toHaveBeenCalledWith('enemy1');
      expect(mockPhysicsPort.disableBody).toHaveBeenCalledWith('enemy1');
      expect(mockSpawnManager.getRemainingCount).toHaveBeenCalled();
      expect(mockHudPort.updateEnemiesRemaining).toHaveBeenCalledWith(5);
    });

    it('should handle different enemy IDs', () => {
      mockSpawnManager.getRemainingCount.mockReturnValue(3);

      destroyEnemy.execute('E001');

      expect(mockSpawnManager.removeEnemy).toHaveBeenCalledWith('E001');
      expect(mockEnemyRenderer.removeEnemy).toHaveBeenCalledWith('E001');
      expect(mockPhysicsPort.disableBody).toHaveBeenCalledWith('E001');
      expect(mockHudPort.updateEnemiesRemaining).toHaveBeenCalledWith(3);
    });

    it('should update HUD with correct remaining count', () => {
      mockSpawnManager.getRemainingCount.mockReturnValue(0); // Last enemy

      destroyEnemy.execute('enemy1');

      expect(mockHudPort.updateEnemiesRemaining).toHaveBeenCalledWith(0);
    });

    it('should call ports in correct order', () => {
      const callOrder = [];

      mockSpawnManager.removeEnemy.mockImplementation(() => callOrder.push('spawnManager'));
      mockEnemyRenderer.removeEnemy.mockImplementation(() => callOrder.push('renderer'));
      mockPhysicsPort.disableBody.mockImplementation(() => callOrder.push('physics'));
      mockSpawnManager.getRemainingCount.mockImplementation(() => {
        callOrder.push('getCount');
        return 2;
      });
      mockHudPort.updateEnemiesRemaining.mockImplementation(() => callOrder.push('hud'));

      destroyEnemy.execute('enemy1');

      expect(callOrder).toEqual(['spawnManager', 'renderer', 'physics', 'getCount', 'hud']);
    });
  });
});