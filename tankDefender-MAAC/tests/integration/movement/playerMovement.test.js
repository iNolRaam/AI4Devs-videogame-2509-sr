/**
 * Integration Tests: Player Movement E2E
 * 
 * Tests full player movement flow from keyboard input to sprite rendering
 */

import { vi } from 'vitest';
import HandlePlayerInput from '../../../src/application/use-cases/HandlePlayerInput.js';
import MovePlayer from '../../../src/application/use-cases/MovePlayer.js';
import Tank from '../../../src/domain/entities/Tank.js';
import KeyboardInputAdapter from '../../../src/adapters/input/KeyboardInputAdapter.js';
import PhaserPhysicsAdapter from '../../../src/adapters/physics/PhaserPhysicsAdapter.js';
import TankSpriteAdapter from '../../../src/adapters/rendering/TankSpriteAdapter.js';

// Mock Phaser environment
class MockKeyboardPlugin {
  constructor() {
    this.keys = {};
    this.cursors = {
      up: { isDown: false },
      down: { isDown: false },
      left: { isDown: false },
      right: { isDown: false }
    };
  }

  addKey(keyCode) {
    const key = { isDown: false, keyCode };
    this.keys[keyCode] = key;
    return key;
  }

  addKeys(keyString) {
    const keys = {};
    keyString.split(',').forEach(k => {
      const trimmed = k.trim();
      keys[trimmed] = this.addKey(trimmed);
    });
    return keys;
  }

  createCursorKeys() {
    return this.cursors;
  }

  // Test helpers
  pressKey(keyCode) {
    if (this.keys[keyCode]) {
      this.keys[keyCode].isDown = true;
    }
    // Handle arrow keys
    if (keyCode === 'UP' || keyCode === 'ArrowUp') {
      this.cursors.up.isDown = true;
    }
    if (keyCode === 'DOWN' || keyCode === 'ArrowDown') {
      this.cursors.down.isDown = true;
    }
    if (keyCode === 'LEFT' || keyCode === 'ArrowLeft') {
      this.cursors.left.isDown = true;
    }
    if (keyCode === 'RIGHT' || keyCode === 'ArrowRight') {
      this.cursors.right.isDown = true;
    }
  }

  releaseKey(keyCode) {
    if (this.keys[keyCode]) {
      this.keys[keyCode].isDown = false;
    }
    // Handle arrow keys
    if (keyCode === 'UP' || keyCode === 'ArrowUp') {
      this.cursors.up.isDown = false;
    }
    if (keyCode === 'DOWN' || keyCode === 'ArrowDown') {
      this.cursors.down.isDown = false;
    }
    if (keyCode === 'LEFT' || keyCode === 'ArrowLeft') {
      this.cursors.left.isDown = false;
    }
    if (keyCode === 'RIGHT' || keyCode === 'ArrowRight') {
      this.cursors.right.isDown = false;
    }
  }
}

class MockSprite {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.body = {
      velocity: { x: 0, y: 0 },
      setVelocity: vi.fn((x, y) => {
        this.body.velocity.x = x;
        this.body.velocity.y = y;
      })
    };
    this.visible = true;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  setVisible(visible) {
    this.visible = visible;
    return this;
  }

  setTint(color) {
    this.tintTopLeft = color;
    return this;
  }

  clearTint() {
    delete this.tintTopLeft;
    return this;
  }

  setAlpha(alpha) {
    this.alpha = alpha;
    return this;
  }

  setScale(scale) {
    this.scaleX = scale;
    this.scaleY = scale;
    return this;
  }

  destroy() {
    this.destroyed = true;
  }
}

class MockPhysics {
  constructor() {
    this.world = {
      setBounds: vi.fn()
    };
  }

  add = {
    existing: (sprite) => sprite,
    collider: vi.fn(),
    overlap: vi.fn()
  };
}

describe('Player Movement Integration', () => {
  let keyboard;
  let physics;
  let inputAdapter;
  let physicsAdapter;
  let renderAdapter;
  let handlePlayerInput;
  let movePlayer;
  let tankP1;
  let spriteP1;

  beforeEach(() => {
    // Setup mock Phaser environment
    keyboard = new MockKeyboardPlugin();
    physics = new MockPhysics();

    // Initialize adapters
    inputAdapter = new KeyboardInputAdapter(keyboard);
    physicsAdapter = new PhaserPhysicsAdapter(physics);
    renderAdapter = new TankSpriteAdapter();

    // Register P1 keys
    inputAdapter.registerKeys('P1', ['W', 'A', 'S', 'D']);

    // Create tank and sprite
    tankP1 = new Tank('P1', { x: 100, y: 100 }, 120);
    spriteP1 = new MockSprite(100, 100);

    // Register entities
    renderAdapter.registerSprite('P1', spriteP1);
    physicsAdapter.registerEntity('P1', spriteP1);

    // Initialize use cases
    handlePlayerInput = new HandlePlayerInput(inputAdapter);
    movePlayer = new MovePlayer(physicsAdapter, renderAdapter);
  });

  describe('Single player movement flow', () => {
    test('complete UP movement cycle', () => {
      // 1. Press W key
      keyboard.pressKey('W');

      // 2. Process input
      const direction = handlePlayerInput.execute('P1');
      expect(direction).toBe('up');

      // 3. Execute movement
      movePlayer.execute(tankP1, direction);

      // 4. Verify physics
      expect(spriteP1.body.velocity.x).toBe(0);
      expect(spriteP1.body.velocity.y).toBe(-120);

      // 5. Verify rendering
      expect(spriteP1.angle).toBe(0);

      // 6. Verify domain state
      expect(tankP1.direction).toBe('up');
      expect(tankP1.getVelocity()).toEqual({ x: 0, y: -120 });
    });

    test('complete LEFT movement cycle', () => {
      keyboard.pressKey('A');

      const direction = handlePlayerInput.execute('P1');
      movePlayer.execute(tankP1, direction);

      expect(spriteP1.body.velocity.x).toBe(-120);
      expect(spriteP1.body.velocity.y).toBe(0);
      expect(spriteP1.angle).toBe(270);
      expect(tankP1.direction).toBe('left');
    });

    test('stop movement when key released', () => {
      // Move right
      keyboard.pressKey('D');
      let direction = handlePlayerInput.execute('P1');
      movePlayer.execute(tankP1, direction);

      expect(spriteP1.body.velocity.x).toBe(120);

      // Release key
      keyboard.releaseKey('D');
      direction = handlePlayerInput.execute('P1');
      movePlayer.execute(tankP1, direction);

      expect(spriteP1.body.velocity.x).toBe(0);
      expect(spriteP1.body.velocity.y).toBe(0);
    });
  });

  describe('Direction changes', () => {
    test('smooth direction change from UP to RIGHT', () => {
      // Start moving up
      keyboard.pressKey('W');
      let direction = handlePlayerInput.execute('P1');
      movePlayer.execute(tankP1, direction);

      expect(tankP1.direction).toBe('up');
      expect(spriteP1.angle).toBe(0);

      // Change to right
      keyboard.releaseKey('W');
      keyboard.pressKey('D');
      direction = handlePlayerInput.execute('P1');
      movePlayer.execute(tankP1, direction);

      expect(tankP1.direction).toBe('right');
      expect(spriteP1.angle).toBe(90);
      expect(spriteP1.body.velocity.x).toBe(120);
      expect(spriteP1.body.velocity.y).toBe(0);
    });

    test('handles 180-degree turn (UP to DOWN)', () => {
      keyboard.pressKey('W');
      let direction = handlePlayerInput.execute('P1');
      movePlayer.execute(tankP1, direction);

      keyboard.releaseKey('W');
      keyboard.pressKey('S');
      direction = handlePlayerInput.execute('P1');
      movePlayer.execute(tankP1, direction);

      expect(tankP1.direction).toBe('down');
      expect(spriteP1.angle).toBe(180);
      expect(spriteP1.body.velocity.y).toBe(120);
    });
  });

  describe('Two players simultaneously', () => {
    let tankP2, spriteP2;

    beforeEach(() => {
      // Setup P2
      inputAdapter.registerKeys('P2', ['UP', 'DOWN', 'LEFT', 'RIGHT']);
      tankP2 = new Tank('P2', { x: 700, y: 100 }, 120);
      spriteP2 = new MockSprite(700, 100);
      renderAdapter.registerSprite('P2', spriteP2);
      physicsAdapter.registerEntity('P2', spriteP2);
    });

    test('P1 and P2 move independently', () => {
      // P1 moves up
      keyboard.pressKey('W');
      const dirP1 = handlePlayerInput.execute('P1');
      movePlayer.execute(tankP1, dirP1);

      // P2 moves down
      keyboard.pressKey('DOWN');
      const dirP2 = handlePlayerInput.execute('P2');
      movePlayer.execute(tankP2, dirP2);

      // Verify P1
      expect(spriteP1.body.velocity.y).toBe(-120);
      expect(spriteP1.angle).toBe(0);

      // Verify P2
      expect(spriteP2.body.velocity.y).toBe(120);
      expect(spriteP2.angle).toBe(180);
    });

    test('P1 and P2 do not interfere with each other', () => {
      // Both press their UP keys
      keyboard.pressKey('W'); // P1 UP
      keyboard.pressKey('UP'); // P2 UP

      const dirP1 = handlePlayerInput.execute('P1');
      const dirP2 = handlePlayerInput.execute('P2');

      movePlayer.execute(tankP1, dirP1);
      movePlayer.execute(tankP2, dirP2);

      expect(spriteP1.body.velocity.y).toBe(-120);
      expect(spriteP2.body.velocity.y).toBe(-120);
      expect(tankP1.direction).toBe('up');
      expect(tankP2.direction).toBe('up');
    });
  });

  describe('Collision handling', () => {
    test('registers collision with static group', () => {
      const mockWalls = { name: 'walls' };
      physicsAdapter.enableCollision('P1', mockWalls);

      expect(physics.add.collider).toHaveBeenCalledWith(spriteP1, mockWalls);
    });

    test('collision callback is invoked', () => {
      const mockEnemy = { name: 'enemy' };
      const callback = vi.fn();

      physicsAdapter.onCollide('P1', mockEnemy, callback);

      expect(physics.add.overlap).toHaveBeenCalledWith(spriteP1, mockEnemy, callback);
    });
  });

  describe('Performance validation', () => {
    test('handles 60 FPS update loop', () => {
      const iterations = 60; // Simulate 1 second at 60 FPS
      keyboard.pressKey('D');

      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        const direction = handlePlayerInput.execute('P1');
        movePlayer.execute(tankP1, direction);
      }
      const duration = performance.now() - start;

      // Should complete 60 iterations in <16ms (target: 1000ms/60fps)
      expect(duration).toBeLessThan(16);
    });

    test('maintains stable velocity during continuous movement', () => {
      keyboard.pressKey('W');

      for (let i = 0; i < 10; i++) {
        const direction = handlePlayerInput.execute('P1');
        movePlayer.execute(tankP1, direction);

        expect(spriteP1.body.velocity.y).toBe(-120);
        expect(spriteP1.body.velocity.x).toBe(0);
      }
    });
  });

  describe('Edge cases', () => {
    test('handles rapid key spam', () => {
      for (let i = 0; i < 20; i++) {
        keyboard.pressKey('W');
        keyboard.releaseKey('W');
        keyboard.pressKey('S');
        keyboard.releaseKey('S');
      }

      const direction = handlePlayerInput.execute('P1');
      movePlayer.execute(tankP1, direction);

      // Should end in stable state (NONE)
      expect(direction).toBe('idle');
      expect(spriteP1.body.velocity.x).toBe(0);
      expect(spriteP1.body.velocity.y).toBe(0);
    });

    test('recovers from invalid state', () => {
      // Corrupt tank state
      tankP1.direction = 'INVALID';

      // Should recover when valid direction provided
      keyboard.pressKey('D');
      const direction = handlePlayerInput.execute('P1');
      movePlayer.execute(tankP1, direction);

      expect(tankP1.direction).toBe('right');
      expect(spriteP1.body.velocity.x).toBe(120);
    });
  });
});
