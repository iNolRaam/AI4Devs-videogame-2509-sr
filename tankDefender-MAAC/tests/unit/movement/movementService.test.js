/**
 * Unit Tests: MovementService
 * 
 * Tests pure domain logic for velocity calculation and direction mapping
 */

import MovementService from '../../../src/domain/services/MovementService.js';

describe('MovementService', () => {
  describe('calculateVelocity', () => {
    const speed = 100;

    test('returns zero velocity for idle direction', () => {
      const velocity = MovementService.calculateVelocity('idle', speed);
      expect(velocity).toEqual({ x: 0, y: 0 });
    });

    test('calculates up velocity correctly', () => {
      const velocity = MovementService.calculateVelocity('up', speed);
      expect(velocity).toEqual({ x: 0, y: -speed });
    });

    test('calculates down velocity correctly', () => {
      const velocity = MovementService.calculateVelocity('down', speed);
      expect(velocity).toEqual({ x: 0, y: speed });
    });

    test('calculates left velocity correctly', () => {
      const velocity = MovementService.calculateVelocity('left', speed);
      expect(velocity).toEqual({ x: -speed, y: 0 });
    });

    test('calculates right velocity correctly', () => {
      const velocity = MovementService.calculateVelocity('right', speed);
      expect(velocity).toEqual({ x: speed, y: 0 });
    });

    test('throws error for invalid direction', () => {
      expect(() => {
        MovementService.calculateVelocity('INVALID', speed);
      }).toThrow('MovementService: invalid direction "INVALID". Must be one of: up, down, left, right, idle');
    });

    test('works with different speed values', () => {
      const velocity = MovementService.calculateVelocity('right', 200);
      expect(velocity).toEqual({ x: 200, y: 0 });
    });

    test('works with zero speed', () => {
      const velocity = MovementService.calculateVelocity('up', 0);
      expect(velocity).toEqual({ x: 0, y: 0 });
    });
  });

  describe('directionToAngle', () => {
    test('converts up to 0 degrees', () => {
      expect(MovementService.directionToAngle('up')).toBe(0);
    });

    test('converts right to 90 degrees', () => {
      expect(MovementService.directionToAngle('right')).toBe(90);
    });

    test('converts down to 180 degrees', () => {
      expect(MovementService.directionToAngle('down')).toBe(180);
    });

    test('converts left to 270 degrees', () => {
      expect(MovementService.directionToAngle('left')).toBe(270);
    });

    test('throws error for invalid direction', () => {
      expect(() => {
        MovementService.directionToAngle('INVALID');
      }).toThrow('MovementService: invalid direction "INVALID". Must be one of: up, down, left, right');
    });
  });

  describe('angleToDirection', () => {
    test('converts 0 degrees to up', () => {
      expect(MovementService.angleToDirection(0)).toBe('up');
    });

    test('converts 90 degrees to right', () => {
      expect(MovementService.angleToDirection(90)).toBe('right');
    });

    test('converts 180 degrees to down', () => {
      expect(MovementService.angleToDirection(180)).toBe('down');
    });

    test('converts 270 degrees to left', () => {
      expect(MovementService.angleToDirection(270)).toBe('left');
    });

    test('normalizes 360 to up', () => {
      expect(MovementService.angleToDirection(360)).toBe('up');
    });

    test('normalizes negative angles', () => {
      expect(MovementService.angleToDirection(-90)).toBe('left');
    });

    test('rounds to nearest direction (45 -> right)', () => {
      expect(MovementService.angleToDirection(45)).toBe('right');
    });

    test('rounds to nearest direction (135 -> down)', () => {
      expect(MovementService.angleToDirection(135)).toBe('down');
    });

    test('rounds to nearest direction (225 -> left)', () => {
      expect(MovementService.angleToDirection(225)).toBe('left');
    });

    test('rounds to nearest direction (315 -> up)', () => {
      expect(MovementService.angleToDirection(315)).toBe('up');
    });
  });

  describe('areOppositeDirections', () => {
    test('up and down are opposite', () => {
      expect(MovementService.areOppositeDirections('up', 'down')).toBe(true);
    });

    test('down and up are opposite', () => {
      expect(MovementService.areOppositeDirections('down', 'up')).toBe(true);
    });

    test('left and right are opposite', () => {
      expect(MovementService.areOppositeDirections('left', 'right')).toBe(true);
    });

    test('right and left are opposite', () => {
      expect(MovementService.areOppositeDirections('right', 'left')).toBe(true);
    });

    test('up and left are not opposite', () => {
      expect(MovementService.areOppositeDirections('up', 'left')).toBe(false);
    });

    test('up and right are not opposite', () => {
      expect(MovementService.areOppositeDirections('up', 'right')).toBe(false);
    });

    test('idle is not opposite to any direction', () => {
      expect(MovementService.areOppositeDirections('idle', 'up')).toBe(false);
      expect(MovementService.areOppositeDirections('up', 'idle')).toBe(false);
    });

    test('same direction is not opposite', () => {
      expect(MovementService.areOppositeDirections('up', 'up')).toBe(false);
    });

    test('throws error for invalid direction1', () => {
      expect(() => {
        MovementService.areOppositeDirections('INVALID', 'up');
      }).toThrow('MovementService: invalid direction "INVALID". Must be one of: up, down, left, right, idle');
    });

    test('throws error for invalid direction2', () => {
      expect(() => {
        MovementService.areOppositeDirections('up', 'INVALID');
      }).toThrow('MovementService: invalid direction "INVALID". Must be one of: up, down, left, right, idle');
    });
  });
});
