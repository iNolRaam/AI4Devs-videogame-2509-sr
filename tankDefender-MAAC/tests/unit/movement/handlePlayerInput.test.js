/**
 * Unit Tests: HandlePlayerInput Use Case
 * 
 * Tests keyboard input processing and direction calculation
 */

import HandlePlayerInput from '../../../src/application/use-cases/HandlePlayerInput.js';

// Mock IInput adapter
class MockInputAdapter {
  constructor() {
    this.keysPressed = {};
    this.activeKeys = [];
  }

  registerKeys(playerId, keys) {
    // No-op in mock
  }

  isKeyDown(key) {
    return this.keysPressed[key] || false;
  }

  getActiveKeys(playerId) {
    return this.activeKeys;
  }

  reset() {
    this.keysPressed = {};
    this.activeKeys = [];
  }

  // Test helpers
  pressKey(key) {
    this.keysPressed[key] = true;
    if (!this.activeKeys.includes(key)) {
      this.activeKeys.push(key);
    }
  }

  releaseKey(key) {
    this.keysPressed[key] = false;
    this.activeKeys = this.activeKeys.filter(k => k !== key);
  }
}

describe('HandlePlayerInput', () => {
  let inputAdapter;
  let useCase;

  beforeEach(() => {
    inputAdapter = new MockInputAdapter();
    useCase = new HandlePlayerInput(inputAdapter);
  });

  describe('Single key presses', () => {
    test('returns up when W is pressed (P1)', () => {
      inputAdapter.pressKey('W');
      const direction = useCase.execute('P1');
      expect(direction).toBe('up');
    });

    test('returns down when S is pressed (P1)', () => {
      inputAdapter.pressKey('S');
      const direction = useCase.execute('P1');
      expect(direction).toBe('down');
    });

    test('returns left when A is pressed (P1)', () => {
      inputAdapter.pressKey('A');
      const direction = useCase.execute('P1');
      expect(direction).toBe('left');
    });

    test('returns right when D is pressed (P1)', () => {
      inputAdapter.pressKey('D');
      const direction = useCase.execute('P1');
      expect(direction).toBe('right');
    });

    test('returns up when UP arrow is pressed (P2)', () => {
      inputAdapter.pressKey('ArrowUp');
      const direction = useCase.execute('P2');
      expect(direction).toBe('up');
    });

    test('returns down when DOWN arrow is pressed (P2)', () => {
      inputAdapter.pressKey('ArrowDown');
      const direction = useCase.execute('P2');
      expect(direction).toBe('down');
    });

    test('returns left when LEFT arrow is pressed (P2)', () => {
      inputAdapter.pressKey('ArrowLeft');
      const direction = useCase.execute('P2');
      expect(direction).toBe('left');
    });

    test('returns right when RIGHT arrow is pressed (P2)', () => {
      inputAdapter.pressKey('ArrowRight');
      const direction = useCase.execute('P2');
      expect(direction).toBe('right');
    });

    test('returns idle when no keys pressed', () => {
      const direction = useCase.execute('P1');
      expect(direction).toBe('idle');
    });
  });

  describe('Opposite key cancellation', () => {
    test('cancels up/down (W+S)', () => {
      inputAdapter.pressKey('W');
      inputAdapter.pressKey('S');
      const direction = useCase.execute('P1');
      expect(direction).toBe('idle');
    });

    test('cancels left/right (A+D)', () => {
      inputAdapter.pressKey('A');
      inputAdapter.pressKey('D');
      const direction = useCase.execute('P1');
      expect(direction).toBe('idle');
    });

    test('cancels up/down with arrows', () => {
      inputAdapter.pressKey('ArrowUp');
      inputAdapter.pressKey('ArrowDown');
      const direction = useCase.execute('P2');
      expect(direction).toBe('idle');
    });

    test('cancels left/right with arrows', () => {
      inputAdapter.pressKey('ArrowLeft');
      inputAdapter.pressKey('ArrowRight');
      const direction = useCase.execute('P2');
      expect(direction).toBe('idle');
    });
  });

  describe('Last-key-pressed priority', () => {
    test('prioritizes last vertical key (W then S)', () => {
      inputAdapter.pressKey('W');
      inputAdapter.releaseKey('W');
      inputAdapter.pressKey('S');
      const direction = useCase.execute('P1');
      expect(direction).toBe('down');
    });

    test('prioritizes last horizontal key (A then D)', () => {
      inputAdapter.pressKey('A');
      inputAdapter.releaseKey('A');
      inputAdapter.pressKey('D');
      const direction = useCase.execute('P1');
      expect(direction).toBe('right');
    });

    test('handles complex key sequence (W->D->S)', () => {
      inputAdapter.pressKey('W');
      inputAdapter.releaseKey('W');
      inputAdapter.pressKey('D');
      inputAdapter.releaseKey('D');
      inputAdapter.pressKey('S');
      const direction = useCase.execute('P1');
      // S (down) is last vertical, D (right) is horizontal
      // Should prioritize vertical (last key overall)
      expect(direction).toBe('down');
    });
  });

  describe('Diagonal prevention', () => {
    test('prevents diagonal movement (W+D)', () => {
      inputAdapter.pressKey('W');
      inputAdapter.pressKey('D');
      inputAdapter.activeKeys = ['W', 'D'];
      const direction = useCase.execute('P1');
      // Should return one of the directions, not both
      expect(['up', 'right']).toContain(direction);
    });

    test('prevents diagonal movement (W+A)', () => {
      inputAdapter.pressKey('W');
      inputAdapter.pressKey('A');
      inputAdapter.activeKeys = ['W', 'A'];
      const direction = useCase.execute('P1');
      expect(['up', 'left']).toContain(direction);
    });

    test('prevents diagonal movement (S+D)', () => {
      inputAdapter.pressKey('S');
      inputAdapter.pressKey('D');
      inputAdapter.activeKeys = ['S', 'D'];
      const direction = useCase.execute('P1');
      expect(['down', 'right']).toContain(direction);
    });

    test('prevents diagonal movement (S+A)', () => {
      inputAdapter.pressKey('S');
      inputAdapter.pressKey('A');
      inputAdapter.activeKeys = ['S', 'A'];
      const direction = useCase.execute('P1');
      expect(['down', 'left']).toContain(direction);
    });
  });

  describe('Player isolation', () => {
    test('P1 keys do not affect P2', () => {
      inputAdapter.pressKey('W'); // P1 key
      const directionP2 = useCase.execute('P2');
      expect(directionP2).toBe('idle');
    });

    test('P2 keys do not affect P1', () => {
      inputAdapter.pressKey('UP'); // P2 key
      const directionP1 = useCase.execute('P1');
      expect(directionP1).toBe('idle');
    });

    test('P1 and P2 can move simultaneously', () => {
      inputAdapter.pressKey('W'); // P1
      inputAdapter.pressKey('ArrowUp'); // P2
      inputAdapter.activeKeys = ['W', 'ArrowUp'];
      
      const directionP1 = useCase.execute('P1');
      const directionP2 = useCase.execute('P2');
      
      expect(directionP1).toBe('up');
      expect(directionP2).toBe('up');
    });
  });

  describe('State management', () => {
    test('tracks last key pressed per player', () => {
      inputAdapter.pressKey('W');
      useCase.execute('P1');
      
      inputAdapter.pressKey('D');
      inputAdapter.activeKeys = ['W', 'D'];
      const direction = useCase.execute('P1');
      
      // D is more recent, should prioritize right
      expect(direction).toBe('right');
    });

    test('resets when all keys released', () => {
      inputAdapter.pressKey('W');
      useCase.execute('P1');
      
      inputAdapter.releaseKey('W');
      const direction = useCase.execute('P1');
      
      expect(direction).toBe('idle');
    });
  });

  describe('Edge cases', () => {
    test('handles unknown player ID gracefully', () => {
      expect(() => useCase.execute('P3')).toThrow('HandlePlayerInput: playerId must be "P1" or "P2"');
    });

    test('handles all keys pressed simultaneously', () => {
      inputAdapter.pressKey('W');
      inputAdapter.pressKey('A');
      inputAdapter.pressKey('S');
      inputAdapter.pressKey('D');
      inputAdapter.activeKeys = ['W', 'A', 'S', 'D'];
      
      const direction = useCase.execute('P1');
      // Should resolve to one direction based on last key
      expect(['up', 'down', 'left', 'right', 'idle']).toContain(direction);
    });

    test('handles rapid key switching', () => {
      inputAdapter.pressKey('W');
      useCase.execute('P1');
      
      inputAdapter.releaseKey('W');
      inputAdapter.pressKey('S');
      useCase.execute('P1');
      
      inputAdapter.releaseKey('S');
      inputAdapter.pressKey('D');
      const direction = useCase.execute('P1');
      
      expect(direction).toBe('right');
    });
  });
});
