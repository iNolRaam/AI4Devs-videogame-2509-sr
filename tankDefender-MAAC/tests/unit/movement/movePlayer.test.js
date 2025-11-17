/**
 * Unit Tests: MovePlayer Use Case
 * 
 * Tests player movement coordination through ports
 */

import MovePlayer from '../../../src/application/use-cases/MovePlayer.js';
import Tank from '../../../src/domain/entities/Tank.js';

// Mock IPhysics port
class MockPhysicsAdapter {
  constructor() {
    this.velocities = {};
  }

  setVelocity(entityId, velocity) {
    this.velocities[entityId] = velocity;
  }

  getVelocity(entityId) {
    return this.velocities[entityId] || { x: 0, y: 0 };
  }

  reset() {
    this.velocities = {};
  }
}

// Mock IRenderer port
class MockRenderAdapter {
  constructor() {
    this.rotations = {};
  }

  setRotation(entityId, angle) {
    this.rotations[entityId] = angle;
  }

  getRotation(entityId) {
    return this.rotations[entityId] || 0;
  }

  reset() {
    this.rotations = {};
  }
}

describe('MovePlayer', () => {
  let physicsAdapter;
  let renderAdapter;
  let useCase;
  let tank;

  beforeEach(() => {
    physicsAdapter = new MockPhysicsAdapter();
    renderAdapter = new MockRenderAdapter();
    useCase = new MovePlayer(physicsAdapter, renderAdapter);
    tank = new Tank('P1', { x: 100, y: 100 }, 120);
  });

  describe('Movement execution', () => {
    test('stops tank when direction is NONE', () => {
      useCase.execute(tank, 'idle');
      
      const velocity = physicsAdapter.getVelocity('P1');
      expect(velocity).toEqual({ x: 0, y: 0 });
    });

    test('moves tank UP with correct velocity', () => {
      useCase.execute(tank, 'up');
      
      const velocity = physicsAdapter.getVelocity('P1');
      expect(velocity).toEqual({ x: 0, y: -120 });
    });

    test('moves tank DOWN with correct velocity', () => {
      useCase.execute(tank, 'down');
      
      const velocity = physicsAdapter.getVelocity('P1');
      expect(velocity).toEqual({ x: 0, y: 120 });
    });

    test('moves tank LEFT with correct velocity', () => {
      useCase.execute(tank, 'left');
      
      const velocity = physicsAdapter.getVelocity('P1');
      expect(velocity).toEqual({ x: -120, y: 0 });
    });

    test('moves tank RIGHT with correct velocity', () => {
      useCase.execute(tank, 'right');
      
      const velocity = physicsAdapter.getVelocity('P1');
      expect(velocity).toEqual({ x: 120, y: 0 });
    });
  });

  describe('Rotation synchronization', () => {
    test('rotates sprite to 0 degrees for UP', () => {
      useCase.execute(tank, 'up');
      
      const rotation = renderAdapter.getRotation('P1');
      expect(rotation).toBe(0);
    });

    test('rotates sprite to 90 degrees for RIGHT', () => {
      useCase.execute(tank, 'right');
      
      const rotation = renderAdapter.getRotation('P1');
      expect(rotation).toBe(90);
    });

    test('rotates sprite to 180 degrees for DOWN', () => {
      useCase.execute(tank, 'down');
      
      const rotation = renderAdapter.getRotation('P1');
      expect(rotation).toBe(180);
    });

    test('rotates sprite to 270 degrees for LEFT', () => {
      useCase.execute(tank, 'left');
      
      const rotation = renderAdapter.getRotation('P1');
      expect(rotation).toBe(270);
    });

    test('does not rotate when direction is NONE', () => {
      renderAdapter.setRotation('P1', 45); // Previous rotation
      useCase.execute(tank, 'idle');
      
      const rotation = renderAdapter.getRotation('P1');
      expect(rotation).toBe(45); // Unchanged
    });
  });

  describe('Tank state updates', () => {
    test('updates tank direction when moving', () => {
      useCase.execute(tank, 'right');
      
      expect(tank.direction).toBe('right');
    });

    test('does not update direction when stopped', () => {
      tank.setDirection('left');
      useCase.execute(tank, 'idle');
      
      expect(tank.direction).toBe('idle'); // Updated to idle
    });

    test('updates velocity in tank entity', () => {
      useCase.execute(tank, 'down');
      
      const velocity = tank.getVelocity();
      expect(velocity).toEqual({ x: 0, y: 120 });
    });

    test('zeros velocity when stopped', () => {
      useCase.execute(tank, 'up');
      useCase.execute(tank, 'idle');
      
      const velocity = tank.getVelocity();
      expect(velocity).toEqual({ x: 0, y: 0 });
    });
  });

  describe('Multiple players', () => {
    let tank2;

    beforeEach(() => {
      tank2 = new Tank('P2', { x: 700, y: 100 }, 120);
    });

    test('handles P1 and P2 independently', () => {
      useCase.execute(tank, 'up');
      useCase.execute(tank2, 'down');
      
      const velocityP1 = physicsAdapter.getVelocity('P1');
      const velocityP2 = physicsAdapter.getVelocity('P2');
      
      expect(velocityP1).toEqual({ x: 0, y: -120 });
      expect(velocityP2).toEqual({ x: 0, y: 120 });
    });

    test('handles different speeds per tank', () => {
      tank2.speed = 80;
      
      useCase.execute(tank, 'right');
      useCase.execute(tank2, 'right');
      
      const velocityP1 = physicsAdapter.getVelocity('P1');
      const velocityP2 = physicsAdapter.getVelocity('P2');
      
      expect(velocityP1.x).toBe(120);
      expect(velocityP2.x).toBe(80);
    });

    test('rotates each tank independently', () => {
      useCase.execute(tank, 'up');
      useCase.execute(tank2, 'left');
      
      const rotationP1 = renderAdapter.getRotation('P1');
      const rotationP2 = renderAdapter.getRotation('P2');
      
      expect(rotationP1).toBe(0);
      expect(rotationP2).toBe(270);
    });
  });

  describe('Edge cases', () => {
    test('handles zero speed tank', () => {
      tank.speed = 0;
      useCase.execute(tank, 'up');
      
      const velocity = physicsAdapter.getVelocity('P1');
      expect(velocity).toEqual({ x: 0, y: 0 });
    });

    test('handles rapid direction changes', () => {
      useCase.execute(tank, 'up');
      useCase.execute(tank, 'right');
      useCase.execute(tank, 'down');
      
      const velocity = physicsAdapter.getVelocity('P1');
      expect(velocity).toEqual({ x: 0, y: 120 });
      
      const rotation = renderAdapter.getRotation('P1');
      expect(rotation).toBe(180);
    });

    test('handles tank with null direction', () => {
      tank.direction = null;
      useCase.execute(tank, 'left');
      
      expect(tank.direction).toBe('left');
    });

    test('preserves tank position (does not modify)', () => {
      const originalPos = tank.position;
      useCase.execute(tank, 'right');
      
      expect(tank.position).toBe(originalPos);
    });
  });

  describe('Performance considerations', () => {
    test('executes in single frame', () => {
      const start = performance.now();
      useCase.execute(tank, 'up');
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(1); // <1ms
    });

    test('handles multiple executions per frame', () => {
      for (let i = 0; i < 100; i++) {
        useCase.execute(tank, 'right');
      }
      
      const velocity = physicsAdapter.getVelocity('P1');
      expect(velocity).toEqual({ x: 120, y: 0 });
    });
  });
});
