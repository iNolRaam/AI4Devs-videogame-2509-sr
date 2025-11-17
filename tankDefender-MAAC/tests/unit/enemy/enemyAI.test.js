import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EnemyAI } from '../../../src/domain/services/EnemyAI.js';
import { TargetingService } from '../../../src/domain/services/TargetingService.js';

// Mock TargetingService for unit tests
vi.mock('../../../src/domain/services/TargetingService.js');

describe('EnemyAI', () => {
  let enemyAI;
  let mockTargetingService;
  let mockEnemy;
  let gameState;

  beforeEach(() => {
    mockTargetingService = {
      getDirectionToTarget: vi.fn(),
      isAlignedWithTarget: vi.fn(),
      getNearestPlayer: vi.fn()
    };

    TargetingService.mockImplementation(() => mockTargetingService);

    enemyAI = new EnemyAI(mockTargetingService);

    mockEnemy = {
      id: 'enemy1',
      position: { x: 100, y: 100 },
      direction: 'down',
      speed: 84,
      isAlive: true,
      type: 'regular',
      isPlayer: false,
      lastShotTime: 0,
      lastDirectionChangeTime: 0,
      directionChangeInterval: 3000
    };

    gameState = {
      base: { x: 400, y: 550 },
      players: [
        { x: 200, y: 300 },
        { x: 600, y: 200 }
      ]
    };
  });

  describe('constructor', () => {
    it('should initialize with targeting service and shooting interval', () => {
      expect(enemyAI.targetingService).toBe(mockTargetingService);
      expect(enemyAI.shootingInterval).toBe(3000);
    });
  });

  describe('update', () => {
    it('should return current direction and no shoot when no conditions met', () => {
      mockTargetingService.isAlignedWithTarget.mockReturnValue(false);
      const currentTime = 1000; // Less than directionChangeInterval

      const result = enemyAI.update(mockEnemy, currentTime, gameState);

      expect(result).toEqual({ direction: 'down', shouldShoot: false });
    });

    it('should shoot when aligned and shooting interval elapsed', () => {
      mockTargetingService.isAlignedWithTarget.mockReturnValue(true);
      mockEnemy.lastShotTime = 0;
      const currentTime = 3000; // Exactly 3 seconds

      const result = enemyAI.update(mockEnemy, currentTime, gameState);

      expect(result.shouldShoot).toBe(true);
      expect(mockEnemy.lastShotTime).toBe(3000);
    });

    it('should not shoot when aligned but shooting interval not elapsed', () => {
      mockTargetingService.isAlignedWithTarget.mockReturnValue(true);
      mockEnemy.lastShotTime = 1000;
      const currentTime = 3500; // Only 2.5 seconds elapsed

      const result = enemyAI.update(mockEnemy, currentTime, gameState);

      expect(result.shouldShoot).toBe(false);
      expect(mockEnemy.lastShotTime).toBe(1000); // Unchanged
    });

    it('should not shoot when shooting interval elapsed but not aligned', () => {
      mockTargetingService.isAlignedWithTarget.mockReturnValue(false);
      mockEnemy.lastShotTime = 0;
      const currentTime = 3000;

      const result = enemyAI.update(mockEnemy, currentTime, gameState);

      expect(result.shouldShoot).toBe(false);
      expect(mockEnemy.lastShotTime).toBe(0); // Unchanged
    });

    it('should change direction when direction change interval elapsed', () => {
      mockTargetingService.isAlignedWithTarget.mockReturnValue(false);
      mockTargetingService.getDirectionToTarget.mockReturnValue('left');
      mockEnemy.lastDirectionChangeTime = 0;
      mockEnemy.directionChangeInterval = 2000;
      const currentTime = 2000; // Exactly 2 seconds

      // Mock Math.random for 70% base targeting
      vi.spyOn(Math, 'random').mockReturnValue(0.5); // < 0.7, so target base

      const result = enemyAI.update(mockEnemy, currentTime, gameState);

      expect(result.direction).toBe('left');
      expect(mockEnemy.direction).toBe('left');
      expect(mockEnemy.lastDirectionChangeTime).toBe(2000);
      expect(mockTargetingService.getDirectionToTarget).toHaveBeenCalledWith(
        mockEnemy.position,
        gameState.base
      );

      Math.random.mockRestore();
    });

    it('should not change direction when interval not elapsed', () => {
      mockTargetingService.isAlignedWithTarget.mockReturnValue(false);
      mockEnemy.lastDirectionChangeTime = 1000;
      mockEnemy.directionChangeInterval = 3000;
      const currentTime = 3500; // Only 2.5 seconds elapsed

      const result = enemyAI.update(mockEnemy, currentTime, gameState);

      expect(result.direction).toBe('down'); // Unchanged
      expect(mockEnemy.lastDirectionChangeTime).toBe(1000); // Unchanged
    });

    it('should target nearest player when random roll >= 0.7', () => {
      mockTargetingService.isAlignedWithTarget.mockReturnValue(false);
      mockTargetingService.getDirectionToTarget.mockReturnValue('right');
      mockTargetingService.getNearestPlayer.mockReturnValue({ x: 200, y: 300 });
      mockEnemy.lastDirectionChangeTime = 0;
      mockEnemy.directionChangeInterval = 2000;
      const currentTime = 2000;

      // Mock Math.random for 30% player targeting
      vi.spyOn(Math, 'random').mockReturnValue(0.8); // >= 0.7, so target player

      const result = enemyAI.update(mockEnemy, currentTime, gameState);

      expect(mockTargetingService.getNearestPlayer).toHaveBeenCalledWith(
        mockEnemy.position,
        gameState.players
      );
      expect(mockTargetingService.getDirectionToTarget).toHaveBeenCalledWith(
        mockEnemy.position,
        { x: 200, y: 300 }
      );

      Math.random.mockRestore();
    });

    it('should fall back to base when no players available', () => {
      mockTargetingService.isAlignedWithTarget.mockReturnValue(false);
      mockTargetingService.getDirectionToTarget.mockReturnValue('up');
      mockTargetingService.getNearestPlayer.mockReturnValue(null);
      mockEnemy.lastDirectionChangeTime = 0;
      mockEnemy.directionChangeInterval = 2000;
      const currentTime = 2000;

      vi.spyOn(Math, 'random').mockReturnValue(0.8); // Target player

      const result = enemyAI.update(mockEnemy, currentTime, gameState);

      expect(mockTargetingService.getDirectionToTarget).toHaveBeenCalledWith(
        mockEnemy.position,
        gameState.base
      );

      Math.random.mockRestore();
    });
  });

  describe('_randomInterval', () => {
    it('should generate random intervals within range', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5); // Midpoint

      const result = enemyAI._randomInterval(2000, 4000);

      expect(result).toBe(3000); // (4000-2000+1)*0.5 + 2000 = 3000

      Math.random.mockRestore();
    });

    it('should include min and max values', () => {
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0) // Min
        .mockReturnValueOnce(0.999999); // Close to 1 for max

      expect(enemyAI._randomInterval(2000, 4000)).toBe(2000);
      expect(enemyAI._randomInterval(2000, 4000)).toBe(4000);

      Math.random.mockRestore();
    });
  });

  describe('integration with TargetingService', () => {
    it('should work with real TargetingService instance', async () => {
      // Temporarily unmock TargetingService for this test
      vi.doUnmock('../../../src/domain/services/TargetingService.js');
      const { TargetingService } = await import('../../../src/domain/services/TargetingService.js');

      const realEnemyAI = new EnemyAI(TargetingService);

      const enemy = {
        id: 'enemy1',
        position: { x: 100, y: 100 },
        direction: 'down',
        speed: 84,
        isAlive: true,
        type: 'regular',
        isPlayer: false,
        lastShotTime: 0,
        lastDirectionChangeTime: 0,
        directionChangeInterval: 2000
      };

      const gameState = {
        base: { x: 400, y: 550 },
        players: [{ x: 200, y: 300 }]
      };

      // Mock random for deterministic behavior
      vi.spyOn(Math, 'random').mockReturnValue(0.5); // Target base

      const result = realEnemyAI.update(enemy, 2000, gameState);

      expect(result.direction).toBe('down'); // Toward base (400,550) from (100,100) - more vertical
      expect(typeof result.shouldShoot).toBe('boolean');

      Math.random.mockRestore();
    });
  });
});