// LevelJSONRepository stub
// Provides getLevel(levelId) returning static data for level 1

class LevelJSONRepository {
  constructor() {
    this.levels = {
      1: {
        id: 1,
        enemyCount: 15,
        spawns: {
          P1: { x: 32, y: 448 },
          P2: { x: 96, y: 448 }
        },
        tiles: [] // placeholder for map layout
      }
    };
  }

  getLevel(levelId) {
    return this.levels[levelId] || null;
  }
}

export default LevelJSONRepository;
