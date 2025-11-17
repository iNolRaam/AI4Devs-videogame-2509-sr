import { describe, test, beforeEach } from 'vitest';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';

// Navigation integration test using ES modules
import gameState from '../../../src/infrastructure/config/GameState.js';
import MenuScene from '../../../src/infrastructure/scenes/MenuScene.js';

describe('Menu Navigation', () => {
  let dom;
  let menu;
  let options;

  beforeEach(() => {
    dom = new JSDOM('<!doctype html><div id="menu-root"></div>', { url: 'http://localhost' });
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
    globalThis.addEventListener = dom.window.addEventListener.bind(dom.window);
    globalThis.dispatchEvent = dom.window.dispatchEvent.bind(dom.window);

    gameState.reset();
    const root = document.getElementById('menu-root');
    menu = new MenuScene({ root, onStart: () => {} });
    menu.mount();

    options = [...document.querySelectorAll('.menu-option')];
  });

  test('should render 3 menu options with initial focus on 1P', () => {
    assert.strictEqual(options.length, 3, 'Should render 3 options');
    assert.ok(options[0].classList.contains('focused'), 'Initial focus should be on 1P');
  });

  test('should move focus to 2P on ArrowDown', () => {
    globalThis.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
    assert.ok(options[1].classList.contains('focused'), 'Focus should move to 2P');
  });

  test('should move focus to START on second ArrowDown', () => {
    globalThis.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
    globalThis.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
    assert.ok(options[2].classList.contains('focused'), 'Focus should move to START');
  });

  test('should wrap focus back to 1P on third ArrowDown', () => {
    globalThis.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
    globalThis.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
    globalThis.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
    assert.ok(options[0].classList.contains('focused'), 'Focus should wrap to 1P');
  });
});

