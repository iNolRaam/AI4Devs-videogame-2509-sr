/**
 * Unit Tests — Tank Entity
 * 
 * Tests for domain/entities/Tank.js
 */

import { describe, test, expect, beforeEach } from 'vitest';
import Tank from '../../../src/domain/entities/Tank.js';

describe('Tank Entity', () => {
  describe('constructor', () => {
    test('creates tank with valid parameters', () => {
      const tank = new Tank('P1', { x: 100, y: 200 }, 120);
      
      expect(tank.id).toBe('P1');
      expect(tank.position).toEqual({ x: 100, y: 200 });
      expect(tank.direction).toBe('up');
      expect(tank.speed).toBe(120);
      expect(tank.isAlive).toBe(true);
      expect(tank.rotation).toBe(0);
    });

    test('uses default speed of 120 when not provided', () => {
      const tank = new Tank('P2', { x: 50, y: 50 });
      expect(tank.speed).toBe(120);
    });

    test('throws error for invalid id', () => {
      expect(() => new Tank('P3', { x: 0, y: 0 })).toThrow('Tank: id must be "P1" or "P2"');
      expect(() => new Tank(null, { x: 0, y: 0 })).toThrow('Tank: id must be "P1" or "P2"');
    });

    test('throws error for invalid spawnPosition', () => {
      expect(() => new Tank('P1', null)).toThrow('Tank: spawnPosition must have numeric x and y properties');
      expect(() => new Tank('P1', { x: 'a', y: 0 })).toThrow('Tank: spawnPosition must have numeric x and y properties');
      expect(() => new Tank('P1', { x: 0 })).toThrow('Tank: spawnPosition must have numeric x and y properties');
    });

    test('throws error for invalid speed', () => {
      expect(() => new Tank('P1', { x: 0, y: 0 }, -10)).toThrow('Tank: speed must be a positive number');
      expect(() => new Tank('P1', { x: 0, y: 0 }, 0)).toThrow('Tank: speed must be a positive number');
      expect(() => new Tank('P1', { x: 0, y: 0 }, 'fast')).toThrow('Tank: speed must be a positive number');
    });
  });

  describe('setDirection', () => {
    let tank;

    beforeEach(() => {
      tank = new Tank('P1', { x: 100, y: 100 });
    });

    test('sets valid directions', () => {
      tank.setDirection('down');
      expect(tank.direction).toBe('down');

      tank.setDirection('left');
      expect(tank.direction).toBe('left');

      tank.setDirection('right');
      expect(tank.direction).toBe('right');

      tank.setDirection('idle');
      expect(tank.direction).toBe('idle');

      tank.setDirection('up');
      expect(tank.direction).toBe('up');
    });

    test('throws error for invalid direction', () => {
      expect(() => tank.setDirection('diagonal')).toThrow('Tank: invalid direction');
      expect(() => tank.setDirection('')).toThrow('Tank: invalid direction');
      expect(() => tank.setDirection(null)).toThrow('Tank: invalid direction');
    });
  });

  describe('getVelocity', () => {
    let tank;

    beforeEach(() => {
      tank = new Tank('P1', { x: 100, y: 100 }, 120);
    });

    test('returns correct velocity for up direction', () => {
      tank.setDirection('up');
      expect(tank.getVelocity()).toEqual({ x: 0, y: -120 });
    });

    test('returns correct velocity for down direction', () => {
      tank.setDirection('down');
      expect(tank.getVelocity()).toEqual({ x: 0, y: 120 });
    });

    test('returns correct velocity for left direction', () => {
      tank.setDirection('left');
      expect(tank.getVelocity()).toEqual({ x: -120, y: 0 });
    });

    test('returns correct velocity for right direction', () => {
      tank.setDirection('right');
      expect(tank.getVelocity()).toEqual({ x: 120, y: 0 });
    });

    test('returns zero velocity for idle direction', () => {
      tank.setDirection('idle');
      expect(tank.getVelocity()).toEqual({ x: 0, y: 0 });
    });

    test('velocity scales with different speeds', () => {
      const fastTank = new Tank('P2', { x: 0, y: 0 }, 200);
      fastTank.setDirection('right');
      expect(fastTank.getVelocity()).toEqual({ x: 200, y: 0 });
    });
  });

  describe('rotate', () => {
    let tank;

    beforeEach(() => {
      tank = new Tank('P1', { x: 100, y: 100 });
    });

    test('sets rotation angle', () => {
      tank.rotate(90);
      expect(tank.rotation).toBe(90);

      tank.rotate(180);
      expect(tank.rotation).toBe(180);

      tank.rotate(270);
      expect(tank.rotation).toBe(270);
    });

    test('normalizes angles to 0-359 range', () => {
      tank.rotate(360);
      expect(tank.rotation).toBe(0);

      tank.rotate(450);
      expect(tank.rotation).toBe(90);

      tank.rotate(-90);
      expect(tank.rotation).toBe(270);

      tank.rotate(-360);
      expect(tank.rotation).toBe(0);
    });

    test('throws error for non-numeric angle', () => {
      expect(() => tank.rotate('90')).toThrow('Tank: angle must be a number');
      expect(() => tank.rotate(null)).toThrow('Tank: angle must be a number');
    });
  });

  describe('setPosition / getPosition', () => {
    let tank;

    beforeEach(() => {
      tank = new Tank('P1', { x: 100, y: 100 });
    });

    test('updates position', () => {
      tank.setPosition({ x: 200, y: 300 });
      expect(tank.position).toEqual({ x: 200, y: 300 });
    });

    test('getPosition returns current position', () => {
      expect(tank.getPosition()).toEqual({ x: 100, y: 100 });
    });

    test('getPosition returns a copy (not reference)', () => {
      const pos = tank.getPosition();
      pos.x = 999;
      expect(tank.position.x).toBe(100); // Original unchanged
    });

    test('throws error for invalid position', () => {
      expect(() => tank.setPosition(null)).toThrow('Tank: newPosition must have numeric x and y properties');
      expect(() => tank.setPosition({ x: 'a', y: 0 })).toThrow('Tank: newPosition must have numeric x and y properties');
    });
  });

  describe('destroy / respawn', () => {
    let tank;

    beforeEach(() => {
      tank = new Tank('P1', { x: 100, y: 100 });
    });

    test('destroy marks tank as not alive', () => {
      tank.destroy();
      expect(tank.isAlive).toBe(false);
    });

    test('respawn restores tank state', () => {
      tank.setDirection('right');
      tank.rotate(90);
      tank.destroy();

      tank.respawn({ x: 50, y: 50 });

      expect(tank.isAlive).toBe(true);
      expect(tank.position).toEqual({ x: 50, y: 50 });
      expect(tank.direction).toBe('up');
      expect(tank.rotation).toBe(0);
    });
  });

  describe('toJSON', () => {
    test('returns serializable state object', () => {
      const tank = new Tank('P2', { x: 150, y: 250 }, 100);
      tank.setDirection('left');
      tank.rotate(270);

      const json = tank.toJSON();

      expect(json).toEqual({
        id: 'P2',
        position: { x: 150, y: 250 },
        direction: 'left',
        speed: 100,
        rotation: 270,
        isAlive: true
      });
    });

    test('toJSON returns a copy of position', () => {
      const tank = new Tank('P1', { x: 100, y: 100 });
      const json = tank.toJSON();
      json.position.x = 999;
      expect(tank.position.x).toBe(100); // Original unchanged
    });
  });
});
