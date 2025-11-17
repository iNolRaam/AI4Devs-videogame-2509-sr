/**
 * Unit Tests for Enemy Entity
 *
 * @module tests/unit/enemy/enemy.test
 */

import { describe, test, expect, beforeEach } from 'vitest';
import Enemy from '../../../src/domain/entities/Enemy.js';

describe('Enemy Entity', () => {
  describe('constructor', () => {
    test('creates regular enemy with correct properties', () => {
      const spawnPosition = { x: 100, y: 200 };
      const enemy = new Enemy('E001', spawnPosition, 'regular');

      expect(enemy.id).toBe('E001');
      expect(enemy.position).toEqual({ x: 100, y: 200 });
      expect(enemy.direction).toBe('up');
      expect(enemy.speed).toBe(84); // 120 * 0.7
      expect(enemy.isAlive).toBe(true);
      expect(enemy.rotation).toBe(0);
      expect(enemy.type).toBe('regular');
      expect(enemy.isPlayer).toBe(false);
      expect(enemy.targetPriority).toBe('base');
      expect(enemy.lastShotTime).toBe(0);
      expect(enemy.lastDirectionChangeTime).toBe(0);
      expect(typeof enemy.directionChangeInterval).toBe('number');
      expect(enemy.directionChangeInterval).toBeGreaterThanOrEqual(2000);
      expect(enemy.directionChangeInterval).toBeLessThanOrEqual(4000);
    });

    test('creates fast enemy with correct speed', () => {
      const spawnPosition = { x: 50, y: 75 };
      const enemy = new Enemy('E002', spawnPosition, 'fast');

      expect(enemy.id).toBe('E002');
      expect(enemy.speed).toBe(120); // full speed
      expect(enemy.type).toBe('fast');
    });

    test('defaults to regular type when not specified', () => {
      const enemy = new Enemy('E003', { x: 0, y: 0 });

      expect(enemy.type).toBe('regular');
      expect(enemy.speed).toBe(84);
    });

    test('throws error for invalid id', () => {
      expect(() => new Enemy('', { x: 0, y: 0 })).toThrow('Enemy: id must be a non-empty string');
      expect(() => new Enemy(null, { x: 0, y: 0 })).toThrow('Enemy: id must be a non-empty string');
    });

    test('throws error for invalid spawnPosition', () => {
      expect(() => new Enemy('E001', null)).toThrow('Enemy: spawnPosition must have numeric x and y properties');
      expect(() => new Enemy('E001', { x: 'invalid', y: 0 })).toThrow('Enemy: spawnPosition must have numeric x and y properties');
    });

    test('throws error for invalid type', () => {
      expect(() => new Enemy('E001', { x: 0, y: 0 }, 'invalid')).toThrow('Enemy: type must be "regular" or "fast"');
    });
  });

  describe('speed calculation', () => {
    test('regular enemy has 70% of base speed', () => {
      const enemy = new Enemy('E001', { x: 0, y: 0 }, 'regular');
      expect(enemy.speed).toBe(84); // 120 * 0.7
    });

    test('fast enemy has 100% of base speed', () => {
      const enemy = new Enemy('E001', { x: 0, y: 0 }, 'fast');
      expect(enemy.speed).toBe(120); // 120 * 1.0
    });
  });

  describe('methods', () => {
    let enemy;

    beforeEach(() => {
      enemy = new Enemy('E001', { x: 100, y: 200 }, 'regular');
    });

    test('setDirection updates direction', () => {
      enemy.setDirection('right');
      expect(enemy.direction).toBe('right');
    });

    test('setDirection throws for invalid direction', () => {
      expect(() => enemy.setDirection('invalid')).toThrow('Enemy: invalid direction "invalid"');
    });

    test('getVelocity returns correct vectors', () => {
      enemy.setDirection('up');
      expect(enemy.getVelocity()).toEqual({ x: 0, y: -84 });

      enemy.setDirection('right');
      expect(enemy.getVelocity()).toEqual({ x: 84, y: 0 });

      enemy.setDirection('idle');
      expect(enemy.getVelocity()).toEqual({ x: 0, y: 0 });
    });

    test('rotate updates rotation', () => {
      enemy.rotate(90);
      expect(enemy.rotation).toBe(90);

      enemy.rotate(450); // 450 % 360 = 90
      expect(enemy.rotation).toBe(90);

      enemy.rotate(-90); // -90 + 360 = 270
      expect(enemy.rotation).toBe(270);
    });

    test('setPosition updates position', () => {
      enemy.setPosition({ x: 300, y: 400 });
      expect(enemy.position).toEqual({ x: 300, y: 400 });
    });

    test('getPosition returns current position', () => {
      expect(enemy.getPosition()).toEqual({ x: 100, y: 200 });
    });

    test('destroy marks as not alive', () => {
      enemy.destroy();
      expect(enemy.isAlive).toBe(false);
    });

    test('respawn resets state', () => {
      enemy.setDirection('down');
      enemy.rotate(180);
      enemy.lastShotTime = 1000;
      enemy.lastDirectionChangeTime = 2000;

      enemy.respawn({ x: 500, y: 600 });

      expect(enemy.position).toEqual({ x: 500, y: 600 });
      expect(enemy.direction).toBe('up');
      expect(enemy.rotation).toBe(0);
      expect(enemy.isAlive).toBe(true);
      expect(enemy.lastShotTime).toBe(0);
      expect(enemy.lastDirectionChangeTime).toBe(0);
      expect(typeof enemy.directionChangeInterval).toBe('number');
    });

    test('toJSON returns complete state', () => {
      const json = enemy.toJSON();
      expect(json.id).toBe('E001');
      expect(json.position).toEqual({ x: 100, y: 200 });
      expect(json.direction).toBe('up');
      expect(json.speed).toBe(84);
      expect(json.isAlive).toBe(true);
      expect(json.type).toBe('regular');
      expect(json.isPlayer).toBe(false);
      expect(json.targetPriority).toBe('base');
      expect(json.lastShotTime).toBe(0);
      expect(json.lastDirectionChangeTime).toBe(0);
      expect(typeof json.directionChangeInterval).toBe('number');
    });
  });

  describe('_randomInterval', () => {
    test('returns number between min and max', () => {
      const enemy = new Enemy('E001', { x: 0, y: 0 });
      const result = enemy._randomInterval(1000, 2000);
      expect(result).toBeGreaterThanOrEqual(1000);
      expect(result).toBeLessThanOrEqual(2000);
      expect(Number.isInteger(result)).toBe(true);
    });
  });
});