import { describe, it, expect, beforeEach } from 'vitest';
import SpawnManager from '../../../src/domain/services/SpawnManager.js';

describe('SpawnManager', () => {
  let spawnManager;
  let mockSpawnPoints;

  beforeEach(() => {
    mockSpawnPoints = [
      { x: 0, y: 0 },
      { x: 800, y: 0 },
      { x: 0, y: 600 },
      { x: 800, y: 600 }
    ];
    spawnManager = new SpawnManager({
      totalReserve: 10,
      maxSimultaneous: 4,
      spawnDelay: 2000,
      spawnPoints: mockSpawnPoints
    });
  });

  describe('constructor', () => {
    it('creates spawn manager with correct initial state', () => {
      expect(spawnManager.totalReserve).toBe(10);
      expect(spawnManager.remainingReserve).toBe(10);
      expect(spawnManager.activeEnemies).toEqual([]);
      expect(spawnManager.maxSimultaneous).toBe(4);
      expect(spawnManager.spawnPoints).toEqual(mockSpawnPoints);
      expect(spawnManager.lastSpawnTime).toBe(-2000);
      expect(spawnManager.spawnDelay).toBe(2000);
    });

    it('throws error for invalid totalReserve', () => {
      expect(() => new SpawnManager({ totalReserve: -1, spawnPoints: mockSpawnPoints })).toThrow('totalReserve must be a positive number');
      expect(() => new SpawnManager({ spawnPoints: mockSpawnPoints })).toThrow('totalReserve must be a positive number');
    });

    it('throws error for invalid spawnPoints', () => {
      expect(() => new SpawnManager({ totalReserve: 10, spawnPoints: [] })).toThrow('spawnPoints must be a non-empty array');
      expect(() => new SpawnManager({ totalReserve: 10 })).toThrow('spawnPoints must be a non-empty array');
      expect(() => new SpawnManager({ totalReserve: 10, spawnPoints: 'invalid' })).toThrow('spawnPoints must be a non-empty array');
    });

    it('uses default values when not provided', () => {
      const minimalManager = new SpawnManager({
        totalReserve: 5,
        spawnPoints: [{ x: 100, y: 100 }]
      });
      expect(minimalManager.maxSimultaneous).toBe(4);
      expect(minimalManager.spawnDelay).toBe(2000);
    });
  });

  describe('canSpawn', () => {
    it('returns true when all conditions are met', () => {
      const currentTime = 3000;
      expect(spawnManager.canSpawn(currentTime)).toBe(true);
    });

    it('returns false when no reserve left', () => {
      spawnManager.remainingReserve = 0;
      expect(spawnManager.canSpawn(3000)).toBe(false);
    });

    it('returns false when max simultaneous reached', () => {
      spawnManager.activeEnemies = [{ id: 'e1' }, { id: 'e2' }, { id: 'e3' }, { id: 'e4' }];
      expect(spawnManager.canSpawn(3000)).toBe(false);
    });

    it('returns false when spawn delay not elapsed', () => {
      spawnManager.lastSpawnTime = 2000;
      expect(spawnManager.canSpawn(3999)).toBe(false); // Only 1999ms elapsed
      expect(spawnManager.canSpawn(4000)).toBe(true); // 2000ms elapsed
    });
  });

  describe('getRandomSpawnPoint', () => {
    it('returns a spawn point from the configured array', () => {
      const point = spawnManager.getRandomSpawnPoint();
      expect(mockSpawnPoints).toContainEqual(point);
    });

    it('returns a copy, not the original object', () => {
      const point = spawnManager.getRandomSpawnPoint();
      point.x = 999;
      expect(point.x).toBe(999);
      // Original should be unchanged
      expect(mockSpawnPoints.some(p => p.x === 999)).toBe(false);
    });
  });

  describe('spawnEnemy', () => {
    it('spawns enemy when conditions are met', () => {
      const currentTime = 3000;
      const enemy = spawnManager.spawnEnemy(currentTime);

      expect(enemy).not.toBeNull();
      expect(enemy.id).toMatch(/^enemy_\d+_[a-z0-9]+$/);
      expect(mockSpawnPoints).toContainEqual(enemy.spawnPosition);
      expect(['regular', 'fast']).toContain(enemy.type);
      expect(enemy.spawnedAt).toBe(currentTime);
    });

    it('updates state correctly after spawning', () => {
      const initialReserve = spawnManager.remainingReserve;
      const initialActiveCount = spawnManager.activeEnemies.length;

      spawnManager.spawnEnemy(3000);

      expect(spawnManager.remainingReserve).toBe(initialReserve - 1);
      expect(spawnManager.activeEnemies.length).toBe(initialActiveCount + 1);
      expect(spawnManager.lastSpawnTime).toBe(3000);
    });

    it('returns null when cannot spawn', () => {
      spawnManager.remainingReserve = 0;
      expect(spawnManager.spawnEnemy(3000)).toBeNull();
    });

    it('adds spawned enemy to active list', () => {
      const enemy = spawnManager.spawnEnemy(3000);
      expect(spawnManager.activeEnemies).toContain(enemy);
    });
  });

  describe('removeEnemy', () => {
    it('removes enemy from active list', () => {
      const enemy = spawnManager.spawnEnemy(3000);
      const initialCount = spawnManager.activeEnemies.length;

      const removed = spawnManager.removeEnemy(enemy.id);

      expect(removed).toBe(true);
      expect(spawnManager.activeEnemies.length).toBe(initialCount - 1);
      expect(spawnManager.activeEnemies).not.toContain(enemy);
    });

    it('returns false when enemy not found', () => {
      expect(spawnManager.removeEnemy('nonexistent')).toBe(false);
    });

    it('throws error for invalid enemyId', () => {
      expect(() => spawnManager.removeEnemy(123)).toThrow('enemyId must be a string');
      expect(() => spawnManager.removeEnemy(null)).toThrow('enemyId must be a string');
    });
  });

  describe('getRemainingCount', () => {
    it('returns total of reserve plus active enemies', () => {
      expect(spawnManager.getRemainingCount()).toBe(10); // 10 reserve + 0 active

      spawnManager.spawnEnemy(3000);
      expect(spawnManager.getRemainingCount()).toBe(10); // 9 reserve + 1 active

      spawnManager.spawnEnemy(5000);
      expect(spawnManager.getRemainingCount()).toBe(10); // 8 reserve + 2 active
    });
  });

  describe('_determineEnemyType', () => {
    it('returns regular or fast type', () => {
      // Test multiple calls to ensure both types are possible
      const results = new Set();
      for (let i = 0; i < 100; i++) {
        results.add(spawnManager._determineEnemyType());
      }
      expect(results.has('regular')).toBe(true);
      expect(results.has('fast')).toBe(true);
    });

    // Note: Statistical distribution testing would require mocking Math.random
    // For now, we verify the method exists and returns valid types
  });

  describe('spawn delay enforcement', () => {
    it('enforces 2-second delay between spawns', () => {
      // First spawn at t=0
      spawnManager.spawnEnemy(0);
      expect(spawnManager.lastSpawnTime).toBe(0);

      // Cannot spawn at t=1999 (1999ms elapsed)
      expect(spawnManager.canSpawn(1999)).toBe(false);
      expect(spawnManager.spawnEnemy(1999)).toBeNull();

      // Can spawn at t=2000 (2000ms elapsed)
      expect(spawnManager.canSpawn(2000)).toBe(true);
      spawnManager.spawnEnemy(2000);
      expect(spawnManager.lastSpawnTime).toBe(2000);
    });
  });

  describe('reserve tracking', () => {
    it('tracks remaining reserve correctly', () => {
      expect(spawnManager.remainingReserve).toBe(10);

      spawnManager.spawnEnemy(0);
      expect(spawnManager.remainingReserve).toBe(9);

      spawnManager.spawnEnemy(2000);
      expect(spawnManager.remainingReserve).toBe(8);
    });

    it('prevents spawning when reserve exhausted', () => {
      // Spawn all enemies, removing when reaching simultaneous limit
      for (let i = 0; i < 10; i++) {
        spawnManager.spawnEnemy(i * 2000);
        if (spawnManager.activeEnemies.length >= 4) {
          spawnManager.removeEnemy(spawnManager.activeEnemies[0].id);
        }
      }

      expect(spawnManager.remainingReserve).toBe(0);
      expect(spawnManager.canSpawn(20000)).toBe(false);
      expect(spawnManager.spawnEnemy(20000)).toBeNull();
    });
  });

  describe('simultaneous limit enforcement', () => {
    it('limits active enemies to maxSimultaneous', () => {
      // Spawn up to limit
      for (let i = 0; i < 4; i++) {
        spawnManager.spawnEnemy(i * 2000);
      }

      expect(spawnManager.activeEnemies.length).toBe(4);
      expect(spawnManager.canSpawn(8000)).toBe(false);

      // Remove one enemy
      const enemyToRemove = spawnManager.activeEnemies[0];
      spawnManager.removeEnemy(enemyToRemove.id);

      expect(spawnManager.activeEnemies.length).toBe(3);
      expect(spawnManager.canSpawn(10000)).toBe(true);
    });
  });

  describe('getState', () => {
    it('returns current state snapshot', () => {
      const state = spawnManager.getState();

      expect(state).toEqual({
        totalReserve: 10,
        remainingReserve: 10,
        activeCount: 0,
        maxSimultaneous: 4,
        lastSpawnTime: -2000,
        spawnDelay: 2000,
        canSpawn: true // Assuming current time allows spawning
      });
    });
  });
});