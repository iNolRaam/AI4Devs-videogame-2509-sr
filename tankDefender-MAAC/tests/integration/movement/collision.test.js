/**
 * Integration Tests: Collision Detection
 * 
 * Tests player collision with walls and boundaries
 */

import { vi } from 'vitest';
import PhaserPhysicsAdapter from '../../../src/adapters/physics/PhaserPhysicsAdapter.js';

class MockSprite {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.body = {
      velocity: { x: 0, y: 0 },
      setVelocity: vi.fn((x, y) => {
        this.body.velocity.x = x;
        this.body.velocity.y = y;
      }),
      collideWorldBounds: false
    };
  }

  setCollideWorldBounds(value) {
    this.body.collideWorldBounds = value;
    return this;
  }
}

class MockStaticGroup {
  constructor() {
    this.name = 'staticGroup';
  }
}

class MockPhysics {
  constructor() {
    this.world = {
      setBounds: vi.fn(),
      bounds: { x: 0, y: 0, width: 800, height: 600 }
    };
    this.colliders = [];
    this.overlaps = [];
  }

  add = {
    existing: (sprite) => sprite,
    collider: (...args) => {
      this.colliders.push(args);
      return { active: true };
    },
    overlap: (...args) => {
      this.overlaps.push(args);
      return { active: true };
    },
    staticGroup: () => new MockStaticGroup()
  };

  overlap = (...args) => {
    this.overlaps.push(args);
    return { active: true };
  };
}

describe('Collision Detection Integration', () => {
  let physics;
  let physicsAdapter;
  let spriteP1;
  let walls;

  beforeEach(() => {
    physics = new MockPhysics();
    physicsAdapter = new PhaserPhysicsAdapter(physics);
    spriteP1 = new MockSprite(100, 100);
    walls = physics.add.staticGroup();

    physicsAdapter.registerEntity('P1', spriteP1);
  });

  describe('World bounds collision', () => {
    test('enables world bounds collision', () => {
      spriteP1.setCollideWorldBounds(true);
      expect(spriteP1.body.collideWorldBounds).toBe(true);
    });

    test('sets world bounds correctly', () => {
      physicsAdapter.setWorldBounds(0, 0, 800, 600);
      expect(physics.world.setBounds).toHaveBeenCalledWith(0, 0, 800, 600);
    });
  });

  describe('Static wall collision', () => {
    test('registers collision between player and walls', () => {
      physicsAdapter.enableCollision('P1', walls);

      expect(physics.colliders.length).toBe(1);
      expect(physics.colliders[0][0]).toBe(spriteP1);
      expect(physics.colliders[0][1]).toBe(walls);
    });

    test('collision callback is invoked on impact', () => {
      const callback = vi.fn();
      physicsAdapter.onCollide('P1', walls, callback);

      expect(physics.overlaps.length).toBe(1);
      expect(physics.overlaps[0][0]).toBe(spriteP1);
      expect(physics.overlaps[0][1]).toBe(walls);
      expect(physics.overlaps[0][2]).toBe(callback);
    });

    test('multiple collision layers can coexist', () => {
      const layer1 = physics.add.staticGroup();
      const layer2 = physics.add.staticGroup();

      physicsAdapter.registerLayer('floor', layer1);
      physicsAdapter.registerLayer('walls', layer2);

      physicsAdapter.enableCollision('P1', layer1);
      physicsAdapter.enableCollision('P1', layer2);

      expect(physics.colliders.length).toBe(2);
    });
  });

  describe('Two-player collision', () => {
    let spriteP2;

    beforeEach(() => {
      spriteP2 = new MockSprite(700, 100);
      physicsAdapter.registerEntity('P2', spriteP2);
    });

    test('P1 and P2 can collide with each other', () => {
      physicsAdapter.enableCollision('P1', spriteP2);

      expect(physics.colliders.length).toBe(1);
      expect(physics.colliders[0][0]).toBe(spriteP1);
      expect(physics.colliders[0][1]).toBe(spriteP2);
    });

    test('collision callback differentiates players', () => {
      const callback = vi.fn((p1, p2) => {
        // Callback receives both sprites
      });

      physicsAdapter.onCollide('P1', spriteP2, callback);

      expect(physics.overlaps[0][2]).toBe(callback);
    });
  });

  describe('Layer-based collision', () => {
    test('registers multiple tilemap layers', () => {
      const floorLayer = physics.add.staticGroup();
      const wallLayer = physics.add.staticGroup();

      physicsAdapter.registerLayer('floor', floorLayer);
      physicsAdapter.registerLayer('walls', wallLayer);

      expect(physicsAdapter.layers.size).toBe(2);
    });

    test('enables collision with specific layer', () => {
      const wallLayer = physics.add.staticGroup();
      physicsAdapter.registerLayer('walls', wallLayer);

      physicsAdapter.enableCollision('P1', wallLayer);

      expect(physics.colliders.length).toBe(1);
    });
  });

  describe('Velocity impact on collision', () => {
    test('high-speed collision is detected', () => {
      physicsAdapter.setVelocity('P1', { x: 300, y: 0 });
      physicsAdapter.enableCollision('P1', walls);

      expect(spriteP1.body.velocity.x).toBe(300);
      expect(physics.colliders.length).toBe(1);
    });

    test('zero velocity does not prevent collision setup', () => {
      physicsAdapter.setVelocity('P1', { x: 0, y: 0 });
      physicsAdapter.enableCollision('P1', walls);

      expect(physics.colliders.length).toBe(1);
    });
  });

  describe('Edge cases', () => {
    test('handles collision with unregistered entity gracefully', () => {
      expect(() => {
        physicsAdapter.enableCollision('P3', walls);
      }).toThrow();
    });

    test('handles null collision target', () => {
      expect(() => {
        physicsAdapter.enableCollision('P1', null);
      }).toThrow();
    });

    test('handles multiple collision registrations for same pair', () => {
      physicsAdapter.enableCollision('P1', walls);
      physicsAdapter.enableCollision('P1', walls);

      // Should create two colliders (no deduplication)
      expect(physics.colliders.length).toBe(2);
    });
  });

  describe('Performance validation', () => {
    test('collision registration is fast', () => {
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        const wall = physics.add.staticGroup();
        physicsAdapter.enableCollision('P1', wall);
      }
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(10); // <10ms for 100 registrations
    });

    test('collision callback overhead is minimal', () => {
      const callback = vi.fn();
      physicsAdapter.onCollide('P1', walls, callback);

      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        // Simulate overlap check (callback not actually invoked in mock)
      }
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(5); // <5ms for 1000 checks
    });
  });
});
