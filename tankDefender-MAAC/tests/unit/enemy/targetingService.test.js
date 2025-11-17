import { describe, it, expect } from 'vitest';
import { TargetingService } from '../../../src/domain/services/TargetingService.js';

describe('TargetingService', () => {
  describe('getDirectionToTarget', () => {
    it('should return "right" when target is to the right and dx > dy', () => {
      const source = { x: 100, y: 100 };
      const target = { x: 200, y: 110 }; // dx=100, dy=10
      expect(TargetingService.getDirectionToTarget(source, target)).toBe('right');
    });

    it('should return "left" when target is to the left and dx > dy', () => {
      const source = { x: 200, y: 100 };
      const target = { x: 100, y: 110 }; // dx=-100, dy=10
      expect(TargetingService.getDirectionToTarget(source, target)).toBe('left');
    });

    it('should return "down" when target is below and dy > dx', () => {
      const source = { x: 100, y: 100 };
      const target = { x: 110, y: 200 }; // dx=10, dy=100
      expect(TargetingService.getDirectionToTarget(source, target)).toBe('down');
    });

    it('should return "up" when target is above and dy > dx', () => {
      const source = { x: 100, y: 200 };
      const target = { x: 110, y: 100 }; // dx=10, dy=-100
      expect(TargetingService.getDirectionToTarget(source, target)).toBe('up');
    });

    it('should prefer horizontal when dx equals dy (absolute)', () => {
      const source = { x: 100, y: 100 };
      const target = { x: 150, y: 50 }; // dx=50, dy=-50
      expect(TargetingService.getDirectionToTarget(source, target)).toBe('right');
    });

    it('should handle zero movement (same position)', () => {
      const source = { x: 100, y: 100 };
      const target = { x: 100, y: 100 };
      expect(TargetingService.getDirectionToTarget(source, target)).toBe('up'); // dy=0, dx=0, defaults to up
    });
  });

  describe('isAlignedWithTarget', () => {
    const basePos = { x: 400, y: 550 };
    const players = [
      { x: 200, y: 300 },
      { x: 600, y: 200 }
    ];

    it('should return true when enemy is aligned with base on x-axis within tolerance', () => {
      const enemyPos = { x: 400, y: 200 }; // Same x as base
      expect(TargetingService.isAlignedWithTarget(enemyPos, basePos, players)).toBe(true);
    });

    it('should return true when enemy is aligned with base on y-axis within tolerance', () => {
      const enemyPos = { x: 100, y: 550 }; // Same y as base
      expect(TargetingService.isAlignedWithTarget(enemyPos, basePos, players)).toBe(true);
    });

    it('should return true when enemy is aligned with player on x-axis', () => {
      const enemyPos = { x: 200, y: 400 }; // Same x as first player
      expect(TargetingService.isAlignedWithTarget(enemyPos, basePos, players)).toBe(true);
    });

    it('should return true when enemy is aligned with player on y-axis', () => {
      const enemyPos = { x: 300, y: 200 }; // Same y as second player
      expect(TargetingService.isAlignedWithTarget(enemyPos, basePos, players)).toBe(true);
    });

    it('should return false when enemy is not aligned with any target', () => {
      const enemyPos = { x: 150, y: 250 }; // Not aligned with base or players
      expect(TargetingService.isAlignedWithTarget(enemyPos, basePos, players)).toBe(false);
    });

    it('should return false when outside tolerance', () => {
      const enemyPos = { x: 450, y: 250 }; // Outside tolerance for all targets
      expect(TargetingService.isAlignedWithTarget(enemyPos, basePos, players)).toBe(false);
    });

    it('should handle empty players array', () => {
      const enemyPos = { x: 400, y: 200 };
      expect(TargetingService.isAlignedWithTarget(enemyPos, basePos, [])).toBe(true); // Still aligned with base
    });
  });

  describe('getNearestPlayer', () => {
    const players = [
      { x: 100, y: 100 },
      { x: 200, y: 200 },
      { x: 50, y: 50 }
    ];

    it('should return the nearest player', () => {
      const enemyPos = { x: 0, y: 0 };
      const nearest = TargetingService.getNearestPlayer(enemyPos, players);
      expect(nearest).toEqual({ x: 50, y: 50 }); // Closest to (0,0)
    });

    it('should return first player when equidistant', () => {
      const enemyPos = { x: 150, y: 150 };
      const equidistantPlayers = [
        { x: 100, y: 150 },
        { x: 200, y: 150 }
      ];
      const nearest = TargetingService.getNearestPlayer(enemyPos, equidistantPlayers);
      expect(nearest).toEqual({ x: 100, y: 150 }); // First in array
    });

    it('should return null when players array is empty', () => {
      const enemyPos = { x: 100, y: 100 };
      expect(TargetingService.getNearestPlayer(enemyPos, [])).toBe(null);
    });

    it('should return null when players is null', () => {
      const enemyPos = { x: 100, y: 100 };
      expect(TargetingService.getNearestPlayer(enemyPos, null)).toBe(null);
    });

    it('should handle single player', () => {
      const enemyPos = { x: 0, y: 0 };
      const singlePlayer = [{ x: 10, y: 10 }];
      const nearest = TargetingService.getNearestPlayer(enemyPos, singlePlayer);
      expect(nearest).toEqual({ x: 10, y: 10 });
    });
  });

  describe('_distance (private method)', () => {
    it('should calculate correct Euclidean distance', () => {
      const pos1 = { x: 0, y: 0 };
      const pos2 = { x: 3, y: 4 };
      expect(TargetingService._distance(pos1, pos2)).toBe(5); // 3-4-5 triangle
    });

    it('should handle negative coordinates', () => {
      const pos1 = { x: -1, y: -1 };
      const pos2 = { x: 2, y: 3 };
      expect(TargetingService._distance(pos1, pos2)).toBeCloseTo(5); // sqrt((3)^2 + (4)^2) = 5
    });

    it('should return zero for same position', () => {
      const pos = { x: 5, y: 7 };
      expect(TargetingService._distance(pos, pos)).toBe(0);
    });
  });
});