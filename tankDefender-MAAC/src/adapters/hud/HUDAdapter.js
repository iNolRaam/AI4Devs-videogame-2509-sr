// HUDAdapter stub
// buildHUD({ levelId, enemyCount, players }) returns a minimal DTO

class HUDAdapter {
  buildHUD({ levelId, enemyCount, players }) {
    return {
      title: `Level ${levelId}`,
      enemyRemaining: enemyCount,
      players: players.map(p => ({ id: p.id, lives: p.lives }))
    };
  }
}

export default HUDAdapter;
