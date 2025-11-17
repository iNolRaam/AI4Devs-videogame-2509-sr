// StartGame Use Case (MENU-3)
// Input: selectedMode ('1P'|'2P'), levelId (number)
// Output: initialization bundle for GameScene

function StartGame({ selectedMode, levelId = 1, levelRepository, hudAdapter }) {
  if (!selectedMode || !['1P', '2P'].includes(selectedMode)) {
    throw new Error('StartGame: invalid selectedMode');
  }
  if (!levelRepository || typeof levelRepository.getLevel !== 'function') {
    throw new Error('StartGame: levelRepository missing or invalid');
  }
  if (!hudAdapter || typeof hudAdapter.buildHUD !== 'function') {
    throw new Error('StartGame: hudAdapter missing or invalid');
  }

  const level = levelRepository.getLevel(levelId);
  if (!level) throw new Error('StartGame: level not found');

  // Players spawn positions (placeholder coordinates)
  const players = [
    { id: 'P1', lives: 3, spawn: level.spawns.P1 }
  ];
  if (selectedMode === '2P') {
    players.push({ id: 'P2', lives: 3, spawn: level.spawns.P2 });
  }

  const enemyCount = level.enemyCount;
  const hud = hudAdapter.buildHUD({ levelId, enemyCount, players });

  return {
    levelId,
    mode: selectedMode,
    enemyCount,
    players,
    hud,
    tiles: level.tiles // placeholder map/tiles data
  };
}

export default StartGame;
