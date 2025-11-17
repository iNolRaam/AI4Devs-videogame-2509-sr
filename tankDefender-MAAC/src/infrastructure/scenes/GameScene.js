// GameScene stub
// start(initBundle) prepares internal state; render() would hook phaser later

class GameScene {
  state = null;

  start(initBundle) {
    if (!(initBundle?.mode)) throw new Error('GameScene.start: invalid init bundle');
    this.state = {
      mode: initBundle.mode,
      levelId: initBundle.levelId,
      enemyCount: initBundle.enemyCount,
      players: initBundle.players,
      hud: initBundle.hud,
      tiles: initBundle.tiles
    };
    return this.state;
  }
}

module.exports = GameScene;
if (typeof globalThis !== 'undefined') {
  globalThis.GameScene = GameScene;
}
