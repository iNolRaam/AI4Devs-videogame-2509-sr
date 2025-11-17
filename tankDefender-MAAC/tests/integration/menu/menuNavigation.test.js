const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

// Navigation integration test using CommonJS wrapper
const gameState = require(path.join(process.cwd(), 'src/infrastructure/config/GameState.js'));
const MenuScene = require(path.join(process.cwd(), 'src/infrastructure/scenes/MenuScene.cjs'));

  const dom = new JSDOM('<!doctype html><div id="menu-root"></div>', { url: 'http://localhost' });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.addEventListener = dom.window.addEventListener.bind(dom.window);
  globalThis.dispatchEvent = dom.window.dispatchEvent.bind(dom.window);

  gameState.reset();
  const root = document.getElementById('menu-root');
  const menu = new MenuScene({ root, onStart: () => {} });
  menu.mount();

  const options = [...document.querySelectorAll('.menu-option')];
  assert.strictEqual(options.length, 3, 'Should render 3 options');
  assert.ok(options[0].classList.contains('focused'), 'Initial focus should be on 1P');

  // ArrowDown moves to 2P
  globalThis.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
  assert.ok(options[1].classList.contains('focused'), 'Focus should move to 2P');

  // ArrowDown moves to START
  globalThis.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
  assert.ok(options[2].classList.contains('focused'), 'Focus should move to START');

  // ArrowDown wraps around to 1P
  globalThis.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' }));
  assert.ok(options[0].classList.contains('focused'), 'Focus should wrap to 1P');

console.log('OK: menuNavigation test passed');

