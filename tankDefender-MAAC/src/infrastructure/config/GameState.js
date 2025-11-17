const VALID_MODES = ['1P', '2P'];
let selectedMode = '1P';

function validateMode(mode) {
  if (VALID_MODES.indexOf(mode) === -1) {
    throw new Error('Invalid mode: ' + mode + '. Expected one of ' + VALID_MODES.join(', '));
  }
}

const GameState = {
  getSelectedMode() {
    return selectedMode;
  },
  setSelectedMode(mode) {
    validateMode(mode);
    selectedMode = mode;
  },
  reset() {
    selectedMode = '1P';
  },
  _debug: {
    // expose for tests
    VALID_MODES: VALID_MODES.slice()
  }
};

export default GameState;
