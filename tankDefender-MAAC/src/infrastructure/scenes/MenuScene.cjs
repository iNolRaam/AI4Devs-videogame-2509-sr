// CommonJS wrapper for MenuScene to allow Node-based integration tests
const GameState = require('../config/GameState.js');

class MenuScene {
  constructor({ root, onStart }) {
    if (!root) throw new Error('MenuScene requires a root element');
    this.root = root;
    this.onStart = typeof onStart === 'function' ? onStart : () => {};
    this.options = [
      { id: '1P', label: '1 Player' },
      { id: '2P', label: '2 Players' },
      { id: 'START', label: 'Start' },
    ];
    this.focusIdx = 0;
    this.selectedMode = GameState.getSelectedMode();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  mount() {
    this.root.innerHTML = '';
    const wrapper = this.root.ownerDocument.createElement('div');
    wrapper.className = 'menu-wrapper';
    wrapper.setAttribute('role', 'menu');
    this.optionEls = this.options.map((opt, i) => {
      const btn = this.root.ownerDocument.createElement('button');
      btn.className = 'menu-option';
      btn.setAttribute('role', 'menuitem');
      btn.dataset.id = opt.id;
      btn.textContent = opt.label + (opt.id === this.selectedMode ? ' ✓' : '');
      btn.tabIndex = i === this.focusIdx ? 0 : -1;
      if (i === this.focusIdx) btn.classList.add('focused');
      wrapper.appendChild(btn);
      return btn;
    });
    this.root.appendChild(wrapper);
    globalThis.addEventListener('keydown', this.handleKeyDown);
  }
  unmount() {
    globalThis.removeEventListener('keydown', this.handleKeyDown);
    this.root.innerHTML = '';
  }
  setFocus(newIdx) {
    if (newIdx < 0) newIdx = this.options.length - 1;
    if (newIdx >= this.options.length) newIdx = 0;
    const oldBtn = this.optionEls[this.focusIdx];
    const newBtn = this.optionEls[newIdx];
    if (oldBtn) { oldBtn.tabIndex = -1; oldBtn.classList.remove('focused'); }
    if (newBtn) { newBtn.tabIndex = 0; newBtn.classList.add('focused'); newBtn.focus(); }
    this.focusIdx = newIdx;
  }
  applySelection(id) {
    if (id === '1P' || id === '2P') {
      GameState.setSelectedMode(id);
      this.selectedMode = id;
      for (const el of this.optionEls) {
        const optId = el.dataset.id;
        let base;
        if (optId === '1P') base = '1 Player';
        else if (optId === '2P') base = '2 Players';
        else base = 'Start';
        el.textContent = base + (optId === this.selectedMode ? ' ✓' : '');
      }
    }
    if (id === 'START') {
      this.onStart({ mode: this.selectedMode, levelId: 1 });
      return;
    }
  }
  handleKeyDown(e) {
    const key = e.key;
    if (key === 'ArrowDown' || key === 'ArrowRight' || (key === 'Tab' && !e.shiftKey)) {
      e.preventDefault(); this.setFocus(this.focusIdx + 1); return;
    }
    if (key === 'ArrowUp' || key === 'ArrowLeft' || (key === 'Tab' && e.shiftKey)) {
      e.preventDefault(); this.setFocus(this.focusIdx - 1); return;
    }
    if (key === 'Enter') {
      e.preventDefault(); const focused = this.options[this.focusIdx]; if (focused) this.applySelection(focused.id);
    }
  }
}
module.exports = MenuScene;
