import { describe, it, expect, vi, beforeEach } from 'vitest';
import UpdateEnemyAI from '../../../src/application/use-cases/UpdateEnemyAI.js';
import Enemy from '../../../src/domain/entities/Enemy.js';

describe('UpdateEnemyAI Use Case', () => {
  let updateEnemyAI;
  let mockEnemyAI;
  let mockMovementService;
  let mockEnemyRenderer;
  let mockProjectileSystem;
  let mockEnemy;
  let gameState;

  beforeEach(() => {
    mockEnemyAI = {
      update: vi.fn()
    };

    mockMovementService = {
      calculateVelocity: vi.fn()
    };

    mockEnemyRenderer = {
      updateEnemy: vi.fn()
    };

    mockProjectileSystem = {
      fireProjectile: vi.fn()
    };

    updateEnemyAI = new UpdateEnemyAI(
      mockEnemyAI,
      mockMovementService,
      mockEnemyRenderer,
      mockProjectileSystem
    );

    mockEnemy = new Enemy('enemy1', { x: 100, y: 100 }, 'regular');
    mockEnemy.speed = 84;

    gameState = {
      base: { x: 400, y: 550 },
      players: [{ x: 200, y: 300 }]
    };
  });

  describe('constructor', () => {
    it('should initialize with valid ports', () => {
      expect(updateEnemyAI.enemyAI).toBe(mockEnemyAI);
      expect(updateEnemyAI.movementService).toBe(mockMovementService);
      expect(updateEnemyAI.enemyRenderer).toBe(mockEnemyRenderer);
      expect(updateEnemyAI.projectileSystem).toBe(mockProjectileSystem);
    });

    it('should throw error if enemyAI is invalid', () => {
      expect(() => new UpdateEnemyAI(null, mockMovementService, mockEnemyRenderer, mockProjectileSystem))
        .toThrow('UpdateEnemyAI: enemyAI must implement IAI interface');
    });

    it('should throw error if movementService is invalid', () => {
      expect(() => new UpdateEnemyAI(mockEnemyAI, null, mockEnemyRenderer, mockProjectileSystem))
        .toThrow('UpdateEnemyAI: movementService must have calculateVelocity method');
    });

    it('should throw error if enemyRenderer is invalid', () => {
      expect(() => new UpdateEnemyAI(mockEnemyAI, mockMovementService, null, mockProjectileSystem))
        .toThrow('UpdateEnemyAI: enemyRenderer must implement IEnemyRenderer interface');
    });

    it('should throw error if projectileSystem is invalid', () => {
      expect(() => new UpdateEnemyAI(mockEnemyAI, mockMovementService, mockEnemyRenderer, null))
        .toThrow('UpdateEnemyAI: projectileSystem must implement IProjectileSystem interface');
    });
  });

  describe('execute', () => {
    it('should throw error for invalid enemy', () => {
      expect(() => updateEnemyAI.execute(null, 1000, gameState))
        .toThrow('UpdateEnemyAI: enemy must be a valid Enemy entity');
    });

    it('should throw error for invalid currentTime', () => {
      expect(() => updateEnemyAI.execute(mockEnemy, 'invalid', gameState))
        .toThrow('UpdateEnemyAI: currentTime must be a non-negative number');
    });

    it('should throw error for missing gameState', () => {
      expect(() => updateEnemyAI.execute(mockEnemy, 1000, null))
        .toThrow('UpdateEnemyAI: gameState is required');
    });

    it('should update enemy behavior without shooting', () => {
      const aiResult = { direction: 'right', shouldShoot: false };
      const velocity = { x: 84, y: 0 };

      mockEnemyAI.update.mockReturnValue(aiResult);
      mockMovementService.calculateVelocity.mockReturnValue(velocity);

      updateEnemyAI.execute(mockEnemy, 1000, gameState);

      expect(mockEnemyAI.update).toHaveBeenCalledWith(mockEnemy, 1000, gameState);
      expect(mockMovementService.calculateVelocity).toHaveBeenCalledWith('right', 84);
      expect(mockEnemyRenderer.updateEnemy).toHaveBeenCalledWith(mockEnemy, 'right', velocity);
      expect(mockProjectileSystem.fireProjectile).not.toHaveBeenCalled();

      // Check position update
      expect(mockEnemy.position.x).toBe(100 + 84);
      expect(mockEnemy.position.y).toBe(100);
      expect(mockEnemy.direction).toBe('right');
    });

    it('should update enemy behavior with shooting', () => {
      const aiResult = { direction: 'up', shouldShoot: true };
      const velocity = { x: 0, y: -84 };

      mockEnemyAI.update.mockReturnValue(aiResult);
      mockMovementService.calculateVelocity.mockReturnValue(velocity);

      updateEnemyAI.execute(mockEnemy, 2000, gameState);

      expect(mockEnemyAI.update).toHaveBeenCalledWith(mockEnemy, 2000, gameState);
      expect(mockMovementService.calculateVelocity).toHaveBeenCalledWith('up', 84);
      expect(mockEnemyRenderer.updateEnemy).toHaveBeenCalledWith(mockEnemy, 'up', velocity);
      expect(mockProjectileSystem.fireProjectile).toHaveBeenCalledWith(
        'enemy1',
        { x: 100, y: 100 },
        'up',
        'enemy'
      );

      // Check position update
      expect(mockEnemy.position.x).toBe(100);
      expect(mockEnemy.position.y).toBe(100 - 84);
      expect(mockEnemy.direction).toBe('up');
    });

    it('should handle different directions and speeds', () => {
      const fastEnemy = new Enemy('fast', { x: 50, y: 50 }, 'fast');
      fastEnemy.speed = 120;

      const aiResult = { direction: 'down', shouldShoot: true };
      const velocity = { x: 0, y: 120 };

      mockEnemyAI.update.mockReturnValue(aiResult);
      mockMovementService.calculateVelocity.mockReturnValue(velocity);

      updateEnemyAI.execute(fastEnemy, 3000, gameState);

      expect(mockMovementService.calculateVelocity).toHaveBeenCalledWith('down', 120);
      expect(mockEnemyRenderer.updateEnemy).toHaveBeenCalledWith(fastEnemy, 'down', velocity);
      expect(mockProjectileSystem.fireProjectile).toHaveBeenCalledWith(
        'fast',
        { x: 50, y: 50 },
        'down',
        'enemy'
      );

      expect(fastEnemy.position.x).toBe(50);
      expect(fastEnemy.position.y).toBe(50 + 120);
      expect(fastEnemy.direction).toBe('down');
    });
  });
});