import { describe, test } from 'vitest';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';

import GameState from '../../../src/infrastructure/config/GameState.js';
import MenuScene from '../../../src/infrastructure/scenes/MenuScene.js';
import StartGame from '../../../src/application/use-cases/StartGame.js';
import RestartGame from '../../../src/application/use-cases/RestartGame.js';
import LevelJSONRepository from '../../../src/adapters/repositories/LevelJSONRepository.js';
import HUDAdapter from '../../../src/adapters/hud/HUDAdapter.js';

describe('Menu E2E Integration', () => {
  test('Menu -> Start -> Game -> Result -> Restart keeps mode', () => {
    // E2E smoke: Menu -> Start -> Game -> Result -> Restart keeps mode

    const dom = new JSDOM('<!doctype html><div id="menu-root"></div>', { url: 'http://localhost' });
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
    globalThis.addEventListener = dom.window.addEventListener.bind(dom.window);
    globalThis.dispatchEvent = dom.window.dispatchEvent.bind(dom.window);

    GameState.reset();
    const root = document.getElementById('menu-root');
    let startBundle = null;

    const menu = new MenuScene({ root, onStart: ({ mode, levelId }) => {
      const levelRepo = new LevelJSONRepository();
      const hudAdapter = new HUDAdapter();
      startBundle = StartGame({ selectedMode: mode, levelId, levelRepository: levelRepo, hudAdapter });
    }});
    menu.mount();

    // Select 2P
    globalThis.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' })); // focus 2P
    assert.ok(root.querySelectorAll('.menu-option')[1].classList.contains('focused'), 'Focus on 2P');
    globalThis.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter' })); // select 2P
    assert.strictEqual(GameState.getSelectedMode(), '2P', 'Mode set to 2P');

    // Move to START and trigger start
    globalThis.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'ArrowDown' })); // focus START
    assert.ok(root.querySelectorAll('.menu-option')[2].classList.contains('focused'), 'Focus on START');
    globalThis.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Enter' })); // start

    assert.ok(startBundle, 'Start bundle created');
    assert.strictEqual(startBundle.mode, '2P', 'Start bundle mode 2P');
    assert.strictEqual(startBundle.players.length, 2, 'Two players spawned');

    // Simulate result + restart
    const levelRepo2 = new LevelJSONRepository();
    const hudAdapter2 = new HUDAdapter();
    const restartBundle = RestartGame({ levelRepository: levelRepo2, hudAdapter: hudAdapter2 });
    assert.strictEqual(restartBundle.mode, '2P', 'Restart preserves 2P mode');
    assert.strictEqual(restartBundle.players.length, 2, 'Two players on restart');
  });
});
